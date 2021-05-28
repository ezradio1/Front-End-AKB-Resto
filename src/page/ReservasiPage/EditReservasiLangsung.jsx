import React, { useContext, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Form,
  Input,
  message,
  Modal,
  Row,
  Col,
  Button,
  Menu,
  Dropdown,
  Spin,
  Card,
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

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const EditReservasiLangsung = () => {
  let history = useHistory();
  const mytoken = localStorage.getItem('token');

  const [user] = useContext(UserContext);

  const [meja, setMeja] = useState(null);
  const [tempmeja, settempMeja] = useState(null);
  const [idMeja, setidMeja] = useState(null);
  const [subTitle, setSubTitle] = useState(null);

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);

  const [form] = Form.useForm();

  const [cust, setCust] = useState(null);

  const [reservasi, setReservasi] = useState(null);
  //QR CODE
  const [modalQr, setmodalQr] = useState(false);
  const [printed, setPrinted] = useState(null);
  const [objectQr, setobjectQr] = useState('');
  const [loadingQr, setLoadingQr] = useState(false);

  const { userId } = useParams();

  const onFilter = (param) => {
    console.log('TEMP MEJA = ' + param);
    setMeja(
      tempmeja.filter((i) => {
        return i.status === param;
      })
    );
  };

  const handleCancel = () => {
    setmodalQr(false);
  };

  const openModalQr = () => {
    console.log('data qr');
    setLoading(false);
    let newObj = { id_reservasi: userId };
    setmodalQr(true);
    setLoadingQr(true);
    myAxios
      .post(`transaksi`, newObj, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((res) => {
        let data = res.data.data;
        console.log('data reservasi');
        console.log(data);
        let objQr = {
          id_transaksi: data.id_transaksi,
          nomor_meja: data.nomor_meja,
          nama_customer: data.nama_customer,
          tanggal: data.tanggal,
        };
        setLoadingQr(false);
        setobjectQr(JSON.stringify(objQr));
        setPrinted(data.printed);
      })
      .catch((err) => {
        setLoadingQr(false);
        console.log('error r');
        console.log(err);
        message.error('Edit Reservasi Gagal : ');
        setmodalQr(false);
      });
  };

  const onSubmitQr = () => {
    let newObj;
    setLoading(true);

    myAxios
      .put(`updateStatusReservasi/${userId}`, newObj, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((res) => {
        message.success('Berhasil Cetak Qr Pemesanan');
        setmodalQr(false);
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
      setidMeja(val.id);
      //   setReservasi({ nomor_meja: val });
      var tanggal = Moment(reservasi.tanggal_reservasi, 'YYYY-MM-DD');
      myAxios
        .get(`showCustomer/${reservasi.id_customer}`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        })
        .then((res) => {
          setModal(true);
          var data = res.data.data;
          console.log('customer');
          setCust(data.id);

          console.log(data);
          if (data.telepon === '-') {
            data.telepon = '';
          }
          if (data.email === '-') {
            data.email = '';
          }
          form.setFieldsValue({
            nomor_meja: val.nomor_meja,
            tanggal: tanggal,
            nama_customer: reservasi.nama_customer,
            telepon: data.telepon.slice(1),
            email: data.email,
          });
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

  const getReservasi = () => {
    myAxios
      .get(`showReservasi/${userId}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((res) => {
        var data = res.data.data;
        console.log('cek reserv');
        console.log(data);
        if (data.status === 'Selesai') {
          history.push('/showReservasiLangsung');
        } else {
          setReservasi(data);
        }
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
        var temp = [];
        console.log('Data Customerku = ');
        console.log(temp);
      });
  };

  const hapusFilter = (values) => {
    setMeja(tempmeja);
  };

  const onFinish = (values) => {
    setLoading(true);
    console.log('On Finish Edit Reservasi Tak Langsung');
    var date = Moment(values.tanggal).format('YYYY-MM-DD');
    var dateShow = Moment(values.tanggal).format('MMMM Do YYYY');
    var dateShowNow = Moment(new Date()).format('DD MMMM YYYY');

    if (values.telepon === '' || values.telepon === undefined) {
      values.telepon = '-';
    } else if (values.telepon !== '-') {
      values.telepon = '0' + values.telepon;
    }
    if (values.email === '' || values.email === undefined) {
      values.email = '-';
    }

    let newObj = {
      nama_customer: values.nama_customer,
      email: values.email,
      telepon: values.telepon,
      tanggal_reservasi: date,
      sesi_reservasi: 'Langsung',
      id_meja: idMeja,
      id_karyawan: user.id_karyawan,
      id_customer: cust,
    };
    myAxios
      .put(`updateReservasi/${userId}`, newObj, {
        headers: {
          Authorization: 'Bearer ' + mytoken,
        },
      })
      .then((res) => {
        setLoading(false);
        setModal(false);
        setReservasi(newObj);
        setSubTitle(
          `Reservasi tanggal ${dateShow} atas nama ${values.nama_customer} dengan Nomor Meja ${values.nomor_meja}  berhasil diedit pada ${dateShowNow}`
        );
      })
      .catch((err) => {
        setSubTitle(null);
        setLoading(false);
        console.log(err.response.data.message);
        message.error('Edit Reservasi Gagal : ' + err.response.data.message);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    if (reservasi === null) {
      getReservasi();
    }

    if (meja === null) {
      getMeja();
      getCustomer();
    }
  });

  const checkActionCode = async (rule, value, callback) => {
    console.log('value ' + value);
    console.log(value);
    // if (value === "" || value === undefined) {
    //   rule.message = "Nomor Telepon Wajib diisi!";
    //   form.setFields({
    //     telepon: {
    //       value: value,
    //       errors: [new Error("forbid ha")],
    //     },
    //   });
    // } else
    if (value !== '') {
      if (value[0] === '0' || value[0] !== '8') {
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
    }
  };

  const onCancelModal = () => {
    setModal(false);
    form.resetFields();
  };

  return (
    <div style={{ padding: '25px 30px' }}>
      {subTitle && (
        <Result
          className='result'
          status='success'
          title='Reservasi berhasil diedit!'
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
              style={{ top: 30, fontFamily: 'poppins' }}
              visible={modalQr}
              title='Cetak QR Code Pesanan'
              onCancel={handleCancel}
              footer={[]}
              width={500}>
              <h1 style={{ textAlign: 'center' }}>
                <img
                  style={{ width: '32%', marginBottom: '5px' }}
                  src={LogoQR}
                  alt=''
                />
                <br />
                {loadingQr && <Spin indicator={antIcon} />}
                <br />
                {!loadingQr && (
                  <>
                    <QRCode
                      fgColor='#1F1F1F'
                      style={{
                        width: '100px',
                        textAlign: 'center',
                        marginBottom: '10px',
                      }}
                      value={objectQr}
                    />
                    <br />
                    <p style={{ fontSize: '20px', marginTop: '35px' }}>
                      <b>{printed}</b>
                      <span style={{ fontSize: '15px' }}>
                        <br />
                        Printed by {localStorage.getItem('nama')}
                      </span>
                    </p>
                  </>
                )}
                <Button
                  type='primary'
                  onClick={onSubmitQr}
                  loading={loading}
                  style={{
                    borderRadius: '5px',
                    margin: '15px',
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
            <strong> edit Reservasi Langsung</strong>
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
          {reservasi && (
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
                <Col md={1}>
                  <p
                    style={{
                      color: '#3C8065',
                      fontWeight: 'bold',
                    }}>
                    :
                  </p>
                </Col>
                <Col>
                  <p
                    style={{
                      color: '#3C8065',
                      marginBottom: '-10px',
                      fontWeight: 'bold',
                    }}>
                    {Moment(reservasi.tanggal_reservasi).format('LL')}
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
                    Nomor Meja
                  </p>
                </Col>
                <Col md={1}>
                  <p
                    style={{
                      color: '#3C8065',
                      fontWeight: 'bold',
                    }}>
                    :
                  </p>
                </Col>
                <Col>
                  <p
                    style={{
                      color: '#3C8065',
                      marginBottom: '-10px',
                      fontWeight: 'bold',
                    }}>
                    {reservasi.nomor_meja}
                  </p>
                </Col>
              </Row>
              <Row style={{ marginTop: '-15px' }}>
                <Col md={4}>
                  <p
                    style={{
                      color: '#3C8065',
                      fontWeight: 'bold',
                      marginBottom: '-10px',
                    }}>
                    Sesi Reservasi
                  </p>
                </Col>
                <Col md={1}>
                  <p
                    style={{
                      color: '#3C8065',
                      fontWeight: 'bold',
                    }}>
                    :
                  </p>
                </Col>
                <Col>
                  <p
                    style={{
                      color: '#3C8065',
                      marginBottom: '-10px',
                      fontWeight: 'bold',
                    }}>
                    {reservasi.sesi_reservasi}
                  </p>
                </Col>
              </Row>
            </Card>
          )}
          <Modal
            style={{ fontFamily: 'poppins' }}
            title='Edit Reservasi Langsung'
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
                  Edit Reservasi
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
                  <Col
                    xs={24}
                    sm={8}
                    md={6}
                    xl={4}
                    style={{ marginTop: '10px' }}>
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

export default EditReservasiLangsung;
