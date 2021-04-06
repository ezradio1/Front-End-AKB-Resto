import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Row,
  DatePicker,
  message,
  Image,
} from 'antd';
import { useParams, useForm, useHistory } from 'react-router-dom';

import TextArea from 'antd/lib/input/TextArea';
import myAxios from '../../myAxios';
import NoImg from '../../asset/icon/no-img.png';

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

const EditMenu = () => {
  const [bahan, setBahan] = useState(null);
  const [namaBahan, setNamaBahan] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imgPrev, setImgPrev] = useState(null);
  const [suffixBahan, setSuffixBahan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { userId } = useParams();

  let history = useHistory();

  useEffect(() => {
    getBahan();
    if (bahan === null) {
      myAxios
        .get(`showMenu/${userId}`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        })
        .then((res) => {
          const data = res.data.data;
          if (imgPrev === null) {
            setImgPrev(`http://127.0.0.1:8000/photo/${data.gambar}`);
          }
          myAxios
            .get(`showBahan`, {
              headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
              },
            })
            .then((res) => {
              const dataBahan = res.data.data;
              const temp = dataBahan.filter((i) => {
                return i.id == data.id_bahan;
              });

              const getNamaBahan = temp[0].nama_bahan;
              form.setFieldsValue({
                nama_menu: data.nama_menu,
                kategori: data.kategori,
                unit: data.unit,
                takaran_saji: data.takaran_saji,
                harga_menu: data.harga_menu,
                keterangan: data.keterangan,
                nama_bahan: getNamaBahan,
              });
              setSuffixBahan(temp[0].unit);
              console.log(data.gambar);
            });
        });
    }
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

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImgPrev(URL.createObjectURL(img));
      setImageUrl(img);
    }

    console.log(imageUrl);
  };

  const onFinish = (values) => {
    setLoading(true);
    const mytoken = localStorage.getItem('token');
    const temp = namaBahan.filter((i) => {
      return i.nama_bahan == values.nama_bahan;
    });
    const idBahan = temp[0].id;
    const formData = new FormData();
    if (imageUrl === null) {
      formData.append('gambar', 'no pict');
    } else {
      formData.append('gambar', imageUrl);
    }
    formData.append('nama_menu', values.nama_menu);
    formData.append('unit', values.unit);
    formData.append('kategori', values.kategori);
    formData.append('takaran_saji', values.takaran_saji);
    formData.append('nama_menu', values.nama_menu);
    formData.append('harga_menu', values.harga_menu);
    formData.append('keterangan', values.keterangan);
    formData.append('id_bahan', idBahan);
    myAxios
      .post(`editMenu/${userId}`, formData, {
        headers: {
          Authorization: 'Bearer ' + mytoken,
        },
      })
      .then((res) => {
        setLoading(false);
        message.success(values.nama_menu + ' berhasil diubah!');
        history.push('/showMenu');
      })
      .catch((err) => {
        setLoading(false);
        message.error('Ubah Menu Gagal : ' + err);
      });
  };

  const resetButton = () => {
    history.push('/showMenu');
  };

  const onChangeTak = (evt) => {
    const bahan = namaBahan.filter((i) => {
      return i.nama_bahan == evt;
    });
    setSuffixBahan(bahan[0].unit);
  };

  return (
    <div style={{ padding: '25px 30px' }}>
      <h1
        style={{
          fontSize: 'x-large',
          color: '#001529',
          textTransform: 'uppercase',
        }}>
        <strong>ubah data menu</strong>
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
              <Select.Option value='Makanan Utama'>Makanan Utama</Select.Option>
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
              <Select onChange={onChangeTak}>
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
            <Input type='number' suffix={suffixBahan} />
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

          <Form.Item name='photo' label='Upload Foto' labelAlign='left'>
            <input
              style={{ marginBottom: '10px' }}
              type='file'
              name='myImage'
              onChange={onImageChange}
            />
            <Image
              name='photo'
              fallback={NoImg}
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'cover',
              }}
              src={imgPrev}
            />
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
                Cancel
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Row>
    </div>
  );
};
export default EditMenu;
