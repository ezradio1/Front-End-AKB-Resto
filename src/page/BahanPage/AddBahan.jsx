import React, { useState, useCallback, forwardRef, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Breadcrumb,
  message,
  PageHeader,
} from 'antd';
import { useParams, useForm, useHistory } from 'react-router-dom';
import TextArea from 'antd/lib/input/TextArea';
import myAxios from '../../myAxios';
import { HomeOutlined, CoffeeOutlined } from '@ant-design/icons';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 18 },
};

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

const AddBahan = () => {
  const [namaBahan, setNamaBahan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  let history = useHistory();

  useEffect(() => {
    getBahan();
  });

  const getBahan = () => {
    if (namaBahan === null) {
      myAxios
        .get(`showBahan`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        })
        .then((res) => {
          const data = res.data.data;
          setNamaBahan(res.data.data);
          console.log('Data Bahan di Menu = ');
          console.log(data);
        });
    }
  };

  const onFinish = (values) => {
    setLoading(true);
    const mytoken = localStorage.getItem('token');
    // const temp = namaBahan.filter((i) => {
    //   return i.nama_bahan == values.nama_bahan;
    // });
    // const idBahan = temp[0].id;

    let newObj = {
      nama_bahan: values.nama_bahan,
      jumlah: values.jumlah,
      unit: values.unit,
    };
    myAxios
      .post(`bahan`, newObj, {
        headers: {
          Authorization: 'Bearer ' + mytoken,
        },
      })
      .then((res) => {
        setLoading(false);
        message.success(newObj.nama_bahan + ' berhasil ditambahkan!');
        history.push('/showBahan');
      })
      .catch((err) => {
        setLoading(false);
        message.error('Tambah Bahan Gagal : ' + err);
      });
  };

  const resetButton = () => {
    setLoading(true);
    form.setFieldsValue({
      nama_menu: '',
      kategori: '',
      unit: '',
      takaran_saji: '',
      harga_menu: '',
      keterangan: '',
      nama_bahan: '',
    });
    setLoading(false);
  };

  const routes = [
    {
      path: '',
      breadcrumbName: 'Tampil Menu',
    },
    {
      path: 'addMenu',
      breadcrumbName: 'Tambah Menu',
    },
  ];

  const backToShowMenu = () => {
    history.push('/showMenu');
  };

  return (
    <>
      {/* <PageHeader
        style={{ backgroundColor: 'transparent' }}
        className='site-page-header'
        onBack={backToShowMenu}
        title='TAMBAH DATA BAHAN'
      /> */}

      <div style={{ padding: '20px 30px' }}>
        <h1
          style={{
            fontSize: 'x-large',
            color: '#001529',
            textTransform: 'uppercase',
          }}>
          <strong>data bahan</strong>
        </h1>
        <div
          style={{
            border: '1px solid #8C98AD',
            marginTop: '10px',
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
            form={form}
            name='nest-messages'
            onFinish={onFinish}
            validateMessages={validateMessages}>
            <Form.Item
              name='nama_bahan'
              label='Nama Bahan'
              labelAlign='left'
              rules={[{ required: true }]}>
              <Input autoComplete='off' />
            </Form.Item>
            <Form.Item
              name='jumlah'
              label='Jumlah Stok'
              labelAlign='left'
              rules={[{ required: true }]}>
              <Input value='0' type='number' />
            </Form.Item>
            <Form.Item
              name='unit'
              label='Unit'
              labelAlign='left'
              rules={[{ required: true }]}>
              <Input autoComplete='off' />
            </Form.Item>

            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <div className='addEmployee'>
                <Button
                  loading={loading}
                  type='primary'
                  htmlType='submit'
                  style={{ borderRadius: '5px', width: '100px' }}>
                  Submit
                </Button>
                <Button
                  className='button'
                  type='danger'
                  onClick={resetButton}
                  loading={loading}
                  style={{ borderRadius: '5px', width: '100px' }}>
                  Reset
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Row>
      </div>
    </>
  );
};
export default AddBahan;
