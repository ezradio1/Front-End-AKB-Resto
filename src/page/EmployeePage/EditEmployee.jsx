import React, { useEffect, useState } from 'react';
import myAxios from '../../myAxios';
// import './App.css';
import Moment from 'moment';
import {
  UsergroupDeleteOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Row,
  Radio,
  DatePicker,
  message,
  Card,
  Popconfirm,
} from 'antd';
import { useParams, useForm, useHistory } from 'react-router-dom';
const { Meta } = Card;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 18 },
};
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

const EditEmployee = () => {
  const [karyawan, setKaryawan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  let history = useHistory();
  const { userId } = useParams();

  const [form] = Form.useForm();
  const mytoken = localStorage.getItem('token');
  useEffect(() => {
    if (karyawan === null) {
      var tanggal;
      myAxios
        .get(`showKaryawan/` + userId, {
          headers: {
            Authorization: 'Bearer ' + mytoken,
          },
        })
        .then((res) => {
          const data = res.data.data;
          setKaryawan(data);
          console.log('Data Karywan = ' + data.status);
          setStatus(data.status);

          tanggal = Moment(data.tanggal_bergabung, 'YYYY-MM-DD');

          form.setFieldsValue({
            nama: data.nama,
            email: data.email,
            jenisKelamin: data.jenisKelamin,
            jabatan: data.jabatan,
            telepon: data.telepon.slice(1),
            tanggal_bergabung: tanggal,
            password: data.telepon,
            status: data.status,
          });
        });
    }
  });

  const onFinish = (values) => {
    var tanggal = values.tanggal_bergabung._d;
    console.log(Moment(tanggal).format('YYYY-MM-DD'));

    const mytoken = localStorage.getItem('token');
    let newObj = {
      nama: values.nama,
      email: values.email,
      jenisKelamin: values.jenisKelamin,
      jabatan: values.jabatan,
      telepon: '0' + values.telepon,
      tanggal_bergabung: Moment(tanggal).format('YYYY-MM-DD'),
    };
    myAxios
      .put(`editKaryawan/${userId}`, newObj, {
        headers: {
          Authorization: 'Bearer ' + mytoken,
        },
      })
      .then((res) => {
        setLoading(false);
        message.success(newObj.nama + ' berhasil di edit!');
        history.push('/showEmployee');
      })
      .catch((err) => {
        message.error('Edit Karyawan Gagal : ' + err);
      });
  };

  const resetButton = () => {};

  const KarayawanResign = () => {
    setLoading(true);
    const mytoken = localStorage.getItem('token');
    console.log('Delete Item ' + mytoken);
    let newObj = {};
    myAxios
      .put(`deleteKaryawan/${userId}`, newObj, {
        headers: {
          Authorization: 'Bearer ' + mytoken,
        },
      })
      .then((res) => {
        setLoading(false);
        window.location.reload(false);
        message.success(res.data.data.nama + ' berhasil dinonaktifkan!');
      })
      .catch((err) => {
        setLoading(false);
        message.error('Gagal Menghapus : ' + err);
      });
  };

  const KaryawanAktif = () => {
    setLoading(true);
    const mytoken = localStorage.getItem('token');
    console.log('Aktif Item ' + mytoken);
    let newObj = {};
    myAxios
      .put(`karaywanAktif/${userId}`, newObj, {
        headers: {
          Authorization: 'Bearer ' + mytoken,
        },
      })
      .then((res) => {
        setLoading(false);
        window.location.reload(false);
        message.success(res.data.data.nama + ' berhasil diaktifkan!');
      })
      .catch((err) => {
        setLoading(false);
        message.error('Gagal Mengaktifkan : ' + err);
      });
  };

  return (
    <div style={{ padding: '25px 30px' }}>
      <h1
        style={{
          fontSize: 'x-large',
          color: '#001529',
          textTransform: 'uppercase',
        }}>
        <strong>ubah data Karyawan</strong>
      </h1>
      <div
        style={{
          border: '1px solid #8C98AD',
          marginTop: '-10px',
          marginBottom: '15px',
        }}></div>
      {status === 'Resign' && (
        <Card
          style={{
            width: 'auto',
            marginTop: 16,
            marginBottom: 16,
            borderRadius: '10px',
            border: '0.5px solid #FFCC00',
            backgroundColor: '#F7F0AC',
          }}
          loading={loading}>
          <Meta
            avatar={<UsergroupAddOutlined />}
            title='Karyawan Sudah Resign'
            description='Karyawan yang sudah resign tidak bisa melakukan login kembali'
          />
          <Popconfirm
            placement='left'
            title={'Apakah anda yakin ingin mengaktifkan ?'}
            onConfirm={KaryawanAktif}
            okText='Yes'
            cancelText='No'>
            <Button
              style={{
                marginLeft: '30px',
                marginTop: '10px',
                backgroundColor: 'green',
                color: 'white',
                borderRadius: '8px',
                loading: { loading },
                borderColor: 'white',
              }}>
              Aktifkan Karyawan
            </Button>
          </Popconfirm>
        </Card>
      )}
      {status === 'Aktif' && (
        <Card
          style={{
            width: 'auto',
            marginTop: 16,
            marginBottom: 16,
            borderRadius: '8px',
            border: '0.5px solid #00b300',
            backgroundColor: '#ccff99',
          }}
          loading={loading}>
          <Meta
            avatar={<UsergroupDeleteOutlined />}
            title='Status Karyawan Aktif'
            description='Karyawan yang dinonaktifkan tidak akan bisa login kembali'
          />
          <Popconfirm
            placement='left'
            title={'Apakah anda yakin ingin menonaktifkan ?'}
            onConfirm={KarayawanResign}
            okText='Yes'
            cancelText='No'>
            <Button
              style={{
                marginLeft: '30px',
                marginTop: '10px',
                backgroundColor: '#DF7C00',
                borderColor: 'white',
                color: 'white',
                borderRadius: '8px',
                loading: { loading },
              }}>
              Nonaktifkan Karyawan
            </Button>
          </Popconfirm>
        </Card>
      )}
      <Row
        type='flex'
        justify='start'
        align='top'
        style={{ minHeight: '100vh' }}>
        <Form
          style={{ width: '1000px', padding: '10px 35px' }}
          {...layout}
          form={form}
          name='nest-messages'
          onFinish={onFinish}
          validateMessages={validateMessages}>
          <Form.Item
            name='nama'
            label='Nama'
            labelAlign='left'
            rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name='email'
            label='Email'
            labelAlign='left'
            rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name='jabatan'
            label='Jabatan'
            labelAlign='left'
            rules={[{ required: true }]}>
            <Select>
              <Select.Option value='Owner'>Owner</Select.Option>
              <Select.Option value='Operational Manager'>
                Operational Manager
              </Select.Option>
              <Select.Option value='Cashier'>Cashier</Select.Option>
              <Select.Option value='Waiter'>Waiter</Select.Option>
              <Select.Option value='Chef'>Chef</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name='jenisKelamin'
            label='Gender'
            labelAlign='left'
            rules={[{ required: true }]}>
            <Radio.Group>
              <Radio.Button value='Laki-Laki'>Laki-Laki</Radio.Button>
              <Radio.Button value='Perempuan'>Perempuan</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name='telepon'
            labelAlign='left'
            rules={[{ required: true, message: 'Telepon' }]}
            label='Nomor Telepon'>
            <Input addonBefore='+62' style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name='tanggal_bergabung'
            labelAlign='left'
            rules={[{ required: true }]}
            label='Tanggal Bergabung'>
            <DatePicker />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8 }}>
            <div className='addEmployee'>
              <Button
                type='primary'
                htmlType='submit'
                style={{ borderRadius: '5px', width: '80px' }}
                loading={loading}>
                Submit
              </Button>
              <Button className='button' type='danger' onClick={resetButton}>
                Reset
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Row>
    </div>
  );
};
export default EditEmployee;
