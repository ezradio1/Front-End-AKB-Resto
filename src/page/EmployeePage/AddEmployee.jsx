import React, { useState, useCallback, forwardRef } from 'react';
import { FormInstance } from 'antd/lib/form';
import './App.css';
import Moment from 'moment';
import {
  Form,
  Input,
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
import myAxios from '../../myAxios';
import moment from 'moment';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 18 },
};
const dateFormat = 'YYYY/MM/DD';

const AddEmployee = () => {
  const [loading, setLoading] = useState(false);
  const [subTitle, setsubTitle] = useState(false);
  const [showResult, setshowResult] = useState(false);
  const [form] = Form.useForm();
  let history = useHistory();

  const onFinish = (values) => {
    const tanggal = values.tanggal_bergabung._d;
    const telepon = values.telepon.toString();
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
    myAxios
      .post(`karyawan`, newObj, {
        headers: {
          Authorization: 'Bearer ' + mytoken,
        },
      })
      .then((res) => {
        setshowResult(true);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        message.error('Tambah Karyawan Gagal : ' + err.response.data.message);
      });
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
  };

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
              style={{ width: '1000px', padding: '10px 35px' }}>
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
                    validator: checkActionCode,
                  },
                ]}
                label='Nomor Telepon'>
                <Input
                  autoComplete='off'
                  defaultValue=''
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
                <DatePicker
                  placeholder='Masukan Tanggal Bergabung'
                  format={dateFormat}
                  disabledDate={(current) => {
                    return current > moment();
                  }}
                />
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
                    Simpan
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
