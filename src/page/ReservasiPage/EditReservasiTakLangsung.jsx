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
import moment from 'moment';
import LogoQR from '../../asset/logo/akb-logo-full.png';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const EditReservasiTakLangsung = () => {
  let history = useHistory();
  const mytoken = localStorage.getItem('token');

  const [user] = useContext(UserContext);

  const [meja, setMeja] = useState(null);
  const [tempmeja, settempMeja] = useState(null);
  const [idMeja, setidMeja] = useState(null);
  const [subTitle, setSubTitle] = useState(null);

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  const [form] = Form.useForm();
  const [formTanggal] = Form.useForm();

  const [togle] = useState(false);

  const [cust, setCust] = useState(null);

  const [reservasi, setReservasi] = useState(null);
  //QR CODE
  const [modalQr, setmodalQr] = useState(false);
  const [modalTanggal, setmodalTanggal] = useState(false);
  const [objectQr, setobjectQr] = useState('');

  const [loadingQr, setLoadingQr] = useState(false);
  const [printed, setPrinted] = useState(null);

  const { userId } = useParams();

  //Simpan Data Tanggal Sesi
  const [tglSesi, setTglSesi] = useState({
    sesi_reservasi: null,
    tanggal_reservasi: null,
  });

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
        message.error('Cetak QR Pemesanan Gagal');
        setmodalQr(false);
      });
  };

  const openReservasi = (val) => {
    console.log('Get Meja');
    console.log(reservasi);
    if (val.status === 'Terisi') {
      message.error('Meja sudah terisi!');
    } else {
      myAxios
        .get(`showCustomer/${cust}`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        })
        .then((res) => {
          const data = res.data.data;
          console.log('Data Customerku = ');
          console.log(data);
          setCust(data.id);
          setModal(true);
          setReservasi({
            nomor_meja: val.nomor_meja,
            tanggal_reservasi: tglSesi.tanggal_reservasi,
            sesi_reservasi: tglSesi.sesi_reservasi,
          });
          setidMeja(val.id);
          var tanggal = Moment(reservasi.tanggal_reservasi, 'YYYY-MM-DD');
          if (data.telepon === '-') {
            data.telepon = '';
          }
          if (data.email === '-') {
            data.email = '';
          }
          form.setFieldsValue({
            nomor_meja: val.nomor_meja,
            tanggal: tanggal,
            sesi_reservasi: reservasi.sesi_reservasi,
            nama_customer: data.nama_customer,
            email: data.email,
            telepon: data.telepon.slice(1),
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

  const hapusFilter = (values) => {
    setMeja(tempmeja);
  };

  const onFinish = async (values) => {
    setLoading(true);
    console.log('On Finish Reservasi Langsung');
    var date = Moment(values.tanggal).format('YYYY-MM-DD');
    var dateShow = Moment(values.tanggal).format('DD MMMM YYYY');
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
      sesi_reservasi: values.sesi_reservasi,
      id_meja: idMeja,
      id_karyawan: user.id_karyawan,
      tipe: togle,
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
        setSubTitle(
          `Reservasi tanggal ${dateShow} sesi ${values.sesi_reservasi} atas nama ${values.nama_customer} dengan Nomor Meja ${values.nomor_meja}  berhasil diubah pada ${dateShowNow}`
        );
      })
      .catch((err) => {
        setSubTitle(null);
        setLoading(false);
        console.log(err.response.data.message);
        message.error('Edit Reservasi Gagal : ' + err.response.data.message);
      });
  };

  const onFinishTanggalSesi = (values) => {
    setLoading(true);
    console.log('On Finish Input Tanggal dan Sesi');
    var date = Moment(values.tanggal_reservasi).format('YYYY-MM-DD');

    let newObj = {
      tanggal_reservasi: date,
      sesi_reservasi: values.sesi_reservasi,
    };
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

        setReservasi({
          nomor_meja: reservasi.nomor_meja,
          tanggal_reservasi: values.tanggal_reservasi,
          sesi_reservasi: values.sesi_reservasi,
        });
        setTglSesi({
          tanggal_reservasi: values.tanggal_reservasi,
          sesi_reservasi: values.sesi_reservasi,
          tgl_show: moment(values.tanggal_reservasi).format('LL'),
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

  // const getReservasi = () => {
  //   myAxios
  //     .get(`showReservasi/${userId}`, {
  //       headers: {
  //         Authorization: 'Bearer ' + localStorage.getItem('token'),
  //       },
  //     })
  //     .then((res) => {
  //       var data = res.data.data;
  //       console.log('cek reserv');
  //       console.log(data);
  //       if (data.status === 'Selesai') {
  //         history.push('/showReservasiTakLangsung');
  //       } else {
  //         setReservasi(data);
  //       }
  //     });
  // };

  useEffect(() => {
    if (reservasi === null) {
      myAxios
        .get(`showReservasi/${userId}`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        })
        .then((res) => {
          var reserv = res.data.data;
          console.log('cek reserv');
          setCust(reserv.id_customer);
          console.log(reserv);
          if (reserv.status === 'Selesai') {
            history.push('/showReservasiTakLangsung');
          } else {
            if (reservasi == null) {
              setReservasi(reserv);
            }
            var date = moment(reserv.tanggal_reservasi).format('YYYY-MM-DD');
            var tanggal = moment(reserv.tanggal_reservasi, 'YYYY-MM-DD');
            let newObj = {
              tanggal_reservasi: date,
              sesi_reservasi: reserv.sesi_reservasi,
            };
            myAxios
              .post(`tampilMejaReservasi`, newObj, {
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
                formTanggal.setFieldsValue({
                  tanggal_reservasi: tanggal,
                  sesi_reservasi: reserv.sesi_reservasi,
                });
              });
          }
        });
    }
    console.log(meja);
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
    setmodalTanggal(false);
    setModal(false);
    form.resetFields();
    // setReservasi({
    //   nomor_meja: "-",
    //   // tanggal_reservasi: tglSesi.tanggal_reservasi,
    //   // sesi_reservasi: tglSesi.sesi_reservasi,
    // });
  };

  const onCancelModalTanggal = () => {
    setmodalTanggal(false);
  };

  const onChangeTgl = (evt) => {
    setTglSesi({
      tanggal_reservasi: evt,
    });
    // console.log(evt);
    // var tanggal = Moment(evt._d, 'YYYY-MM-DD');
    // setTglSesi({ tanggal_reservasi: tanggal });
    // console.log(tglSesi);
  };
  const onChangeSesi = (evt) => {
    setTglSesi({
      sesi_reservasi: evt,
    });
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
          title='Reservasi berhasil diubah!'
          subTitle={subTitle}
          extra={[
            <Button
              type='primary'
              key='console'
              onClick={() => history.push('/showReservasiTakLangsung')}>
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
            <strong>Ubah Reservasi Tidak Langsung</strong>
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
                Ubah Tanggal dan Sesi
              </Button>
            </Col>
          </Row>
          {reservasi != null && (
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
                      fontWeight: 'bold',
                    }}>
                    {moment(reservasi.tanggal_reservasi).format('LL')}
                  </p>

                  {/* <p
                      style={{
                        style={{
                        color: '#3C8065',
                        marginBottom: '-10px',
                        fontWeight: 'bold',
                      }}
                      }}> */}

                  {/* </p> */}
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
                      marginBottom: '-10px',
                      fontWeight: 'bold',
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
            title='Ubah Reservasi Tidak Langsung'
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
                  Ubah Reservasi
                </Button>
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            style={{ fontFamily: 'poppins' }}
            title='Tanggal Reservasi'
            centered
            visible={modalTanggal}
            onCancel={onCancelModalTanggal}
            footer={[]}
            width={400}>
            <Form
              name='nest-messages'
              form={formTanggal}
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
                name='sesi_reservasi'
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
                      onClick={() => setmodalTanggal(false)}
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
                      Ubah
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

export default EditReservasiTakLangsung;
