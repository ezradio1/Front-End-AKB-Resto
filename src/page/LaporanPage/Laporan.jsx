import React, { useState, useEffect, useContext } from 'react';
import {
  Row,
  Col,
  Spin,
  message,
  Modal,
  Select,
  Form,
  Button,
  DatePicker,
  Switch,
} from 'antd';

import moment from 'moment';
import Moment from 'moment';

import { LoadingOutlined } from '@ant-design/icons';
import './home.css';

import LapStok from '../../asset/icon/laporan_stok.png';
import LapPen from '../../asset/icon/laporan_pendapatan.png';
import LapPeng from '../../asset/icon/laporan_pengeluaran.png';
import LapPenj from '../../asset/icon/laporan_penjualan.png';

import myAxios from '../../myAxios';
import { UserContext } from '../../context/UserContext';

const { RangePicker } = DatePicker;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Laporan = () => {
  const [form] = Form.useForm();

  const [jumlahKaryawan, setJumlahKar] = useState(null);
  const [jumlahTransaksi, setJumlahTr] = useState(null);
  const [jumlahBahan, setJumlahBah] = useState(null);
  const [jumlahMenu, setJumlahMen] = useState(null);

  const [loading, setLoading] = useState(false);

  const [modalLapStok, setModalLapStok] = useState(false);
  const [modalLapPeng, setModalLapPeng] = useState(false);
  const [modalLapPenj, setModalLapPenj] = useState(false);
  const [modalLapPen, setModalLapPen] = useState(false);
  const [mode, setMode] = useState(false);
  const [modePeng, setModePeng] = useState(false);
  const [modePenj, setModePenj] = useState(false);
  const [modePend, setModePend] = useState(false);

  const [itemMenu, setItemMenu] = useState(null);
  const [idMenu, setIdMenu] = useState(null);

  const [user] = useContext(UserContext);

  const onFinish = (values) => {
    var user = localStorage.getItem('user');
    var idKaryawan = JSON.parse(user);
    var id = idKaryawan.id_karyawan;

    var id_menu = null;
    var month = null;
    var nameLap;

    if (values.nama_menu === undefined) {
      id_menu = 'Semua';
    } else {
      id_menu = idMenu;
    }
    setLoading(true);

    if (mode === false) {
      let start = values.bulan[0]._d;
      let end = values.bulan[1]._d;
      start = Moment(start).format('YYYY-MM-DD');
      end = Moment(end).format('YYYY-MM-DD');
      nameLap =
        moment(start).format('DDMMMMYY') + '-' + moment(end).format('DDMMMMYY');
      myAxios
        .get(`stokBahanPeriode/${id}/${id_menu}/${start}/${end}`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          responseType: 'blob',
        })
        .then((res) => {
          console.log(res);
          const url = window.URL.createObjectURL(res.data);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `LAP_STOK_${nameLap}.pdf`); //or any other extension
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          setModalLapStok(false);
          setLoading(false);
          message.success('Unduh Laporan Stok Berhasil!');
        })
        .catch((err) => {
          setModalLapStok(false);
          setLoading(false);
        });
    } else {
      let tanggal = moment(values.bulan._d, 'YYYY/MM/DD');
      month = tanggal.format('YYYY-MM');
      nameLap = tanggal.format('MMMMYYYY');
      myAxios
        .get(`stokBahanBulanan/${id}/${id_menu}/${month}`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          responseType: 'blob',
        })
        .then((res) => {
          console.log(res);
          const url = window.URL.createObjectURL(res.data);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `LAP_STOK_${nameLap}.pdf`); //or any other extension
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          setModalLapStok(false);
          setLoading(false);

          message.success('Unduh Laporan Stok Berhasil!');
        })
        .catch((err) => {
          setModalLapStok(false);
          setLoading(false);
        });
    }
  };

  const onFinishPenjualan = (values) => {
    setLoading(true);
    var user = localStorage.getItem('user');
    var idKaryawan = JSON.parse(user);
    var id = idKaryawan.id_karyawan;

    var valueTanggal = values.bulan._d;
    var tahun, bulan, tampilan, nameLap;
    if (modePenj === false) {
      tahun = Moment(valueTanggal).format('YYYY');
      bulan = 'Semua';
      tampilan = null;
      nameLap = tahun;
    } else {
      tahun = Moment(valueTanggal).format('YYYY');
      bulan = Moment(valueTanggal).format('MM');
      tampilan = Moment(valueTanggal).format('YYYY-MM');
      nameLap = moment(valueTanggal).format('MMMMYYYY');
    }

    myAxios
      .get(`penjualanItem/${id}/${tahun}/${bulan}/${tampilan}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        responseType: 'blob',
      })
      .then((res) => {
        console.log(res);
        const url = window.URL.createObjectURL(res.data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `LAP_PENJUALAN_${nameLap}.pdf`); //or any other extension
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        setModalLapPenj(false);
        setLoading(false);
        message.success('Unduh Laporan Penjualan Berhasil!');
      })
      .catch((err) => {
        setModalLapPenj(false);
        setLoading(false);
      });
  };
  const onFinishPendapatan = (values) => {
    var user = localStorage.getItem('user');
    var idKaryawan = JSON.parse(user);
    var id = idKaryawan.id_karyawan;
    var tahunAwal, tahunAkhir, nameLap;
    console.log(values);
    setLoading(true);
    if (modePend === true) {
      let tanggal = moment(values.bulan._d, 'YYYY/MM/DD');
      tahunAwal = Moment(tanggal).format('YYYY');
      tahunAkhir = 'Kosong';
      nameLap = tahunAwal;
    } else {
      let start = values.bulan[0]._d;
      let end = values.bulan[1]._d;
      tahunAwal = Moment(start).format('YYYY');
      tahunAkhir = Moment(end).format('YYYY');
      nameLap = tahunAwal + '-' + tahunAkhir;
    }
    myAxios
      .get(`pendapatanLap/${id}/${tahunAwal}/${tahunAkhir}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        responseType: 'blob',
      })
      .then((res) => {
        console.log(res);
        const url = window.URL.createObjectURL(res.data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `LAP_PENDAPATAN_${nameLap}.pdf`); //or any other extension
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        setModalLapPen(false);
        setLoading(false);
        message.success('Unduh Laporan Pendapatan Berhasil!');
      })
      .catch((err) => {
        setModalLapPen(false);
        setLoading(false);
      });
  };

  const onFinishPengeluaran = (values) => {
    var user = localStorage.getItem('user');
    var idKaryawan = JSON.parse(user);
    var id = idKaryawan.id_karyawan;
    var tahunAwal, tahunAkhir, nameLap;

    console.log(values);
    setLoading(true);
    if (modePeng === true) {
      let tanggal = values.bulan._d;
      tahunAwal = Moment(tanggal).format('YYYY');
      tahunAkhir = 'Kosong';
      nameLap = tahunAwal;
    } else {
      let start = values.bulan[0]._d;
      let end = values.bulan[1]._d;
      tahunAwal = Moment(start).format('YYYY');
      tahunAkhir = Moment(end).format('YYYY');
      nameLap = tahunAwal + '-' + tahunAkhir;
    }
    myAxios
      .get(`pengeluaranLap/${id}/${tahunAwal}/${tahunAkhir}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        responseType: 'blob',
      })
      .then((res) => {
        console.log(res);
        const url = window.URL.createObjectURL(res.data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `LAP_PENGELUARAN_${nameLap}.pdf`); //or any other extension
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        setModalLapPeng(false);
        setLoading(false);
        message.success('Unduh Laporan Pengeluaran Berhasil!');
      })
      .catch((err) => {
        setModalLapPeng(false);
        setLoading(false);
      });
  };

  const resetButton = () => {};

  useEffect(() => {
    if (jumlahKaryawan === null) {
      myAxios
        .get(`getJumlahKaryawan`, {
          headers: {
            Authorization: 'Bearer ' + user.token,
          },
        })
        .then((res) => {
          const data = res.data.data;
          setJumlahKar(data[0].jumlah);
        })
        .catch((err) => {});
    }
    if (jumlahTransaksi === null) {
      myAxios
        .get(`getJumlahTransaksi`, {
          headers: {
            Authorization: 'Bearer ' + user.token,
          },
        })
        .then((res) => {
          const data = res.data.data;
          setJumlahTr(data[0].jumlah);
        })
        .catch((err) => {});
    }
    if (jumlahBahan === null) {
      myAxios
        .get(`getJumlahBahan`, {
          headers: {
            Authorization: 'Bearer ' + user.token,
          },
        })
        .then((res) => {
          const data = res.data.data;
          setJumlahBah(data[0].jumlah);
        })
        .catch((err) => {});
    }
    if (jumlahMenu === null) {
      myAxios
        .get(`getJumlahMenu`, {
          headers: {
            Authorization: 'Bearer ' + user.token,
          },
        })
        .then((res) => {
          const data = res.data.data;
          setJumlahMen(data[0].jumlah);
        })
        .catch((err) => {});
    }
  });

  const handleCancel = () => {
    form.resetFields();
    setModalLapStok(false);
    setModalLapPenj(false);
    setModalLapPen(false);
    setModalLapPeng(false);
  };

  const onLapStok = () => {
    console.log(user.jabatan);
    if (user.jabatan === 'Owner' || user.jabatan === 'Operational Manager') {
      setModalLapStok(true);
      form.resetFields();
      if (itemMenu === null) {
        myAxios
          .get(`showMenu`, {
            headers: {
              Authorization: 'Bearer ' + user.token,
            },
          })
          .then((res) => {
            const data = res.data.data;
            let item = [{ id: 999, nama_menu: 'All' }];
            console.log(item);
            setItemMenu(data);
          })
          .catch((err) => {});
      }
    } else {
      message.error('Anda tidak memiliki akses!');
    }
  };
  const onLapPeng = () => {
    if (user.jabatan === 'Owner' || user.jabatan === 'Operational Manager') {
      setModalLapPeng(true);
      form.resetFields();
    } else {
      message.error('Anda tidak memiliki akses!');
    }
  };
  const onLapPenj = () => {
    if (user.jabatan === 'Owner' || user.jabatan === 'Operational Manager') {
      setModalLapPenj(true);
      form.resetFields();
    } else {
      message.error('Anda tidak memiliki akses!');
    }
  };
  const onLapPen = () => {
    if (user.jabatan !== 'Owner' || user.jabatan !== 'Operational Manager') {
      setModalLapPen(true);
      form.resetFields();
    } else {
      message.error('Anda tidak memiliki akses!');
    }
  };

  const onChangeTak = (evt) => {
    const bahan = itemMenu.filter((i) => {
      return i.nama_menu === evt;
    });
    setIdMenu(bahan[0].id);
  };

  const onChangeSwStock = (checked) => {
    console.log(`switch to ${checked}`);
    setMode(checked);
    form.setFieldsValue({
      bulan: '',
    });
  };
  const onChangeSwPendapatan = (checked) => {
    setModePend(checked);
    console.log(`switch to ${modePend}`);
    form.setFieldsValue({
      bulan: '',
    });
  };
  const onChangeSwPengeluaran = (checked) => {
    console.log(`switch to ${checked}`);
    setModePeng(checked);
    form.setFieldsValue({
      bulan: '',
    });
  };
  const onChangeSwPenjualan = (checked) => {
    console.log(`switch to ${checked}`);
    setModePenj(checked);
    form.setFieldsValue({
      bulan: '',
    });
  };

  return (
    <div style={{ padding: '25px 30px' }}>
      <Modal
        style={{ fontFamily: 'poppins' }}
        visible={modalLapStok}
        title='Laporan Stok Bahan'
        onCancel={handleCancel}
        footer={[]}
        width={400}>
        <Form
          encType='multipart/form-data'
          form={form}
          name='nest-messages'
          onFinish={onFinish}>
          {itemMenu != null && (
            <>
              <label> Item Menu</label>
              <Form.Item name='nama_menu' labelAlign='left'>
                <Select onChange={onChangeTak} defaultValue='Semua'>
                  <Select.Option key='Semua' value='Semua'>
                    Semua
                  </Select.Option>
                  {itemMenu.map((val, item) => (
                    <Select.Option key={val.id} value={val.nama_menu}>
                      {val.nama_menu}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}
          <Switch
            size='small'
            onChange={onChangeSwStock}
            style={{ marginRight: '10px' }}
          />
          {mode && (
            <>
              <label>Bulanan</label>

              <br />
              <Form.Item
                name='bulan'
                labelAlign='left'
                rules={[
                  {
                    required: true,
                    message: 'Masukan Bulan!',
                  },
                ]}>
                <DatePicker
                  picker='month'
                  placeholder='Masukan bulan'
                  disabledDate={(current) => {
                    return current > moment();
                  }}
                />
              </Form.Item>
            </>
          )}
          {!mode && (
            <>
              <label>Custom Periode</label>

              <br />
              <Form.Item
                name='bulan'
                labelAlign='left'
                rules={[
                  {
                    required: true,
                    message: 'Masukan range rulan!',
                  },
                ]}>
                <RangePicker
                  placeholder={['Tanggal awal', 'Tanggal akhir']}
                  format='YYYY/MM/DD'
                  disabledDate={(current) => {
                    return current > moment();
                  }}
                />
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Row>
              <Col md={12}>
                <Button
                  loading={loading}
                  type='primary'
                  htmlType='submit'
                  style={{ width: '100%' }}>
                  Unduh
                </Button>
              </Col>
              <Col md={12}>
                <Button
                  type='danger'
                  onClick={resetButton}
                  loading={loading}
                  style={{ minWidth: '80px', width: '100%' }}>
                  Reset
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        style={{ fontFamily: 'poppins' }}
        visible={modalLapPeng}
        title='Laporan Pengeluaran'
        onCancel={handleCancel}
        footer={[]}
        width={400}>
        <Form
          encType='multipart/form-data'
          form={form}
          name='nest-messages'
          onFinish={onFinishPengeluaran}>
          <Switch
            size='small'
            onChange={onChangeSwPengeluaran}
            style={{ marginRight: '10px' }}
          />
          {modePeng && (
            <>
              <label>Tahun</label>
              <br />
              <Form.Item
                name='bulan'
                labelAlign='left'
                rules={[
                  {
                    required: true,
                    message: 'Masukan Tahun!',
                  },
                ]}>
                <DatePicker
                  picker='year'
                  placeholder='Masukan tahun'
                  disabledDate={(current) => {
                    return current > moment();
                  }}
                />
              </Form.Item>
            </>
          )}
          {!modePeng && (
            <>
              <label>Custom Periode</label>
              <br />
              <Form.Item
                name='bulan'
                labelAlign='left'
                rules={[
                  {
                    required: true,
                    message: 'Masukan Tahun!',
                  },
                ]}>
                <RangePicker
                  picker='year'
                  placeholder={['Tahun awal', 'Tahun akhir']}
                  disabledDate={(current) => {
                    return current > moment();
                  }}
                />
              </Form.Item>
            </>
          )}
          <br />
          <Form.Item>
            <Row>
              <Col md={12}>
                <Button
                  loading={loading}
                  type='primary'
                  htmlType='submit'
                  style={{ width: '100%' }}>
                  Unduh
                </Button>
              </Col>
              <Col md={12}>
                <Button
                  type='danger'
                  onClick={resetButton}
                  loading={loading}
                  style={{ minWidth: '80px', width: '100%' }}>
                  Reset
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        style={{ fontFamily: 'poppins' }}
        visible={modalLapPenj}
        title='Laporan Penjualan Item Menu'
        onCancel={handleCancel}
        footer={[]}
        width={400}>
        <Form
          encType='multipart/form-data'
          form={form}
          name='nest-messages'
          onFinish={onFinishPenjualan}>
          <Switch
            size='small'
            onChange={onChangeSwPenjualan}
            style={{ marginRight: '10px' }}
          />
          {modePenj && (
            <>
              <label>Bulan</label>
              <br />
              <Form.Item
                name='bulan'
                labelAlign='left'
                rules={[
                  {
                    required: true,
                    message: 'Masukan Bulan!',
                  },
                ]}>
                <DatePicker
                  picker='month'
                  placeholder='Masukan bulan'
                  disabledDate={(current) => {
                    return current > moment();
                  }}
                />
              </Form.Item>
            </>
          )}
          {!modePenj && (
            <>
              <label>Tahun</label>
              <br />
              <Form.Item
                name='bulan'
                labelAlign='left'
                rules={[
                  {
                    required: true,
                    message: 'Masukan Tahun!',
                  },
                ]}>
                <DatePicker
                  picker='year'
                  placeholder='Masukan Tahun'
                  disabledDate={(current) => {
                    return current > moment();
                  }}
                />
              </Form.Item>
            </>
          )}
          <Form.Item>
            <Row>
              <Col md={12}>
                <Button
                  loading={loading}
                  type='primary'
                  htmlType='submit'
                  style={{ width: '100%' }}>
                  Unduh
                </Button>
              </Col>
              <Col md={12}>
                <Button
                  type='danger'
                  onClick={resetButton}
                  loading={loading}
                  style={{ minWidth: '80px', width: '100%' }}>
                  Reset
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        style={{ fontFamily: 'poppins' }}
        visible={modalLapPen}
        title='Laporan Pendapatan'
        onCancel={handleCancel}
        footer={[]}
        width={400}>
        <Form
          encType='multipart/form-data'
          form={form}
          name='nest-messages'
          onFinish={onFinishPendapatan}>
          <Switch
            size='small'
            onChange={onChangeSwPendapatan}
            style={{ marginRight: '10px' }}
          />
          {modePend && (
            <>
              <label>Tahun</label>

              <br />
              <Form.Item
                name='bulan'
                labelAlign='left'
                rules={[
                  {
                    required: true,
                    message: 'Masukan Tahun!',
                  },
                ]}>
                <DatePicker
                  picker='year'
                  placeholder='Masukan tahun'
                  disabledDate={(current) => {
                    return current > moment();
                  }}
                />
              </Form.Item>
            </>
          )}
          {!modePend && (
            <>
              <label>Custom Periode</label>
              <br />
              <Form.Item
                name='bulan'
                labelAlign='left'
                rules={[
                  {
                    required: true,
                    message: 'Masukan Tahun!',
                  },
                ]}>
                <RangePicker
                  picker='year'
                  placeholder={['Tahun awal', 'Tahun akhir']}
                  disabledDate={(current) => {
                    return current > moment();
                  }}
                />
              </Form.Item>
            </>
          )}
          <br />
          <Form.Item>
            <Row>
              <Col md={12}>
                <Button
                  loading={loading}
                  type='primary'
                  htmlType='submit'
                  style={{ width: '100%' }}>
                  Unduh
                </Button>
              </Col>
              <Col md={12}>
                <Button
                  type='danger'
                  onClick={resetButton}
                  loading={loading}
                  style={{ minWidth: '80px', width: '100%' }}>
                  Reset
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>

      <h1
        style={{
          fontSize: 'x-large',
          color: '#001529',
          textTransform: 'uppercase',
        }}>
        <strong>data laporan</strong>
      </h1>
      <div
        style={{
          border: '1px solid #8C98AD',
          marginTop: '-10px',
          marginBottom: '15px',
        }}></div>

      {!jumlahKaryawan && !jumlahBahan && !jumlahMenu && !jumlahTransaksi && (
        <h1
          style={{
            marginTop: '35px',
            textAlign: 'center',
          }}>
          <Spin indicator={antIcon} />
          <p style={{ color: 'grey', fontSize: '15px', marginTop: '5px' }}>
            Memuat
          </p>
        </h1>
      )}
      {jumlahKaryawan && jumlahBahan && jumlahMenu && jumlahTransaksi && (
        <div>
          <Row justify='center'>
            <Col style={{ margin: '0 10px' }}>
              <div className='mycard' onClick={onLapStok}>
                <img alt='' src={LapStok} />
              </div>
            </Col>
            <Col style={{ margin: '0 10px' }}>
              <div className='mycard' onClick={onLapPeng}>
                <img alt='' src={LapPeng} />
              </div>
            </Col>
            <Col style={{ margin: '0 10px' }}>
              <div className='mycard' onClick={onLapPenj}>
                <img alt='' src={LapPenj} />
              </div>
            </Col>
            <Col style={{ margin: '0 10px' }}>
              <div className='mycard' onClick={onLapPen}>
                <img alt='' src={LapPen} />
              </div>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default Laporan;
