import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams, useForm, useHistory } from 'react-router-dom';
import {
  Form,
  Input,
  message,
  Modal,
  Row,
  Col,
  Button,
  InputNumber,
  Menu,
  Empty,
  Dropdown,
  Spin,
  Card,
  Switch,
  Select,
  DatePicker,
  Result,
} from 'antd';
import './reserv.css';
import QRCode from 'react-qr-code';
import { DownOutlined, LoadingOutlined } from '@ant-design/icons';
import TableHijau from '../../asset/icon/tableHijau.png';
import TableMerah from '../../asset/icon/tableMerah.png';
import myAxios from '../../myAxios';
import { UserContext } from '../../context/UserContext';
import Moment from 'moment';
import { Subtitles } from '@material-ui/icons';
import moment from 'moment';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const { Search } = Input;
const { Option } = Select;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const ReservasiTakLangsung = () => {
  let history = useHistory();
  const mytoken = localStorage.getItem('token');
  const wrapperRef = useRef(null);

  const [user, setUser] = useContext(UserContext);

  const [meja, setMeja] = useState(null);
  const [tempmeja, settempMeja] = useState(null);
  const [idMeja, setidMeja] = useState(null);
  const [subTitle, setSubTitle] = useState(null);

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  const [form] = Form.useForm();
  const [formReserv] = Form.useForm();

  const [togle, setTogle] = useState(false);
  const [display, setDisplay] = useState(false);
  const [options, setOptions] = useState([]);
  const [cust, setCust] = useState(null);
  const [search, setSearch] = useState('');

  const [reservasi, setReservasi] = useState(null);
  //QR CODE
  const [modalQr, setmodalQr] = useState(false);
  const [modalTanggal, setmodalTanggal] = useState(true);
  const [objectQr, setobjectQr] = useState('');
  const [tempModal, setTempModal] = useState(false);

  //Simpan Data Tanggal Sesi
  const [tglSesi, setTglSesi] = useState({
    sesi_reservasi: null,
    tanggal_reservasi: null,
  });

  const onFilter = (param) => {
    console.log('TEMP MEJA = ' + param);
    console.log('TEMP MEJA = ' + tempmeja);
    setMeja(
      tempmeja.filter((i) => {
        return i.status == param;
      })
    );
  };

  const handleCancel = () => {
    setmodalQr(false);
  };

  const openModalQr = (id) => {
    console.log('data qr');
    setmodalQr(true);
    setobjectQr(JSON.stringify(reservasi));

    // this.setState({
    //   modalQr: true,
    //   objectQr: JSON.stringify(filter[0]),
    //   idEdit: id,
    // });
  };

  const onSubmitQr = (idEdit) => {
    let newObj;
    this.setState({ loading: true });
    myAxios
      .put(`updateStatusReservasi/${this.state.idEdit}`, newObj, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((res) => {
        message.success('Berhasil Cetak Qr Pemesanan');
        let data = res.data.data;
        setmodalQr(false);
        setobjectQr(JSON.stringify(reservasi));
        setLoading(false);
      })
      .catch((err) => {
        message.error(
          'Cetak Qr Pemesanan Gagal : ' + err.response.data.message
        );
      });
  };

  const openReservasi = (val) => {
    console.log('Get Meja');
    console.log(val);
    if (val.status === 'Terisi') {
      message.error('Meja sudah terisi!');
    } else {
      setModal(true);
      setidMeja(val.id);
      var tanggal = Moment(tglSesi, 'YYYY-MM-DD');
      // setnoMeja(val.nomor_meja);
      console.log(tglSesi);
      formReserv.setFieldsValue({
        nomor_meja: val.nomor_meja,
        tanggal: tglSesi.tanggal_reservasi,
        sesi_reservasi: tglSesi.sesi_reservasi,
      });
    }
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <a
          target='_blank'
          rel='noopener noreferrer'
          onClick={() => onFilter('Kosong')}>
          Tampil Meja Kosong
        </a>
      </Menu.Item>
      <Menu.Item>
        <a
          target='_blank'
          rel='noopener noreferrer'
          onClick={() => onFilter('Terisi')}>
          Tampil Meja Terisi
        </a>
      </Menu.Item>
    </Menu>
  );

  const getCustomer = () => {
    myAxios
      .get(`showCustomer`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((res) => {
        const data = res.data.data;
        var temp = [];
        console.log('Data Customerku = ');
        console.log(temp);
        setOptions(data);
      });
  };

  const hapusFilter = (values) => {
    setMeja(tempmeja);
  };

  const onFinish = async (values) => {
    setLoading(true);
    console.log('On Finish Reservasi Langsung');
    var date = Moment(values.tanggal).format('YYYY-MM-DD');
    var dateShow = Moment(values.tanggal).format('MMMM Do YYYY, h:mm:ss a');
    var dateShowNow = Moment(new Date()).format('DD MMMM YYYY');

    let newObj = {
      nama_customer: values.nama_customer,
      email: values.email,
      telepon: '0' + values.telepon,
      tanggal_reservasi: date,
      sesi_reservasi: values.sesi_reservasi,
      id_meja: idMeja,
      id_karyawan: user.id_karyawan,
      tipe: togle,
      id_customer: cust,
    };
    myAxios
      .post(`storeReservasiLangsung`, newObj, {
        headers: {
          Authorization: 'Bearer ' + mytoken,
        },
      })
      .then((res) => {
        setLoading(false);
        setModal(false);
        setReservasi(newObj);
        setSubTitle(
          `Reservasi tanggal ${dateShow} sesi ${values.sesi_reservasi} atas nama ${values.nama_customer} dengan Nomor Meja ${values.nomor_meja}  berhasil ditambahkan pada ${dateShowNow}`
        );
      })
      .catch((err) => {
        setSubTitle(null);
        setLoading(false);
        console.log(err.response.data.message);
        message.error('Tambah Reservasi Gagal : ' + err.response.data.message);
      });
  };

  const onFinishTanggalSesi = (values) => {
    setLoading(true);
    console.log('On Finish Input Tanggal dan Sesi');
    var date = Moment(values.tanggal_reservasi).format('YYYY-MM-DD');

    let newObj = {
      tanggal_reservasi: date,
      sesi_reservasi: values.sesi,
    };
    console.log(newObj);
    console.log('tak ');
    myAxios
      .post(`tampilMejaReservasi`, newObj, {
        headers: {
          Authorization: 'Bearer ' + mytoken,
        },
      })
      .then((res) => {
        var data = res.data.data;
        console.log('data meja reserv');
        console.log(data);
        setLoading(false);
        setmodalTanggal(false);
        setMeja(data);
        settempMeja(data);
        setTempModal(true);
        setTglSesi({
          tanggal_reservasi: values.tanggal_reservasi,
          sesi_reservasi: values.sesi,
          tgl_show: Moment(values.tanggal_reservasi).format('LL'),
        });
        message.info('Silahkan memilih meja yang kosong');
      })
      .catch((err) => {
        setSubTitle(null);
        setLoading(false);
        console.log(err.response.data.message);
        message.error('Gagal : ' + err.response.data.message);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    console.log('const search');
    console.log(search);
    console.log('Show Meja ' + user);

    console.log('SYALALA : ' + localStorage.getItem('token'));
    if (meja === null) {
      getCustomer();
    }
    console.log(meja);
  });

  const checkActionCode = async (rule, value, callback) => {
    console.log('value ' + value);
    console.log(value);
    if (value === '' || value === undefined) {
      rule.message = 'Nomor Telepon Wajib diisi!';
      formReserv.setFields({
        telepon: {
          value: value,
          errors: [new Error('forbid ha')],
        },
      });
    } else if (value[0] == 0 || value[0] != 8) {
      rule.message = 'Nomor Telepon Harus diawali dengan 8!';
      formReserv.setFields({
        telepon: {
          value: value,
          errors: [new Error('forbid ha')],
        },
      });
    } else if (value.length < 10) {
      rule.message = 'Nomor Telepon Harus lebih dari 10!';
      formReserv.setFields({
        telepon: {
          value: value,
          errors: [new Error('forbid ha')],
        },
      });
    } else if (value.length > 14) {
      rule.message = 'Nomor Telepon Harus kurang dari 14!';
      formReserv.setFields({
        telepon: {
          value: value,
          errors: [new Error('forbid ha')],
        },
      });
    } else {
      await callback();
    }
  };

  const togleCust = (evt) => {
    console.log(evt);
    setTogle(evt);
    if (evt === false) {
      form.setFieldsValue({
        nama_customer: '',
        telepon: '',
        email: '',
      });
      setCust(null);
    }
  };

  const onChange = (value) => {
    console.log(`selected ${value}`);
    const temp = options.filter((i) => {
      return i.id == value;
    });
    const newTemp = temp[0];
    formReserv.setFieldsValue({
      nama_customer: newTemp.nama_customer,
      telepon: newTemp.telepon.slice(1),
      email: newTemp.email,
    });
    setCust(value);
  };

  const onCancelModal = () => {
    setmodalTanggal(false);
    setModal(false);
    form.resetFields();
    formReserv.resetFields();
  };

  const onCancelModalTanggal = () => {
    if (tempModal === false) {
      message.error('Silahkan isi data reservasi dahulu!');
    } else {
      setmodalTanggal(false);
      form.resetFields();
    }
  };

  function onBlur() {
    console.log('blur');
  }

  function onFocus() {
    console.log('focus');
  }

  function onSearch(val) {
    console.log('search:', val);
  }

  const onChangeTgl = (evt) => {
    // console.log(evt);
    // var tanggal = Moment(evt._d, 'YYYY-MM-DD');
    // setTglSesi({ tanggal_reservasi: tanggal });
    // console.log(tglSesi);
  };
  const onChangeSesi = (evt) => {
    // console.log(evt);
    // setTglSesi({ sesi_reservasi: evt });
    // console.log(tglSesi);
  };

  return (
    <div style={{ padding: '25px 30px' }}>
      {subTitle && (
        <Result
          className='result'
          status='success'
          title='Reservasi tidak langsung berhasil ditambahkan!'
          subTitle={subTitle}
          extra={[
            <Button
              type='primary'
              key='console'
              onClick={() => history.push('/showReservasiTakLangsung')}>
              Kembali ke Reservasi
            </Button>,

            <Modal
              visible={modalQr}
              title='Cetak QR Code Pesanan'
              onCancel={handleCancel}
              footer={[]}
              width={400}>
              <h1 style={{ textAlign: 'center' }}>
                <QRCode
                  loading={loading}
                  fgColor='#1F1F1F'
                  style={{
                    textAlign: 'center',
                    marginBottom: '15px',
                  }}
                  value={objectQr}
                />
                <Button
                  type='primary'
                  onClick={onSubmitQr}
                  loading={loading}
                  style={{
                    borderRadius: '5px',
                    margin: '10px',
                    width: '75%',
                  }}>
                  Cetak QR Code
                </Button>
              </h1>
            </Modal>,
          ]}
        />
      )}
      {!subTitle && (
        <>
          <h1
            style={{
              fontSize: 'x-large',
              color: '#001529',
              textTransform: 'uppercase',
            }}>
            <strong>Reservasi Tidak Langsung</strong>
          </h1>
          <div
            style={{
              border: '1px solid #8C98AD',
              marginTop: '-10px',
              marginBottom: '5px',
            }}></div>

          <Row justify='start' style={{ width: '100%' }}>
            <Col xs={24} md={3}>
              <Button
                type='primary'
                onClick={hapusFilter}
                style={{ width: '120px', marginTop: '10px' }}>
                Hapus Filter
              </Button>
            </Col>
            <Col xs={24} md={2}>
              <Dropdown overlay={menu}>
                <Button type='primary' style={{ marginTop: '10px' }}>
                  Filter <DownOutlined />
                </Button>
              </Dropdown>
            </Col>
            <Col xs={24} md={3}>
              <Button
                type='primary'
                onClick={() => setmodalTanggal(true)}
                style={{ marginTop: '10px' }}>
                Edit Tanggal dan Sesi
              </Button>
            </Col>
          </Row>
          <Card
            className='card-reservasi'
            style={{
              marginTop: 16,
              marginBottom: 16,
              borderRadius: '8px',
              border: '0.5px solid #3C8065',
              backgroundColor: '#DFF0D8',
            }}>
            <h1
              style={{
                color: '#3C8065',
                marginTop: '-10px',
                fontWeight: 'bold',
              }}>
              Data Reservasi
            </h1>
            <Row>
              <Col md={4}>
                <p
                  style={{
                    color: '#3C8065',
                    fontWeight: 'bold',
                  }}>
                  Tanggal Reservasi
                </p>
              </Col>
              <Col>
                <p
                  style={{
                    color: '#3C8065',
                    marginBottom: '-10px',
                    fontWeight: 'bold',
                  }}>
                  : {tglSesi.tgl_show}
                </p>
              </Col>
            </Row>
            <Row style={{ marginTop: '-15px' }}>
              <Col md={4}>
                <p
                  style={{
                    color: '#3C8065',
                    fontWeight: 'bold',
                  }}>
                  Sesi Reservasi
                </p>
              </Col>
              <Col>
                <p
                  style={{
                    color: '#3C8065',
                    marginBottom: '-10px',
                    fontWeight: 'bold',
                  }}>
                  : {tglSesi.sesi_reservasi}
                </p>
              </Col>
            </Row>
          </Card>
          <Modal
            title='Tambah Reservasi Tidak Langsung'
            centered
            visible={modal}
            onCancel={onCancelModal}
            footer={[]}
            width={400}>
            <Form
              name='nest-messages'
              form={formReserv}
              initialValues={{ remember: false }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}>
              <div className='switcher' style={{ marginBottom: '10px' }}>
                <Switch
                  size='small'
                  onChange={togleCust}
                  style={{ marginRight: '10px' }}
                />
                {togle === true && (
                  <label>
                    <strong>Tambah Pelanggan Baru</strong>
                  </label>
                )}
                {togle === false && (
                  <label>
                    <strong>Cari Pelanggan Lama</strong>
                  </label>
                )}
              </div>
              {togle === true && (
                <>
                  <Select
                    style={{ width: '100%' }}
                    autoComplete='off'
                    showSearch
                    placeholder='Cari Pelanggan'
                    optionFilterProp='children'
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onSearch={onSearch}
                    // filterOption={(input, option) =>
                    //   option.children
                    //     .toLowerCase()
                    //     .indexOf(input.toLowerCase()) >= 0
                    // }
                  >
                    {options.map((val, item) => (
                      <Option
                        key={val.id}
                        value={val.id}
                        style={{ fontWeight: 'bold' }}>
                        {val.nama_customer}
                        <div>
                          <p
                            style={{
                              fontSize: '11px',
                              marginTop: '-5px',
                              fontWeight: 'normal',
                            }}>
                            {val.email}
                          </p>
                          <p
                            style={{
                              fontSize: '11px',
                              marginTop: '-20px',
                              marginBottom: '0',
                              fontWeight: 'normal',
                            }}>
                            {val.telepon}
                          </p>
                        </div>
                      </Option>
                    ))}
                  </Select>
                  <br /> <br />
                </>
              )}
              <Row justify='space-between'>
                <Col md={11}>
                  <label>Nomor Meja</label>
                  <Form.Item name='nomor_meja' labelAlign='left'>
                    <Input
                      disabled
                      autoComplete='off'
                      style={{ borderRadius: '5px' }}
                    />
                  </Form.Item>
                </Col>
                <Col md={2}></Col>
                <Col md={11}>
                  <label>Tanggal Reservasi</label>
                  <Form.Item name='tanggal' labelAlign='left'>
                    <DatePicker
                      disabled
                      name='tanggal'
                      placeholder='Masukan Tanggal'
                      style={{ borderRadius: '5px' }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <label>Sesi Reservasi</label>
              <Form.Item name='sesi_reservasi' labelAlign='left'>
                <Input
                  disabled
                  autoComplete='off'
                  style={{ borderRadius: '5px' }}
                />
              </Form.Item>
              <label>Nama Pelanggan</label>
              <Form.Item
                name='nama_customer'
                labelAlign='left'
                rules={[
                  {
                    required: true,
                    message: 'Masukan Nama Pelanggan',
                  },
                ]}>
                <Input
                  autoComplete='off'
                  defaultValue=''
                  style={{ borderRadius: '5px' }}
                />
              </Form.Item>
              <label>Nomor Telepon</label>
              <Form.Item
                name='telepon'
                labelAlign='left'
                rules={[
                  {
                    required: true,
                    validator: checkActionCode,
                  },
                ]}>
                <Input
                  autoComplete='off'
                  defaultValue=''
                  addonBefore='+62'
                  style={{ borderRadius: '5px' }}
                  type='number'
                />
              </Form.Item>
              <label>Email</label>
              <Form.Item
                name='email'
                labelAlign='left'
                rules={[
                  {
                    required: true,
                    message: 'Masukan Email Pelanggan!',
                    type: 'email',
                  },
                ]}>
                <Input />
              </Form.Item>
              <Form.Item>
                <Button
                  type='primary'
                  loading={loading}
                  htmlType='submit'
                  style={{
                    borderRadius: '5px',
                    width: '100%',
                    margin: 'auto',
                  }}>
                  Tambah Reservasi
                </Button>
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title='Tanggal Reservasi'
            centered
            visible={modalTanggal}
            onCancel={onCancelModalTanggal}
            footer={[]}
            width={400}>
            <Form
              name='nest-messages'
              form={form}
              initialValues={{ remember: false }}
              onFinish={onFinishTanggalSesi}
              onFinishFailed={onFinishFailed}>
              <label>Tanggal Reservasi</label>
              <Form.Item
                name='tanggal_reservasi'
                labelAlign='left'
                rules={[
                  { required: true, message: 'Masukan Tanggal Reservasi!' },
                ]}>
                <DatePicker
                  onChange={onChangeTgl}
                  name='tanggal'
                  placeholder='Masukan Tanggal'
                  style={{ borderRadius: '5px' }}
                  disabledDate={(current) => {
                    return current < moment();
                  }}
                />
              </Form.Item>
              <label>Sesi Reservasi</label>
              <Form.Item
                name='sesi'
                labelAlign='left'
                rules={[
                  { required: true, message: 'Masukan Sesi Reservasi!' },
                ]}>
                <Select
                  placeholder='Masukan Sesi Reservasi'
                  onChange={onChangeSesi}>
                  <Select.Option value='Lunch'>Lunch</Select.Option>
                  <Select.Option value='Dinner'>Dinner</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Row>
                  <Col md={12}>
                    <Button
                      type='primary'
                      loading={loading}
                      onClick={() => history.push('/showReservasiTakLangsung')}
                      style={{
                        borderRadius: '5px',
                        width: '100%',
                        margin: 'auto',
                      }}>
                      Kembali
                    </Button>
                  </Col>
                  <Col md={12}>
                    <Button
                      type='primary'
                      loading={loading}
                      htmlType='submit'
                      style={{
                        borderRadius: '5px',
                        width: '100%',
                        margin: 'auto',
                      }}>
                      Submit
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </Modal>

          {!meja && (
            <h1
              style={{
                marginTop: '25px',
                textAlign: 'center',
              }}>
              <Spin />
              <p style={{ color: 'grey', fontSize: '15px' }}>
                Mengambil data meja...
              </p>
            </h1>
          )}
          {meja && (
            <Row justify='start'>
              {meja.map((val, index) => {
                return (
                  <Col xs={12} md={4} style={{ marginTop: '10px' }}>
                    <div onClick={() => openReservasi(val)}>
                      <div className='flip-card'>
                        <div className='flip-card-front'>
                          <h1 style={{ textAlign: 'center' }}>
                            {val.nomor_meja}
                          </h1>
                          {val.status !== 'Kosong' && (
                            <img src={TableMerah} alt='' />
                          )}
                          {val.status === 'Kosong' && (
                            <img src={TableHijau} alt='' />
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          )}
        </>
      )}
    </div>
  );
};

export default ReservasiTakLangsung;
