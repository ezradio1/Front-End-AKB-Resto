import React, { useState, useCallback, forwardRef } from 'react';
import axios from 'axios';
import './App.css';
import Moment from 'moment';
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
  Result,
} from 'antd';
import { useParams, useHistory } from 'react-router-dom';
import 'react-phone-number-input/style.css';
import 'antd-country-phone-input/dist/index.css';
import { PhoneFilled } from '@ant-design/icons';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 18 },
};
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

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

const AddEmployee = () => {
  const [value, setValue] = useState();
  const [loading, setLoading] = useState(false);
  const [subTitle, setsubTitle] = useState(false);
  const [showResult, setshowResult] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [form] = Form.useForm();
  let history = useHistory();

  const PhoneInputComponent = forwardRef(({ onChange, ...props }, ref) => {
    const handleChange = useCallback((e) => onChange(e.target.value), [
      onChange,
    ]);
    return <Input ref={ref} />;
  });

  const onFinish = (values) => {
    const tanggal = values.tanggal_bergabung._d;
    const telepon = values.telepon.toString();
    console.log(telepon[0]);
    var x = new Date();
    var y = new Date(tanggal);
    console.log(x.getTime() > y.getTime());
    if (telepon[0] === '0' || telepon[0] !== '8') {
      message.error('Nomor Telepon Tidak Valid!');
    } else if (x.getTime() < y.getTime()) {
      console.log('Masuk sini');
      message.error('Tanggal Masuk Minimal Tanggal Hari Ini!');
    } else {
      setLoading(true);
      setsubTitle(
        `Karyawan ${values.nama} sebagai ${values.jabatan} berhasil ditambahkan pada tanggal ${tanggal} `
      );
      const mytoken = localStorage.getItem('token');
      let newObj = {
        nama: values.nama,
        email: values.email,
        jenisKelamin: values.jenisKelamin,
        jabatan: values.jabatan,
        telepon: '0' + telepon,
        tanggal_bergabung: Moment(tanggal).format('YYYY-MM-DD'),
        password: values.password,
      };
      axios
        .post(`https://dbakbresto.ezraaudivano.com/api/karyawan`, newObj, {
          headers: {
            Authorization: 'Bearer ' + mytoken,
          },
        })
        .then((res) => {
          setshowResult(true);
          setLoading(false);
          // history.push('/showEmployee');
        })
        .catch((err) => {
          setLoading(false);
          message.error('Tambah Karyawan Gagal : ' + err.response.data.message);
        });
    }
  };

  const resetButton = () => {
    form.setFieldsValue({
      nama: '',
      email: '',
      telepon: '',
      tanggal_bergabung: '',
      jenisKelamin: '',
      password: '',
    });

    const tambahKaryawan = () => {
      history.push('/showEmployee');
    };

    const lihatKaryawan = () => {
      history.push('/addEmployee');
    };
  };

  return (
    <div style={{ padding: '25px 30px' }}>
      {showResult && (
        <Result
          status='success'
          title='Karyawan Berhasil Ditambah'
          subTitle={subTitle}
          extra={[
            <Button
              type='primary'
              key='console'
              onClick={() => history.push('/showEmployee')}>
              Lihat Karyawan
            </Button>,
            <Button
              style={{ borderRadius: '8px' }}
              onClick={() => setshowResult(false)}
              key='buy'>
              Tambah Karyawan
            </Button>,
          ]}
        />
      )}
      {!showResult && (
        <>
          <h1
            style={{
              fontSize: 'x-large',
              color: '#001529',
              textTransform: 'uppercase',
            }}>
            <strong>tambah data karyawan</strong>
          </h1>
          <div
            style={{
              border: '1px solid #8C98AD',
              marginTop: '-10px',
              marginBottom: '15px',
            }}></div>
          <Row
            type='flex'
            justify='start'
            align='top'
            style={{ minHeight: '100vh' }}>
            <Form
              {...layout}
              form={form}
              basic
              name='basic'
              onFinish={onFinish}
              style={{ width: '1000px', padding: '10px 35px' }}
              validateMessages={validateMessages}>
              <Form.Item
                name='nama'
                label='Nama'
                labelAlign='left'
                rules={[
                  {
                    required: true,
                    message: 'Masukan Nama Karyawan!',
                  },
                ]}>
                <Input autoComplete='off' />
              </Form.Item>
              <Form.Item
                name='email'
                label='Email'
                labelAlign='left'
                rules={[
                  {
                    required: true,
                    message: 'Masukan Email Karyawan!',
                    type: 'email',
                  },
                ]}>
                <Input />
              </Form.Item>
              <Form.Item
                name='jabatan'
                label='Jabatan'
                labelAlign='left'
                rules={[
                  { required: true, message: 'Masukan Jabatan Karyawan!' },
                ]}>
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
                label='Jenis Kelamin'
                labelAlign='left'
                rules={[
                  {
                    required: true,
                    message: 'Masukan Jenis Kelamin Karyawan!',
                  },
                ]}>
                <Radio.Group>
                  <Radio.Button value='Laki-Laki'>Laki-Laki</Radio.Button>
                  <Radio.Button value='Perempuan'>Perempuan</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                name='telepon'
                labelAlign='left'
                rules={[
                  {
                    required: true,
                    min: 9,
                    max: 12,
                    message: 'Nomor Telepon Hanya 9-12 digit!',
                  },
                ]}
                label='Nomor Telepon'>
                <Input
                  addonBefore='+62'
                  style={{ borderRadius: '5px' }}
                  type='number'
                />
              </Form.Item>
              <Form.Item
                name='tanggal_bergabung'
                labelAlign='left'
                rules={[
                  {
                    required: true,
                    message: 'Masukan Tanggal Bergabung Karyawan!',
                  },
                ]}
                label='Tanggal Bergabung'>
                <DatePicker format={dateFormat} />
              </Form.Item>
              <Form.Item
                name='password'
                labelAlign='left'
                rules={[
                  {
                    required: true,
                    message: 'Kata Sandi Harus Terdiri dari 6-16 Karakter',
                    min: 6,
                    max: 16,
                  },
                ]}
                label='Kata Sandi'>
                <Input.Password />
              </Form.Item>
              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <div className='addEmployee'>
                  <Button loading={loading} type='primary' htmlType='submit'>
                    Submit
                  </Button>
                  <Button
                    loading={loading}
                    className='button'
                    type='danger'
                    onClick={resetButton}
                    style={{ minWidth: '80px' }}>
                    Reset
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Row>
        </>
      )}
    </div>
  );
};
export default AddEmployee;
