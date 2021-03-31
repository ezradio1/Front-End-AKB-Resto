import React, { useState, useCallback, forwardRef } from 'react';
import axios from 'axios';
// import './App.css';
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
} from 'antd';
import { useParams, useForm, useHistory } from 'react-router-dom';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import CountryPhoneInput, {
  CountryPhoneInputValue,
} from 'antd-country-phone-input';
import 'antd-country-phone-input/dist/index.css';

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
  const [phoneNumber, setPhoneNumber] = useState(null);
  let history = useHistory();

  const PhoneInputComponent = forwardRef(({ onChange, ...props }, ref) => {
    const handleChange = useCallback((e) => onChange(e.target.value), [
      onChange,
    ]);
    return <Input ref={ref} />;
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
      telepon: '0' + value,
      tanggal_bergabung: Moment(tanggal).format('YYYY-MM-DD'),
      password: values.telepon,
    };
    console.log(newObj.telepon);
    axios
      .post(`https://dbakbresto.ezraaudivano.com/api/karyawan`, newObj, {
        headers: {
          Authorization: 'Bearer ' + mytoken,
        },
      })
      .then((res) => {
        // setLoading(false);
        message.success(newObj.nama + ' has been Added!');
        history.push('/showEmployee');
      })
      .catch((err) => {
        message.error('Tambah Karyawan Gagal : ' + err);
      });
  };

  const resetButton = () => {};

  return (
    <div style={{ padding: '25px 30px' }}>
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
          style={{ width: '1000px', padding: '10px 35px' }}
          {...layout}
          name='nest-messages'
          onFinish={onFinish}
          validateMessages={validateMessages}>
          <Form.Item
            name='nama'
            label='Nama'
            labelAlign='left'
            rules={[{ required: true }]}>
            <Input autoComplete='off' />
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
            rules={[{ required: true, message: 'Masukan Nomor Telepon!' }]}
            label='Nomor Telepon'>
            {/* // <Input addonBefore='+62' style={{ width: '100%' }} /> */}
            {/* </Form> */}
            {/* <PhoneInput
              placeholder='Enter phone number'
              value={phoneNumber}
              onChange={setPhoneNumber}
              inputComponent={PhoneInputComponent}
            /> */}
            <PhoneInput
              // inputComponent={PhoneInputComponent}
              defaultCountry='ID'
              country='ID'
              placeholder='Masukan Nomor Telepon'
              value='telepon'
              onChange={setValue}
            />
            {/* <CountryPhoneInput
              inline
              // locale='ID'
              defaultValue={{ short: 'ID' }}
            /> */}
          </Form.Item>
          <Form.Item
            name='tanggal_bergabung'
            labelAlign='left'
            rules={[{ required: true }]}
            label='Tanggal Bergabung'>
            <DatePicker format={dateFormat} />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <div className='addEmployee'>
              <Button
                type='primary'
                htmlType='submit'
                style={{ borderRadius: '5px', width: '80px' }}>
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
export default AddEmployee;
