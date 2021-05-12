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
import LogoQR from '../../asset/logo/akb-logo-full.png';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const { Search } = Input;
const { Option } = Select;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const ReservasiLangsung = () => {
  let history = useHistory();
  const mytoken = localStorage.getItem('token');
  const wrapperRef = useRef(null);

  const [user, setUser] = useContext(UserContext);

  const [meja, setMeja] = useState(null);
  const [tempmeja, settempMeja] = useState(null);
  const [idMeja, setidMeja] = useState(null);
  const [subTitle, setSubTitle] = useState(null);

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);

  const [form] = Form.useForm();

  const [togle, setTogle] = useState(false);
  const [display, setDisplay] = useState(false);
  const [options, setOptions] = useState([]);
  const [cust, setCust] = useState(null);
  const [search, setSearch] = useState('');

  const [reservasi, setReservasi] = useState(null);
  const [dataRes, setDataRes] = useState(null);
  const [printed, setPrinted] = useState(null);
  const [no_trans, setNoTrans] = useState(null);
  //QR CODE
  const [modalQr, setmodalQr] = useState(false);
  const [objectQr, setobjectQr] = useState('');
  const [loadingQr, setLoadingQr] = useState(false);

  const onFilter = (param) => {
    console.log('TEMP MEJA = ' + param);
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
    let filter = dataRes.filter((el) => {
      return el.id === reservasi;
    });

    setmodalQr(true);
    setLoadingQr(true);
    console.log('filter');
    console.log(filter[0]);
    let newObj = { id_reservasi: reservasi };
    myAxios
      .post(`transaksi`, newObj, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((res) => {
        let data = res.data.data;
        console.log('trs');
        console.log(data);
        setPrinted(data.printed);
        let objQr = `${data.id_transaksi};${filter[0].nama_customer};${filter[0].nomor_meja}`;
        setobjectQr(objQr);
        setLoadingQr(false);
        setNoTrans(data.nomor_transaksi);
      })
      .catch((err) => {
        setLoadingQr(false);
        console.log(err);
        message.error('Cetak Qr Code Gagal : ' + err);
        // this.setState({
        //   loadingQr: false,
        //   loadingAct: false,
        // });
      });
  };

  const generatePdfQr = () => {
    setLoading(true);
    let el = document.getElementById('modalQr');
    // var pri = document.getElementById('ifmcontentstoprint').contentWindow;
    // pri.document.open();
    // pri.document.write(el.innerHTML);
    // pri.document.close();
    // pri.focus();
    // pri.print();

    var pdf = new jsPDF('p', 'mm', [140, 185]);
    html2canvas(el, { scale: 1, scrollY: window.scrollY }).then((canvas) => {
      let img = canvas.toDataURL('image/jpg');
      pdf.addImage(img, 'JPEG', 10, 15, el.style.width, el.style.height);
      pdf.autoPrint();
      pdf.output('dataurlnewwindow', 'QR_' + no_trans + '.pdf');
      // pdf.save('QR_' + this.state.no_trans + '.pdf');
      setLoading(false);
      setmodalQr(false);
    });
  };

  const onSubmitQr = (idEdit) => {
    let newObj;

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
      var tanggal = Moment(new Date(), 'YYYY-MM-DD');
      form.setFieldsValue({
        nomor_meja: val.nomor_meja,
        tanggal: tanggal,
      });
    }
  };

  const getReservasi = () => {
    if (dataRes === null) {
      myAxios
        .get(`showReservasiLangsung`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        })
        .then((res) => {
          const data = res.data.data;
          data.map((el) => {
            el.tanggal_reservasi = Moment(el.tanggal_reservasi).format(
              'D MMM YY'
            );
          });
          setDataRes(data);
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

  const getMeja = () => {
    myAxios
      .get(`showMeja`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((res) => {
        var data = res.data.data;

        data.sort((a, b) =>
          parseInt(a.nomor_meja) > parseInt(b.nomor_meja)
            ? 1
            : parseInt(b.nomor_meja) > parseInt(a.nomor_meja)
            ? -1
            : 0
        );
        setMeja(data);
        settempMeja(data);
      });
  };

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

    let newObj = {
      nama_customer: values.nama_customer,
      email: values.email,
      telepon: '0' + values.telepon,
      tanggal_reservasi: date,
      sesi_reservasi: 'Langsung',
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
        console.log('data');
        console.log(res.data.data);
        setModal(false);
        console.log('cek');
        console.log(res.data.data.id);
        setReservasi(res.data.data.id);
        setSubTitle(
          `Reservasi atas nama ${values.nama_customer} dengan Nomor Meja ${values.nomor_meja}  berhasil ditambahkan pada tanggal ${dateShow}`
        );
        setLoading(false);
        getReservasi();
      })
      .catch((err) => {
        setSubTitle(null);
        setLoading(false);
        console.log(err.response.data.message);
        message.error('Tambah Reservasi Gagal : ' + err.response.data.message);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    if (meja === null) {
      getMeja();
      getCustomer();
    }
  });

  const checkActionCode = async (rule, value, callback) => {
    console.log('value ' + value);
    console.log(value);
    if (value === '' || value === undefined) {
      rule.message = 'Nomor Telepon Wajib diisi!';
      form.setFields({
        telepon: {
          value: value,
          errors: [new Error('forbid ha')],
        },
      });
    } else if (value[0] == 0 || value[0] != 8) {
      rule.message = 'Nomor Telepon Harus diawali dengan 8!';
      form.setFields({
        telepon: {
          value: value,
          errors: [new Error('forbid ha')],
        },
      });
    } else if (value.length < 10) {
      rule.message = 'Nomor Telepon Harus lebih dari 10!';
      form.setFields({
        telepon: {
          value: value,
          errors: [new Error('forbid ha')],
        },
      });
    } else if (value.length > 14) {
      rule.message = 'Nomor Telepon Harus kurang dari 14!';
      form.setFields({
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

    form.setFieldsValue({
      nama_customer: newTemp.nama_customer,
      telepon: newTemp.telepon.slice(1),
      email: newTemp.email,
    });
    setCust(value);
  };

  const onCancelModal = () => {
    setModal(false);
    form.resetFields();
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

  return (
    <div style={{ padding: '25px 30px' }}>
      {subTitle && (
        <Result
          className='result'
          status='success'
          title='Reservasi berhasil ditambahkan!'
          subTitle={subTitle}
          extra={[
            <Button
              type='primary'
              key='console'
              onClick={() => history.push('/showReservasiLangsung')}>
              Kembali ke Reservasi
            </Button>,
            <Button type='primary' key='console' onClick={openModalQr}>
              Cetak Qr Pemesanan
            </Button>,
            <Modal
              style={{ fontFamily: 'poppins' }}
              visible={modalQr}
              title='Cetak QR Code Pesanan'
              onCancel={handleCancel}
              footer={[]}
              width={500}>
              <div id='modalQr'>
                <h1 style={{ textAlign: 'center' }}>
                  <img
                    style={{ width: '32%', marginBottom: '5px' }}
                    src={LogoQR}
                    alt=''
                  />
                  <br />
                  {loadingQr && <Spin indicator={antIcon} />}
                  {!loadingQr && (
                    <>
                      <QRCode
                        fgColor='#1F1F1F'
                        style={{
                          textAlign: 'center',
                          marginBottom: '15px',
                        }}
                        value={objectQr}
                      />
                      <p
                        style={{
                          fontSize: '20px',
                          marginTop: '35px',
                          fontFamily: 'poppins',
                        }}>
                        <b>{printed}</b>
                        <span
                          style={{
                            fontSize: '15px',
                            color: 'grey',
                          }}>
                          <br />
                          Printed by {localStorage.getItem('nama')}
                        </span>
                        <hr />
                        <p>FUN PLACE TO GRILL</p>
                        <hr />
                      </p>
                    </>
                  )}
                </h1>
              </div>
              <h1 style={{ textAlign: 'center' }}>
                <Button
                  type='primary'
                  onClick={generatePdfQr}
                  loading={loading}
                  style={{
                    borderRadius: '5px',
                    margin: '10px',
                    width: '60%',
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
            <strong>Reservasi Langsung</strong>
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
            <Col xs={24} md={6}>
              <Dropdown overlay={menu}>
                <Button
                  type='primary'
                  style={{ width: '100px', marginTop: '10px' }}>
                  Filter <DownOutlined />
                </Button>
              </Dropdown>
            </Col>
          </Row>
          <Modal
            style={{ fontFamily: 'poppins' }}
            title='Tambah Reservasi Langsung'
            centered
            visible={modal}
            onCancel={onCancelModal}
            footer={[]}
            width={400}>
            <Form
              name='nest-messages'
              form={form}
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
                    //   option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                    //   0
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
                              fontSize: '12px',
                              marginTop: '-5px',
                              fontWeight: 'normal',
                            }}>
                            {val.email}
                          </p>
                          <p
                            style={{
                              fontSize: '12px',
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
                <Col>
                  <label>Nomor Meja</label>
                  <Form.Item name='nomor_meja' labelAlign='left'>
                    <Input
                      disabled
                      autoComplete='off'
                      style={{ borderRadius: '5px', width: '90%' }}
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <label>Tanggal Reservasi</label>
                  <Form.Item name='tanggal' labelAlign='left'>
                    <DatePicker
                      disabled
                      name='tanggal'
                      disabled
                      style={{ borderRadius: '5px', width: '160px' }}
                    />
                  </Form.Item>
                </Col>
              </Row>
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

export default ReservasiLangsung;
