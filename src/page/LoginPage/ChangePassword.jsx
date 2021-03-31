import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';
import { Form, Input, Button, message, useForm } from 'antd';
import { useHistory } from 'react-router-dom';

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
      message.error("Current passwords and new passwords don't match!");
      setLoading(false);
    } else {
      console.log('INPUT EMAIL : ', newObj);
      axios
        .put(
          `https://dbakbresto.ezraaudivano.com/api/changePass/${user.id_karyawan}`,
          newObj,
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
              //   'Access-Control-Allow-Origin': '*',
            },
          }
        )
        .then((res) => {
          message.success('Kata Sandi Berhasil diubah!');
          setLoading(false);
          /*history.push("/");*/
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
              <Form.Item labelAlign='left' label='Name' name='nama'>
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
              <Form.Item labelAlign='left' label='Old Password' name='oldPass'>
                <Input.Password />
              </Form.Item>
            </td>
          </tr>

          <tr>
            <td>
              <Form.Item labelAlign='left' label='New Password' name='newPass'>
                <Input.Password />
              </Form.Item>
            </td>
          </tr>

          <tr>
            <td>
              <Form.Item
                labelAlign='left'
                label='Re New Password'
                name='reNewPass'>
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
                    backgroundColor: 'red',
                    borderColor: '#f0f2f5',
                    borderRadius: '12px',
                    marginLeft: '10px',
                  }}
                  type='primary'
                  primary
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
