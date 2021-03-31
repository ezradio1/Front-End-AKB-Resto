import React, { useState, useCallback, forwardRef, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Breadcrumb,
  message,
  Upload,
} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useParams, useForm, useHistory } from 'react-router-dom';
import TextArea from 'antd/lib/input/TextArea';
import myAxios from '../../myAxios';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 18 },
};

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess('ok');
  }, 0);
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

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

const AddMenu = () => {
  const [namaBahan, setNamaBahan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [form] = Form.useForm();
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

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
    if (imageUrl === null) {
      message.error('Silahkan upload foto!');
    } else {
      console.log('Image Url : ' + imageUrl);
      const mytoken = localStorage.getItem('token');
      const temp = namaBahan.filter((i) => {
        return i.nama_bahan == values.nama_bahan;
      });
      const idBahan = temp[0].id;
      const formData = new FormData();
      formData.append('photo', imageUrl);
      formData.append('nama_menu', values.nama_menu);
      formData.append('unit', imageUrl);
      formData.append('takaran_saji', imageUrl);
      formData.append('nama_menu', values.nama_menu);
      formData.append('harga_menu', values.harga_menu);
      formData.append('keterangan', values.keterangan);
      formData.append('id_bahan', idBahan);
      setLoading(true);

      let newObj = {
        nama_menu: values.nama_menu,
        kategori: values.kategori,
        unit: values.unit,
        takaran_saji: values.takaran_saji,
        harga_menu: values.harga_menu,
        keterangan: values.keterangan,
        id_bahan: idBahan,
        photo: imageUrl,
      };
      console.log(newObj.telepon);
      myAxios
        .post(`menu`, formData, {
          headers: {
            Authorization: 'Bearer ' + mytoken,
          },
        })
        .then((res) => {
          setLoading(false);
          message.success(newObj.nama_menu + ' berhasil ditambahkan!');
          history.push('/showMenu');
        })
        .catch((err) => {
          setLoading(false);
          message.error('Tambah Menu Gagal : ' + err);
        });
    }
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImageUrl(URL.createObjectURL(img));
    }
  };

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        setImageUrl(imageUrl);
        setLoading(false);
      });
    }
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
      <div style={{ padding: '25px 30px' }}>
        <h1
          style={{
            fontSize: 'x-large',
            color: '#001529',
            textTransform: 'uppercase',
          }}>
          <strong>tambah data menu</strong>
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
              name='nama_menu'
              label='Nama Menu'
              labelAlign='left'
              rules={[{ required: true }]}>
              <Input autoComplete='off' />
            </Form.Item>
            <Form.Item
              name='kategori'
              label='Kategori'
              labelAlign='left'
              rules={[{ required: true }]}>
              <Select>
                <Select.Option value='Makanan Utama'>
                  Makanan Utama
                </Select.Option>
                <Select.Option value='Makanan Side Dish'>
                  Makanan Side Dish
                </Select.Option>
                <Select.Option value='Minuman'>Minuman</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name='unit'
              label='Unit'
              labelAlign='left'
              rules={[{ required: true }]}>
              <Select>
                <Select.Option value='Plate'>Plate</Select.Option>
                <Select.Option value='Bowl'>Bowl</Select.Option>
                <Select.Option value='Mini Bowl'>Mini Bowl</Select.Option>
                <Select.Option value='Glass'>Glass</Select.Option>
                <Select.Option value='Bottle'>Bottle</Select.Option>
              </Select>
            </Form.Item>
            {namaBahan != null && (
              <Form.Item
                name='nama_bahan'
                label='Bahan'
                labelAlign='left'
                rules={[{ required: true }]}>
                <Select>
                  {namaBahan.map((val, item) => (
                    <Select.Option key={val.nama_bahan} value={val.nama_bahan}>
                      {val.nama_bahan}
                    </Select.Option>
                  ))}
                </Select>
                {/* <Select>{namaBahan}</Select> */}
              </Form.Item>
            )}
            <Form.Item
              name='takaran_saji'
              label='Takaran Saji'
              labelAlign='left'
              rules={[{ required: true }]}>
              <Input type='number' suffix='gram' />
            </Form.Item>
            <Form.Item
              name='harga_menu'
              label='Harga Menu'
              labelAlign='left'
              rules={[{ required: true }]}>
              <Input type='number' prefix='Rp. ' />
            </Form.Item>
            <Form.Item
              name='keterangan'
              label='Deskripsi'
              labelAlign='left'
              rules={[{ required: true }]}>
              <TextArea />
            </Form.Item>
            <Form.Item
              name='photo'
              label='Upload Foto'
              labelAlign='left'
              rules={[{ required: true }]}>
              {/* <Upload
                name='avatar'
                listType='picture-card'
                className='avatar-uploader'
                showUploadList={false}
                // action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                beforeUpload={beforeUpload}
                onChange={handleChange}>
                {imageUrl ? (
                  <img src={imageUrl} alt='avatar' style={{ width: '100%' }} />
                ) : (
                  uploadButton
                )}
              </Upload> */}
              <input type='file' name='myImage' onChange={onImageChange} />
            </Form.Item>

            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <div className='addEmployee'>
                <Button
                  loading={loading}
                  type='primary'
                  htmlType='submit'
                  style={{ borderRadius: '5px' }}>
                  Submit
                </Button>
                <Button
                  className='button'
                  type='danger'
                  onClick={resetButton}
                  loading={loading}
                  style={{ borderRadius: '5px' }}>
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
export default AddMenu;
