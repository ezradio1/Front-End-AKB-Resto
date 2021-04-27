import React, { useEffect, useState } from "react";
import myAxios from "../../myAxios";
import Moment from "moment";
import {
  UsergroupDeleteOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Radio,
  DatePicker,
  message,
  Card,
  Popconfirm,
} from "antd";
import { useParams, useForm, useHistory } from "react-router-dom";
import moment from "moment";

const { Meta } = Card;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 18 },
};
const dateFormat = "YYYY/MM/DD";

const EditEmployee = () => {
  const [karyawan, setKaryawan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  let history = useHistory();
  const { userId } = useParams();

  const [form] = Form.useForm();
  const mytoken = localStorage.getItem("token");
  useEffect(() => {
    if (karyawan === null) {
      var tanggal;
      myAxios
        .get(`showKaryawan/` + userId, {
          headers: {
            Authorization: "Bearer " + mytoken,
          },
        })
        .then((res) => {
          const data = res.data.data;
          setKaryawan(data);
          console.log(data);
          setStatus(data.status);

          tanggal = Moment(data.tanggal_bergabung, "YYYY-MM-DD");

          form.setFieldsValue({
            nama: data.nama,
            email: data.email,
            jenisKelamin: data.jenisKelamin,
            jabatan: data.jabatan,
            telepon: data.telepon.slice(1),
            tanggal_bergabung: tanggal,
            status: data.status,
          });
        });
    }
  });

  const onFinish = (values) => {
    setLoading(true);
    var tanggal = values.tanggal_bergabung._d;
    console.log(Moment(tanggal).format("YYYY-MM-DD"));

    const mytoken = localStorage.getItem("token");
    let newObj = {
      nama: values.nama,
      email: values.email,
      jenisKelamin: values.jenisKelamin,
      jabatan: values.jabatan,
      telepon: "0" + values.telepon,
      tanggal_bergabung: Moment(tanggal).format("YYYY-MM-DD"),
    };
    myAxios
      .put(`editKaryawan/${userId}`, newObj, {
        headers: {
          Authorization: "Bearer " + mytoken,
        },
      })
      .then((res) => {
        setLoading(false);
        message.success(newObj.nama + " berhasil di edit!");
        history.push("/showEmployee");
      })
      .catch((err) => {
        setLoading(false);
        message.error("Edit Karyawan Gagal : " + err);
      });
  };

  const resetButton = () => {
    var tanggal = Moment(karyawan.tanggal_bergabung, "YYYY-MM-DD");

    form.setFieldsValue({
      nama: karyawan.nama,
      email: karyawan.email,
      jenisKelamin: karyawan.jenisKelamin,
      jabatan: karyawan.jabatan,
      telepon: karyawan.telepon.slice(1),
      tanggal_bergabung: tanggal,
      status: karyawan.status,
    });
  };

  const KarayawanResign = () => {
    setLoading(true);
    const mytoken = localStorage.getItem("token");
    console.log("Delete Item " + mytoken);
    let newObj = {};
    myAxios
      .put(`deleteKaryawan/${userId}`, newObj, {
        headers: {
          Authorization: "Bearer " + mytoken,
        },
      })
      .then((res) => {
        window.location.reload(false);
        message.success(res.data.data.nama + " berhasil dinonaktifkan!");
      })
      .catch((err) => {
        setLoading(false);
        message.error("Gagal Menghapus : " + err);
      });
  };

  const KaryawanAktif = () => {
    setLoading(true);
    const mytoken = localStorage.getItem("token");
    console.log("Aktif Item " + mytoken);
    let newObj = {};
    myAxios
      .put(`karaywanAktif/${userId}`, newObj, {
        headers: {
          Authorization: "Bearer " + mytoken,
        },
      })
      .then((res) => {
        window.location.reload(false);
        message.success(res.data.data.nama + " berhasil diaktifkan!");
      })
      .catch((err) => {
        setLoading(false);
        message.error("Gagal Mengaktifkan : " + err);
      });
  };

  const checkActionCode = async (rule, value, callback) => {
    console.log("value " + value);
    console.log(value);
    if (value === "" || value === undefined) {
      rule.message = "Nomor Telepon Wajib diisi!";
      form.setFields({
        telepon: {
          value: value,
          errors: [new Error("forbid ha")],
        },
      });
    } else if (value[0] == 0 || value[0] != 8) {
      rule.message = "Nomor Telepon Harus diawali dengan 8!";
      form.setFields({
        telepon: {
          value: value,
          errors: [new Error("forbid ha")],
        },
      });
    } else if (value.length < 10) {
      rule.message = "Nomor Telepon Harus lebih dari 10!";
      form.setFields({
        telepon: {
          value: value,
          errors: [new Error("forbid ha")],
        },
      });
    } else if (value.length > 14) {
      rule.message = "Nomor Telepon Harus kurang dari 14!";
      form.setFields({
        telepon: {
          value: value,
          errors: [new Error("forbid ha")],
        },
      });
    } else {
      await callback();
    }
  };

  return (
    <div style={{ padding: "25px 30px" }}>
      <h1
        style={{
          fontSize: "x-large",
          color: "#001529",
          textTransform: "uppercase",
        }}
      >
        <strong>ubah data Karyawan</strong>
      </h1>
      <div
        style={{
          border: "1px solid #8C98AD",
          marginTop: "-10px",
          marginBottom: "15px",
        }}
      ></div>
      {status === "Resign" && (
        <Card
          className="card-reservasi"
          style={{
            width: "auto",
            marginTop: 16,
            marginBottom: 16,
            borderRadius: "10px",
            border: "0.5px solid #FFCC00",
            backgroundColor: "#F7F0AC",
          }}
          loading={loading}
        >
          <Meta
            avatar={<UsergroupAddOutlined />}
            title="Karyawan Sudah Resign"
            description="Karyawan yang sudah resign tidak bisa melakukan login kembali"
          />
          <Popconfirm
            placement="left"
            title={"Apakah anda yakin ingin mengaktifkan ?"}
            onConfirm={KaryawanAktif}
            okText="Yes"
            cancelText="No"
          >
            <Button
              style={{
                marginLeft: "30px",
                marginTop: "10px",
                backgroundColor: "green",
                color: "white",
                borderRadius: "8px",
                loading: { loading },
                borderColor: "white",
              }}
            >
              Aktifkan Karyawan
            </Button>
          </Popconfirm>
        </Card>
      )}
      {status === "Aktif" && (
        <Card
          className="card-reservasi"
          style={{
            width: "auto",
            marginTop: 16,
            marginBottom: 16,
            borderRadius: "8px",
            border: "0.5px solid #00b300",
            backgroundColor: "#ccff99",
          }}
          loading={loading}
        >
          <Meta
            avatar={<UsergroupDeleteOutlined />}
            title="Status Karyawan Aktif"
            description="Karyawan yang dinonaktifkan tidak akan bisa login kembali"
          />
          <Popconfirm
            placement="left"
            title={"Apakah anda yakin ingin menonaktifkan ?"}
            onConfirm={KarayawanResign}
            okText="Yes"
            cancelText="No"
          >
            <Button
              style={{
                marginLeft: "30px",
                marginTop: "10px",
                backgroundColor: "#DF7C00",
                borderColor: "white",
                color: "white",
                borderRadius: "8px",
                loading: { loading },
              }}
            >
              Nonaktifkan Karyawan
            </Button>
          </Popconfirm>
        </Card>
      )}
      <Row
        type="flex"
        justify="start"
        align="top"
        style={{ minHeight: "100vh" }}
      >
        <Form
          {...layout}
          form={form}
          basic
          name="basic"
          onFinish={onFinish}
          style={{ width: "1000px", padding: "10px 35px" }}
        >
          <Form.Item
            name="nama"
            label="Nama"
            labelAlign="left"
            rules={[
              {
                required: true,
                message: "Masukan Nama Karyawan!",
              },
            ]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            labelAlign="left"
            rules={[
              {
                required: true,
                message: "Masukan Email Karyawan!",
                type: "email",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="jabatan"
            label="Jabatan"
            labelAlign="left"
            rules={[{ required: true, message: "Masukan Jabatan Karyawan!" }]}
          >
            <Select>
              <Select.Option value="Owner">Owner</Select.Option>
              <Select.Option value="Operational Manager">
                Operational Manager
              </Select.Option>
              <Select.Option value="Cashier">Cashier</Select.Option>
              <Select.Option value="Waiter">Waiter</Select.Option>
              <Select.Option value="Chef">Chef</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="jenisKelamin"
            label="Jenis Kelamin"
            labelAlign="left"
            rules={[
              { required: true, message: "Masukan Jenis Kelamin Karyawan!" },
            ]}
          >
            <Radio.Group>
              <Radio.Button value="Laki-Laki">Laki-Laki</Radio.Button>
              <Radio.Button value="Perempuan">Perempuan</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="telepon"
            labelAlign="left"
            rules={[
              {
                required: true,
                validator: checkActionCode,
              },
            ]}
            label="Nomor Telepon"
          >
            <Input
              autoComplete="off"
              defaultValue=""
              addonBefore="+62"
              style={{ borderRadius: "5px" }}
              type="number"
            />
          </Form.Item>
          <Form.Item
            name="tanggal_bergabung"
            labelAlign="left"
            rules={[
              {
                required: true,
                message: "Masukan Tanggal Bergabung Karyawan!",
              },
            ]}
            label="Tanggal Bergabung"
          >
            <DatePicker
              placeholder="Masukan Tanggal Bergabung"
              format={dateFormat}
              disabledDate={(current) => {
                return current > moment();
              }}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <div className="addEmployee">
              <Button loading={loading} type="primary" htmlType="submit">
                Simpan
              </Button>
              <Button
                loading={loading}
                className="button"
                type="danger"
                onClick={resetButton}
                style={{ minWidth: "80px" }}
              >
                Reset
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Row>
    </div>
  );
};
export default EditEmployee;
