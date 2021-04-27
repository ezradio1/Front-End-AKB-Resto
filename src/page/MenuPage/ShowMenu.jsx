import React, { Component } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Input,
  message,
  Image,
  Spin,
} from "antd";
import { Link } from "react-router-dom";

import {
  SearchOutlined,
  DeleteTwoTone,
  EditTwoTone,
  LoadingOutlined,
} from "@ant-design/icons";
import { UserContext } from "../../context/UserContext";
import myAxios from "../../myAxios";
import NoImg from "../../asset/icon/no-img.png";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const tableLoading = {
  indicator: <Spin indicator={antIcon} />,
};

class ShowMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      menu: null,
      filteredInfo: null,
      sortedInfo: null,
      currId: null,
      token: null,
      searchText: "",
      searchedColumn: "",
    };
  }

  setModalVisible(modalVisible) {
    this.setState({ modalVisible });
  }

  static contextType = UserContext;

  handleChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: null,
      sortDirection: "asc",
      searchText: "",
      searchedColumn: "",
    });
  };

  clearFilters = () => {
    this.setState({ filteredInfo: null });
  };

  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
    });
  };

  setAgeSort = () => {
    this.setState({
      sortedInfo: {
        order: "descend",
        columnKey: "year",
      },
    });
  };

  componentDidMount() {
    this.setState({
      loading: tableLoading,
    });
    const user = this.context;
    console.log("CEK " + user.object);
    this.setState({ token: localStorage.getItem("token") });
    console.log("SYALALA : " + localStorage.getItem("token"));
    if (this.state.menu === null) {
      myAxios
        .get(`showMenu`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          const data = res.data.data;
          // while (data) {
          //   // data.takaran_saji = `${data.takaran_saji} ${data.bahanUnit}`;
          // }

          for (var i = 0; i < data.length; i++) {
            data[
              i
            ].takaran_saji = `${data[i].takaran_saji} ${data[i].bahanUnit}`;
          }
          this.setState({
            menu: data,
            loading: false,
          });
          console.log("Data Menu = ");
          console.log(data[0]);
        });
    }
    console.log(this.state.menu);
  }

  DeleteItem(param) {
    const mytoken = localStorage.getItem("token");
    console.log("Delete Item " + param + mytoken);
    let newObj = {};
    myAxios
      .put(`deleteMenu/${param}`, newObj, {
        headers: {
          Authorization: "Bearer " + mytoken,
        },
      })
      .then((res) => {
        let filter = this.state.menu.filter((el) => {
          return el.id !== param;
        });
        this.setState({
          menu: filter,
        });
        console.log(res);
        message.success(res.data.data.nama_menu + " berhasil dihapus!");
      })
      .catch((err) => {
        message.error("Gagal Menghapus : " + err);
      });
  }

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    console.log(
      "data:" +
        selectedKeys[0] +
        "confirmnya : " +
        confirm +
        "datin :" +
        dataIndex
    );
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [
      {
        title: "Nama Menu",
        dataIndex: "nama_menu",
        key: "nama_menu",
        ...this.getColumnSearchProps("nama_menu"),
        filteredValue: filteredInfo.nama_menu || null,
        sorter: (a, b) => a.nama_menu.length - b.nama_menu.length,
        ellipsis: true,
        width: "15%",
        align: "center",
      },
      {
        title: "Kategori",
        dataIndex: "kategori",
        key: "kategori",
        sorter: (a, b) => a.kategori.length - b.kategori.length,
        ellipsis: true,
        align: "center",
      },
      {
        title: "Takaran Saji",
        dataIndex: "takaran_saji",
        key: "takaran_saji",
        sorter: (a, b) => a.takaran_saji.length - b.takaran_saji.length,
        ellipsis: true,
        width: "12%",
        align: "center",
      },
      {
        title: "Unit",
        dataIndex: "unit",
        key: "unit",
        filters: [
          { text: "Plate", value: "Plate" },
          { text: "Bowl", value: "Bowl" },
          { text: "Mini Bowl", value: "Mini Bowl" },
          { text: "Bottle", value: "Bottle" },
          { text: "Glass", value: "Glass" },
        ],
        filteredValue: filteredInfo.unit || null,
        onFilter: (value, record) => record.unit.includes(value),
        sorter: (a, b) => a.unit.length - b.unit.length,
        ellipsis: true,
        width: "9%",
        align: "center",
      },
      {
        title: "Harga",
        dataIndex: "harga_menu",
        key: "harga_menu",
        sorter: (a, b) => a.harga_menu - b.harga_menu,
        ellipsis: true,
        width: "9%",
        align: "center",
      },
      {
        title: "Deskripsi",
        dataIndex: "keterangan",
        key: "keterangan",
        sorter: (a, b) => a.keterangan.length - b.keterangan.length,
        ellipsis: true,
        align: "center",
      },
      {
        title: "Bahan",
        dataIndex: "nama_bahan",
        key: "nama_bahan",
        sorter: (a, b) => a.nama_bahan.length - b.nama_bahan.length,
        ellipsis: true,
        align: "center",
      },
      {
        title: "Gambar",
        dataIndex: "gambar",
        key: "gambar",
        ellipsis: true,
        align: "center",

        render: (dataIndex) => (
          <div>
            <Image
              fallback={NoImg}
              style={{ width: "90px", height: "80px", objectFit: "cover" }}
              src={`http://192.168.1.3:8000/photo/${dataIndex}`}
            />
          </div>
        ),
      },
      {
        dataIndex: "id",
        key: "id",
        align: "center",

        render: (dataIndex) => (
          <div>
            <Link className="link" to={`/editMenu/${dataIndex}`}>
              <EditTwoTone twoToneColor="blue" style={{ marginRight: "5px" }} />
            </Link>
            <Popconfirm
              placement="left"
              title={"Apakah anda yakin ingin menghapus ?"}
              onConfirm={() => this.DeleteItem(dataIndex)}
              okText="Yes"
              cancelText="No"
            >
              <DeleteTwoTone twoToneColor="red" />
            </Popconfirm>
          </div>
        ),
      },
    ];
    return (
      <div style={{ padding: "25px 30px" }}>
        <h1
          style={{
            fontSize: "x-large",
            color: "#001529",
            textTransform: "uppercase",
          }}
        >
          <strong>data menu</strong>
        </h1>
        <div
          style={{
            border: "1px solid #8C98AD",
            marginTop: "-10px",
            marginBottom: "15px",
          }}
        ></div>
        <Space style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            style={{ width: "auto", borderRadius: "7px" }}
            onClick={this.clearFilters}
          >
            Hapus Filter
          </Button>
          {/* <Button type='primary' onClick={() => this.setModalVisible(true)}>
            Tambah Menu
          </Button> */}
        </Space>
        <Table
          loading={this.state.loading}
          scroll={{ x: 900, y: 1500 }}
          columns={columns}
          dataSource={this.state.menu}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default ShowMenu;
