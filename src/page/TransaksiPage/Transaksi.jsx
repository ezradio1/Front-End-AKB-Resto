import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, useForm, useHistory } from "react-router-dom";
import {
  Form,
  Input,
  message,
  Modal,
  Row,
  Col,
  Button,
  Menu,
  Empty,
  Dropdown,
  Spin,
  Tooltip,
  Switch,
  Select,
  DatePicker,
  Result,
} from "antd";
import "./reserv.css";
import QRCode from "react-qr-code";
import { DownOutlined, LoadingOutlined } from "@ant-design/icons";
import TableHijau from "../../asset/icon/tableHijau.png";
import TableMerah from "../../asset/icon/tableMerah.png";
import myAxios from "../../myAxios";
import { UserContext } from "../../context/UserContext";
import Moment from "moment";
import TableKuning from "../../asset/icon/tableKuning.png";

const { Search } = Input;
const { Option } = Select;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const Transaksi = () => {
  let history = useHistory();
  const mytoken = localStorage.getItem("token");
  const wrapperRef = useRef(null);

  const [user, setUser] = useContext(UserContext);

  const [meja, setMeja] = useState(null);
  const [tempmeja, settempMeja] = useState(null);
  const [idMeja, setidMeja] = useState(null);
  const [subTitle, setSubTitle] = useState(null);

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);

  const [form] = Form.useForm();

  const [togle, setTogle] = useState(false);
  const [display, setDisplay] = useState(false);
  const [options, setOptions] = useState([]);
  const [cust, setCust] = useState(null);
  const [search, setSearch] = useState("");

  const [reservasi, setReservasi] = useState(null);

  const onFilter = (param) => {
    console.log("TEMP MEJA = " + param);
    setMeja(
      tempmeja.filter((i) => {
        return i.status == param;
      })
    );
  };

  const openTransaksi = (val) => {
    console.log("Get Meja");
    console.log(val);
    if (val.status === "Pending") {
      message.error("Transaksi belum selesai!");
    } else {
      setModal(true);
      setidMeja(val.id);
      var tanggal = Moment(new Date(), "YYYY-MM-DD");
      form.setFieldsValue({
        nomor_meja: val.nomor_meja,
        tanggal: tanggal,
      });
    }
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onFilter("Selesai")}
        >
          Tampil Meja Selesai
        </a>
      </Menu.Item>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onFilter("Pending")}
        >
          Tampil Meja Pending
        </a>
      </Menu.Item>
    </Menu>
  );

  const getTransaksi = () => {
    myAxios
      .get(`showTransaksi`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        var data = res.data.data;

        data.sort((a, b) =>
          parseInt(a.nomor_meja) > parseInt(b.nomor_meja)
            ? 1
            : parseInt(b.nomor_meja) > parseInt(a.nomor_meja)
            ? -1
            : 0
        );
        setMeja(data);
        settempMeja(data);
      });
  };

  const getCustomer = () => {
    myAxios
      .get(`showCustomer`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        const data = res.data.data;
        var temp = [];
        console.log("Data Customerku = ");
        console.log(temp);
      });
  };

  const hapusFilter = (values) => {
    setMeja(tempmeja);
  };

  const onFinish = async (values) => {
    setLoading(true);
    console.log("On Finish Reservasi Langsung");
    var date = Moment(values.tanggal).format("YYYY-MM-DD");
    var dateShow = Moment(values.tanggal).format("MMMM Do YYYY, h:mm:ss a");

    let newObj = {
      nama_customer: values.nama_customer,
      email: values.email,
      telepon: "0" + values.telepon,
      tanggal_reservasi: date,
      sesi_reservasi: "Langsung",
      id_meja: idMeja,
      id_karyawan: user.id_karyawan,
      tipe: togle,
      id_customer: cust,
    };
    myAxios
      .post(`storeReservasiLangsung`, newObj, {
        headers: {
          Authorization: "Bearer " + mytoken,
        },
      })
      .then((res) => {
        setLoading(false);
        setModal(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.response.data.message);
        message.error("Pembayaran Gagal : " + err.response.data.message);
      });
  };

  useEffect(() => {
    console.log("const search");
    console.log(search);
    console.log("Show Meja " + user);

    console.log("SYALALA : " + localStorage.getItem("token"));
    if (meja === null) {
      getTransaksi();
      getCustomer();
    }
    console.log(meja);
  });

  const onChangeMeja = (e) => {
    console.log(tempmeja);
    console.log("cek");
    var text = e.target.value;
    const temp = tempmeja.filter((i) => {
      return (
        i.nama_customer.toLowerCase().includes(text.toLowerCase()) ||
        i.nomor_meja == e.target.value
      );
    });
    console.log("temp adalah " + temp.length);
    console.log("target = " + e.target.value);
    if (e.target.value == "") {
      getTransaksi();
      setSearch(false);
    } else {
      setSearch(false);
      setMeja(temp);
      if (temp == 0) {
        setSearch(true);
      }
    }
    console.log(
      "ADALAH = " +
        tempmeja.filter((i) => {
          return i.nomor_meja == e.target.value;
        })
    );
  };

  const onCancelModal = () => {
    setModal(false);
    form.resetFields();
  };

  function onBlur() {
    console.log("blur");
  }

  function onFocus() {
    console.log("focus");
  }

  function onSearch(val) {
    console.log("search:", val);
  }

  return (
    <div style={{ padding: "25px 30px" }}>
      <>
        <h1
          style={{
            fontSize: "x-large",
            color: "#001529",
            textTransform: "uppercase",
          }}
        >
          <strong>transaksi per hari</strong>
        </h1>
        <div
          style={{
            border: "1px solid #8C98AD",
            marginTop: "-10px",
            marginBottom: "5px",
          }}
        ></div>

        <Row align="middle" justify="space-between" style={{ width: "100%" }}>
          <Col xs={24} md={1}>
            <Button
              type="primary"
              onClick={hapusFilter}
              style={{ width: "120px", marginTop: "10px" }}
            >
              Hapus Filter
            </Button>
          </Col>
          <Col xs={24} md={2}>
            <Dropdown overlay={menu}>
              <Button
                type="primary"
                style={{ width: "100px", marginTop: "10px" }}
              >
                Filter <DownOutlined />
              </Button>
            </Dropdown>
          </Col>
          <Col md={3}></Col>
          <Col xs={24} md={12}>
            <Input
              placeholder="Cari nomor meja atau nama pelanggan disini .."
              icons="search"
              onChange={onChangeMeja}
              style={{ marginTop: "10px" }}
            />
          </Col>
        </Row>
        {search && <Empty style={{ marginTop: "35px" }} />}
        {!meja && (
          <h1
            style={{
              marginTop: "25px",
              textAlign: "center",
            }}
          >
            <Spin />
            <p style={{ color: "grey", fontSize: "15px" }}>
              Mengambil data meja...
            </p>
          </h1>
        )}
        {meja && (
          <Row justify="start">
            {meja.map((val, index) => {
              return (
                <Col xs={12} md={4} style={{ marginTop: "10px" }}>
                  <Tooltip title={val.nama_customer} placement="bottom">
                    <div onClick={() => openTransaksi(val)}>
                      <div className="flip-card">
                        <div className="flip-card-front">
                          <h1 style={{ textAlign: "center" }}>
                            {val.nomor_meja}
                          </h1>
                          {val.status === "Pending" && (
                            <img src={TableMerah} alt="" />
                          )}
                          {val.status === "Selesai" && (
                            <img src={TableHijau} alt="" />
                          )}
                        </div>
                      </div>
                    </div>
                  </Tooltip>
                </Col>
              );
            })}
          </Row>
        )}
      </>
    </div>
  );
};

export default Transaksi;
