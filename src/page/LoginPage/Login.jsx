import React, { useContext, useState } from 'react';
import { Form, Input, Button, useForm, Spin, Row, Col, message } from 'antd';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';

import { UserOutlined, KeyOutlined } from '@ant-design/icons';

import LogoAkbNon from '../../asset/logo/logo-col.png';
import LogoAkb from '../../asset/logo/logo-nav-1.png';
import './Login.css';
import myAxios from '../../myAxios';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Login = () => {
  const [, setUser] = useContext(UserContext);
  const [input, setInput] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onReset = () => {
    form.setFieldsValue({
      email: undefined,
      password: undefined,
    });
    message.warning('Reset Success!');
  };

  const onFinish = (values) => {
    setLoading(true);
    console.log('Success:', values);
    setInput({
      email: values.email,
      password: values.password,
    });
    console.log('INPUT EMAIL : ', input);
    myAxios
      .post('login', {
        email: values.email,
        password: values.password,
      })
      .then((res) => {
        var user = res.data.user;
        var token = res.data.access_token;
        var jabatan = res.data.user.jabatan;
        var id_karyawan = res.data.user.id;
        var currentUser = {
          nama: user.nama,
          email: user.email,
          token,
          jabatan,
          id_karyawan,
        };
        setUser(currentUser);
        console.log(currentUser);
        localStorage.setItem('user', JSON.stringify(currentUser));
        localStorage.setItem('nama', user.nama);
        localStorage.setItem('token', token);
        setLoading(false);
        message.success('Selamat Datang, ' + jabatan + '!');
        // history.push("/");
      })
      .catch((err) => {
        setLoading(false);
        message.error(err.response.data.message);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className='backGroundLogin' style={{ height: '96vh' }}>
      <Row justify='center'>
        <Col md={10} style={{ marginTop: '150px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {/* <img src={LogoAkbNon} /> */}
            <br />
            <img style={{ width: '250px' }} src={LogoAkb} />
          </div>
          <Form
            {...layout}
            form={form}
            name='basic'
            initialValues={{ remember: false }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}>
            <Form.Item
              justify='center'
              name='email'
              rules={[{ required: true, message: 'Please input your email!' }]}>
              <Input
                size='large'
                style={{ borderRadius: '15px' }}
                prefix={<UserOutlined />}
                placeholder='  Email'
              />
            </Form.Item>

            <Form.Item
              justify='center'
              name='password'
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}>
              <Input.Password
                size='large'
                style={{ borderRadius: '15px' }}
                prefix={<KeyOutlined />}
                placeholder='  Password'
              />
            </Form.Item>

            <Col style={{ margin: 'auto' }} md={16} className='btnLogin'>
              <Button type='primary' htmlType='submit' loading={loading}>
                <b>LOGIN</b>
              </Button>
            </Col>

            <Row justify='center'></Row>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
