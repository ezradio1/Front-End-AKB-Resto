import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import { Form, Input, Button, message } from 'antd';
import { useHistory } from 'react-router-dom';
import myAxios from '../../myAxios';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const ChangePassword = () => {
  let history = useHistory();
  const [user, setUser] = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      nama: user.nama,
      email: user.email,
    });
  });

  const header = new Headers();
  header.append('Access-Control-Allow-Origin', '*');
  header.append('AAuthorization', 'Bearer ' + localStorage.getItem('token'));

  const onFinish = (values) => {
    setLoading(true);
    console.log('Success:', values);
    let newObj = {
      passwordLama: values.oldPass,
      password: values.newPass,
    };
    console.log(values.oldPass);
    console.log(values.newPass);
    console.log(values.reNewPass);

    if (values.newPass !== values.reNewPass) {
      message.error('Kata Sandi Baru Tidak Cocok!');
      setLoading(false);
    } else if (values.newPass.length < 6) {
      setLoading(false);
      message.error('Kata Sandi Minimal 6 Karakter!');
    } else {
      console.log('INPUT EMAIL : ', newObj);
      myAxios
        .put(`changePass/${user.id_karyawan}`, newObj, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        })
        .then((res) => {
          message.success('Kata Sandi Berhasil diubah!');
          setLoading(false);
          history.push('/');
        })
        .catch((err) => {
          message.error(err.response.data.message);
          setLoading(false);
          console.log('error : ' + err.response.data.message);
        });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const resetButton = () => {
    form.setFieldsValue({
      oldPass: '',
      newPass: '',
      reNewPass: '',
    });
  };

  return (
    <div className='' style={{ padding: '25px 30px' }}>
      <h1
        style={{
          fontSize: 'x-large',
          color: '#001529',
          textTransform: 'uppercase',
        }}>
        <strong>Ubah Kata Sandi</strong>
      </h1>
      <div
        style={{
          border: '1px solid #8C98AD',
          marginTop: '-10px',
          marginBottom: '15px',
        }}></div>
      <Form
        {...layout}
        form={form}
        name='basic'
        initialValues={{ remember: false }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}>
        <table className='' style={{ marginTop: '15px', width: '60%' }}>
          <tr>
            <td>
              <Form.Item labelAlign='left' label='Nama' name='nama'>
                <Input disabled />
              </Form.Item>
            </td>
          </tr>
          <tr>
            <td>
              <Form.Item labelAlign='left' label='Email' name='email'>
                <Input disabled />
              </Form.Item>
            </td>
          </tr>
          <tr>
            <td>
              <Form.Item
                labelAlign='left'
                label='Kata Sandi Lama'
                name='oldPass'
                rules={[
                  {
                    required: true,
                    message: 'Masukan Kata Sandi Lama!',
                  },
                ]}>
                <Input.Password />
              </Form.Item>
            </td>
          </tr>

          <tr>
            <td>
              <Form.Item
                labelAlign='left'
                label='Kata Sandi Baru'
                name='newPass'
                rules={[
                  {
                    required: true,
                    message: 'Kata Sandi Harus Terdiri dari 6-16 Karakter!',
                    min: 6,
                    max: 16,
                  },
                ]}>
                <Input.Password />
              </Form.Item>
            </td>
          </tr>

          <tr>
            <td>
              <Form.Item
                labelAlign='left'
                label='Konfirmasi Kata Sandi Baru'
                name='reNewPass'
                rules={[
                  {
                    required: true,
                    message: 'Kata Sandi Harus Terdiri dari 6-16 Karakter!',
                    min: 6,
                    max: 16,
                  },
                ]}>
                <Input.Password />
              </Form.Item>
            </td>
          </tr>

          <tr>
            <td colSpan='2'>
              <Form.Item {...tailLayout}>
                <Button type='primary' htmlType='submit' loading={loading}>
                  Submit
                </Button>
                <Button
                  style={{
                    width: '80px',
                    borderRadius: '7px',
                    marginLeft: '10px',
                  }}
                  onClick={resetButton}
                  type='danger'
                  loading={loading}>
                  Reset
                </Button>
              </Form.Item>
            </td>
          </tr>
        </table>
      </Form>
    </div>
  );
};

export default ChangePassword;
