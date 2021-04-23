import React, { useState, useCallback, forwardRef, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Breadcrumb,
  message,
  Upload,
  Image,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useParams, useForm, useHistory } from "react-router-dom";
import TextArea from "antd/lib/input/TextArea";
import myAxios from "../../myAxios";
import NoImg from "../../asset/icon/no-img.png";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 18 },
};

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const AddMenu = () => {
  const [namaBahan, setNamaBahan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [prevImg, setImgPrev] = useState(null);
  const [suffixBahan, setSuffixBahan] = useState(null);

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
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          const data = res.data.data;
          setNamaBahan(res.data.data);
          console.log("Data Bahan di Menu = ");
          console.log(data);
          setSuffixBahan(data.unit);
        });
    }
  };

  const onFinish = (values) => {
    setLoading(true);
    console.log("Image Url : ");
    console.log(imageUrl);
    const mytoken = localStorage.getItem("token");
    const temp = namaBahan.filter((i) => {
      return i.nama_bahan == values.nama_bahan;
    });
    const idBahan = temp[0].id;
    const formData = new FormData();
    if (imageUrl === null) {
      formData.append("gambar", "no pict");
    } else {
      formData.append("gambar", imageUrl);
    }
    formData.append("nama_menu", values.nama_menu);
    formData.append("unit", values.unit);
    formData.append("kategori", values.kategori);
    formData.append("takaran_saji", values.takaran_saji);
    formData.append("nama_menu", values.nama_menu);
    formData.append("harga_menu", values.harga_menu);
    formData.append("keterangan", values.keterangan);
    formData.append("id_bahan", idBahan);
    setLoading(true);

    console.log(imageUrl);

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

    myAxios
      .post(`menu`, formData, {
        headers: {
          Authorization: "Bearer " + mytoken,
        },
      })
      .then((res) => {
        setLoading(false);
        message.success(newObj.nama_menu + " berhasil ditambahkan!");
        history.push("/showMenu");
      })
      .catch((err) => {
        setLoading(false);
        message.error("Tambah Menu Gagal : " + err.response.data.message);
      });
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImageUrl(img);
      setImgPrev(URL.createObjectURL(img));
    }

    console.log(imageUrl);
  };

  const resetButton = () => {
    setLoading(true);
    form.setFieldsValue({
      nama_menu: "",
      kategori: "",
      unit: "",
      takaran_saji: "",
      harga_menu: "",
      keterangan: "",
      nama_bahan: "",
    });
    setLoading(false);
  };

  const routes = [
    {
      path: "",
      breadcrumbName: "Tampil Menu",
    },
    {
      path: "addMenu",
      breadcrumbName: "Tambah Menu",
    },
  ];

  const onChangeTak = (evt) => {
    const bahan = namaBahan.filter((i) => {
      return i.nama_bahan == evt;
    });
    setSuffixBahan(bahan[0].unit);
  };

  return (
    <>
      <div style={{ padding: "25px 30px" }}>
        <h1
          style={{
            fontSize: "x-large",
            color: "#001529",
            textTransform: "uppercase",
          }}
        >
          <strong>tambah data menu</strong>
        </h1>
        <div
          style={{
            border: "1px solid #8C98AD",
            marginTop: "10px",
            marginBottom: "15px",
          }}
        ></div>
        <Row
          type="flex"
          justify="start"
          align="top"
          style={{ minHeight: "100vh" }}
        >
          <Form
            encType="multipart/form-data"
            style={{ width: "1000px", padding: "10px 35px" }}
            {...layout}
            form={form}
            name="nest-messages"
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Form.Item
              name="nama_menu"
              label="Nama Menu"
              labelAlign="left"
              rules={[{ required: true }]}
            >
              <Input autoComplete="off" />
            </Form.Item>
            <Form.Item
              name="kategori"
              label="Kategori"
              labelAlign="left"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="Makanan Utama">
                  Makanan Utama
                </Select.Option>
                <Select.Option value="Makanan Side Dish">
                  Makanan Side Dish
                </Select.Option>
                <Select.Option value="Minuman">Minuman</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="unit"
              label="Unit"
              labelAlign="left"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="Plate">Plate</Select.Option>
                <Select.Option value="Bowl">Bowl</Select.Option>
                <Select.Option value="Mini Bowl">Mini Bowl</Select.Option>
                <Select.Option value="Glass">Glass</Select.Option>
                <Select.Option value="Bottle">Bottle</Select.Option>
              </Select>
            </Form.Item>
            {namaBahan != null && (
              <Form.Item
                name="nama_bahan"
                label="Bahan"
                labelAlign="left"
                rules={[{ required: true }]}
              >
                <Select onChange={onChangeTak}>
                  {namaBahan.map((val, item) => (
                    <Select.Option key={val.id} value={val.nama_bahan}>
                      {val.nama_bahan}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
            <Form.Item
              name="takaran_saji"
              label="Takaran Saji"
              labelAlign="left"
              rules={[{ required: true }]}
            >
              <Input type="number" suffix={suffixBahan} />
            </Form.Item>
            <Form.Item
              name="harga_menu"
              label="Harga Menu"
              labelAlign="left"
              rules={[{ required: true }]}
            >
              <Input type="number" prefix="Rp. " />
            </Form.Item>
            <Form.Item
              name="keterangan"
              label="Deskripsi"
              labelAlign="left"
              rules={[{ required: true }]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item name="photo" label="Upload Foto" labelAlign="left">
              <input
                style={{ marginBottom: "10px" }}
                type="file"
                name="myImage"
                onChange={onImageChange}
              />
              <Image
                name="photo"
                fallback={NoImg}
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                }}
                src={prevImg}
              />
            </Form.Item>

            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <div className="addEmployee">
                <Button loading={loading} type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button
                  type="danger"
                  onClick={resetButton}
                  loading={loading}
                  style={{ minWidth: "80px" }}
                >
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
