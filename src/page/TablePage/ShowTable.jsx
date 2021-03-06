import React, { useContext, useEffect, useState } from 'react';
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
} from 'antd';
import './style.css';
import { DownOutlined, LoadingOutlined } from '@ant-design/icons';
import TableHijau from '../../asset/icon/tableHijau.png';
import TableMerah from '../../asset/icon/tableMerah.png';
import myAxios from '../../myAxios';
import { UserContext } from '../../context/UserContext';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const tableLoading = {
  indicator: <Spin indicator={antIcon} />,
};
const { Search } = Input;

const ShowTable = () => {
  const [user, setUser] = useContext(UserContext);
  const [meja, setMeja] = useState(null);
  const [valNoMeja, setvalNoMeja] = useState(0);
  const [search, setSearch] = useState(false);
  const [tempmeja, settempMeja] = useState(null);
  const [judulModal, setjudulModal] = useState(null);
  const [idMeja, setIdMeja] = useState(null);
  const [buttonModal, setbuttonModal] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noMeja, setNoMeja] = useState(null);
  let history = useHistory();
  const [form] = Form.useForm();
  const mytoken = localStorage.getItem('token');

  const onFilter = (param) => {
    console.log('TEMP MEJA = ' + param);
    setMeja(
      tempmeja.filter((i) => {
        return i.status == param;
      })
    );
  };

  const menu = (
    <Menu style={{ fontFamily: 'poppins' }}>
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

  const hapusFilter = (values) => {
    setMeja(tempmeja);
  };

  const onFinish = (values) => {
    console.log('Success:', values.nomor_meja);
    setLoading(true);
    if (judulModal === 'Tambah Data Meja') {
      console.log('TAMBAH DATA MEJA');

      let newObj = {
        nomor_meja: values.nomor_meja,
      };
      myAxios
        .post(`meja`, newObj, {
          headers: {
            Authorization: 'Bearer ' + mytoken,
          },
        })
        .then((res) => {
          getMeja();
          setLoading(false);
          setVisible(false);
          message.success(
            `Meja Nomor ${newObj.nomor_meja} berhasil ditambahkan!`
          );
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.response.data.message);
          message.error('Tambah Meja Gagal : ' + err.response.data.message);
        });
    } else {
      console.log('EDIT DATA MEJA ' + values.nomor_meja);
      if (values.nomor_meja === valNoMeja) {
        setVisible(false);
        message.info('Data Meja Tidak Berubah');
      } else {
        setLoading(true);
        let newObj = {
          nomor_meja: values.nomor_meja,
        };
        console.log('newObj MEJA ' + newObj);
        myAxios
          .put(`editMeja/${idMeja}`, newObj, {
            headers: {
              Authorization: 'Bearer ' + mytoken,
            },
          })
          .then((res) => {
            getMeja();
            setLoading(false);
            setVisible(false);
            message.success(`Meja Nomor ${newObj.nomor_meja} berhasil diedit!`);
            // message.success(res.response.data.message);
          })
          .catch((err) => {
            setLoading(false);
            console.log(err.response.data.message);
            message.error('Edit Meja Gagal : ' + err.response.data.message);
          });
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onChange = (e) => {
    const temp = tempmeja.filter((i) => {
      return i.nomor_meja.includes(e.target.value);
    });
    console.log('temp adalah ' + temp.length);
    console.log('target = ' + e.target.value);
    if (e.target.value == '') {
      getMeja();
      setSearch(false);
    } else {
      setSearch(false);
      setMeja(
        tempmeja.filter((i) => {
          return i.nomor_meja.includes(e.target.value);
        })
      );
      if (temp.length == 0) {
        setSearch(true);
      }
    }
    console.log(
      'ADALAH = ' +
        tempmeja.filter((i) => {
          return i.nomor_meja == e.target.value;
        })
    );
  };

  const DeleteMeja = (val, nomor, status) => {
    if (status === 'Terisi') {
      message.error('Meja terisi tidak bisa dihapus!');
    } else {
      setLoading(true);
      console.log('Delete Meja = ' + val);
      let newObj;
      myAxios
        .put(`deleteMeja/${val}`, newObj, {
          headers: {
            Authorization: 'Bearer ' + mytoken,
          },
        })
        .then((res) => {
          setLoading(false);
          message.success('Nomor Meja ' + nomor + ' berhasil dihapus!');
          getMeja();
        })
        .catch((err) => {
          setLoading(false);
          message.error('Hapus Karyawan Gagal : ' + err.response.data.message);
        });
    }
  };

  const EditMeja = (val, id) => {
    console.log('Edit Meja ' + val);

    setjudulModal('Edit Data Meja');
    setbuttonModal('Edit Meja');
    setVisible(true);
    setIdMeja(id);
    setvalNoMeja(parseInt(val));
    form.setFieldsValue({
      nomor_meja: parseInt(val),
    });
  };
  const openModal = () => {
    setVisible(true);
    setjudulModal('Tambah Data Meja');
    setbuttonModal('Tambah Meja');
    form.setFieldsValue({
      nomor_meja: 0,
    });
  };

  useEffect(() => {
    console.log('Show Meja ' + user);

    console.log('SYALALA : ' + localStorage.getItem('token'));
    if (meja === null) {
      getMeja();
    }
    console.log(meja);
  });

  return (
    <div style={{ padding: '15px 30px' }}>
      <h1
        style={{
          fontSize: 'x-large',
          color: '#001529',
          textTransform: 'uppercase',
        }}>
        <strong>data meja</strong>
      </h1>
      <div
        style={{
          border: '1px solid #8C98AD',
          marginTop: '-10px',
          marginBottom: '5px',
        }}></div>

      <Row align='middle' justify='center' style={{ width: '100%' }}>
        <Col xs={24} md={4}>
          <Button
            type='primary'
            onClick={openModal}
            style={{ marginTop: '10px' }}>
            Tambah Data Meja
          </Button>
        </Col>
        <Col xs={24} md={3}>
          <Button
            type='primary'
            onClick={hapusFilter}
            style={{ marginTop: '10px' }}>
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
        <Col md={3}></Col>
        <Col xs={24} md={12}>
          <Input
            placeholder='Cari nomor meja disini ..'
            icons='search'
            onChange={onChange}
            style={{ marginTop: '10px' }}
          />
        </Col>
      </Row>
      <Modal
        style={{ fontFamily: 'poppins' }}
        title={judulModal}
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={[]}
        width={310}>
        <Form
          name='nest-messages'
          form={form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}>
          <Form.Item
            label='Nomor Meja'
            name='nomor_meja'
            rules={[
              {
                required: true,
                message: 'Masukan nomor meja!',
                type: 'number',
                min: 1,
                max: 999,
              },
            ]}>
            <InputNumber style={{ width: '145px', borderRadius: '7px' }} />
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              loading={loading}
              htmlType='submit'
              style={{
                marginTop: '30px',
                marginBottom: 0,
                borderRadius: '5px',
                width: '100%',
                margin: 'auto',
              }}>
              {buttonModal}
            </Button>
          </Form.Item>
          {/* </Col>
          </Row> */}
        </Form>
      </Modal>
      {search && <Empty style={{ marginTop: '35px' }} />}

      {!meja && (
        <h1
          style={{
            marginTop: '35px',
            textAlign: 'center',
          }}>
          <Spin indicator={antIcon} />
          <p style={{ color: 'grey', fontSize: '15px' }}>
            Mengambil data meja...
          </p>
        </h1>
      )}
      {meja && (
        <Row justify='start' gutter={16}>
          {meja.map((val, index) => {
            return (
              <Col xs={24} sm={8} md={6} xl={4} style={{ marginTop: '20px' }}>
                <div className='flip-card'>
                  <div className='flip-card-inner'>
                    <div className='flip-card-front'>
                      <h1>{val.nomor_meja}</h1>
                      {val.status !== 'Kosong' && (
                        <img src={TableMerah} alt='' />
                      )}
                      {val.status === 'Kosong' && (
                        <img src={TableHijau} alt='' />
                      )}
                    </div>
                    <div className='flip-card-back'>
                      <div style={{ marginTop: '25%' }} className='myButton'>
                        <Button
                          type='primary'
                          style={{
                            width: '125px',
                          }}
                          onClick={() => EditMeja(val.nomor_meja, val.id)}
                          loading={loading}>
                          Ubah Meja
                        </Button>
                        <br />
                        <Button
                          type='danger'
                          style={{
                            width: '125px',
                            marginTop: '10px',
                          }}
                          onClick={() =>
                            DeleteMeja(val.id, val.nomor_meja, val.status)
                          }
                          loading={loading}>
                          Hapus Meja
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
};

export default ShowTable;
