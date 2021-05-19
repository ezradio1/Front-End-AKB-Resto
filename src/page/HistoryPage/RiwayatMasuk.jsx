import React, { Component } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Input,
  message,
  Tag,
  Spin,
} from "antd";
import { Link } from "react-router-dom";
import moment from "moment";

import {
  SearchOutlined,
  LoadingOutlined,
  EditTwoTone,
} from "@ant-design/icons";
import { UserContext } from "../../context/UserContext";
import myAxios from "../../myAxios";
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const tableLoading = {
  indicator: <Spin indicator={antIcon} />,
};

class RiwayatMasuk extends Component {
  constructor(props) {
    super(props);
    this.state = {
      riwMasuk: null,
      filteredInfo: null,
      sortedInfo: null,
      currId: null,
      token: null,
      searchText: "",
      searchedColumn: "",
      loading: false,
    };
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
    const user = this.context;
    console.log("CEK " + user.object);
    this.setState({ token: localStorage.getItem("token"), loading: true });
    console.log("SYALALA : " + localStorage.getItem("token"));
    this.setState({ loading: tableLoading });
    if (this.state.riwMasuk === null) {
      myAxios
        .get(`showRiwayatBahanMasuk`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          const data = res.data.data;
          data.map((el) => {
            el.tanggal = moment(el.tanggal).format("D MMM YY");
          });
          this.setState({
            riwMasuk: data,
            loading: false,
          });
          console.log("Data riwMasuk = ");
          console.log(res.data.data);
        })
        .catch((err) => {
          this.setState({
            loading: false,
          });
          message.error("Gagal Ambil : " + err);
          console.log("error  : " + err);
        });
    }
    console.log(this.state.riwMasuk);
  }

  DeleteItem(param) {
    const mytoken = localStorage.getItem("token");
    console.log("Delete Item " + param + mytoken);
    let newObj = {};
    axios
      .put(
        `https://dbakbresto.ezraaudivano.com/api/deleteriwMasuk/${param}`,
        newObj,
        {
          headers: {
            Authorization: "Bearer " + mytoken,
          },
        }
      )
      .then((res) => {
        let filter = this.state.riwMasuk.filter((el) => {
          return el.id === param;
        });
        console.log(res);
        message.success(res.data.data.nama + " berhasil dinonaktifkan!");
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
        title: "Tanggal Masuk",
        dataIndex: "tanggal",
        key: "tanggal",
        ...this.getColumnSearchProps("tanggal"),
        filteredValue: filteredInfo.tanggal || null,
        sorter: (a, b) => a.tanggal.length - b.tanggal.length,
        ellipsis: true,
      },
      {
        title: "Bahan",
        dataIndex: "nama_bahan",
        key: "nama_bahan",
        ...this.getColumnSearchProps("nama_bahan"),
        filteredValue: filteredInfo.nama_bahan || null,
        sorter: (a, b) => a.nama_bahan.length - b.nama_bahan.length,
      },
      {
        title: "Jumlah",
        dataIndex: "jumlah",
        key: "jumlah",
        sorter: (a, b) => a.jumlah - b.jumlah,
        ellipsis: true,
      },
      {
        title: "Harga",
        dataIndex: "harga",
        key: "harga",
        filteredValue: filteredInfo.harga || null,
        onFilter: (value, record) => record.harga.includes(value),
        sorter: (a, b) => a.harga - b.harga,
      },

      // {
      //   title: 'Action',
      //   dataIndex: 'id',
      //   key: 'id',

      //   render: (dataIndex) => (
      //     <div>
      //       <Link className='link' to={`/editEmployee/${dataIndex}`}>
      //         <EditTwoTone
      //           twoToneColor='#d94a4b'
      //           style={{ marginRight: '5px' }}
      //         />
      //       </Link>
      //     </div>
      //   ),
      // },
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
          <strong>data riwayat bahan masuk</strong>
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
        </Space>
        <Table
          loading={this.state.loading}
          scroll={{ x: 900, y: 1000 }}
          columns={columns}
          dataSource={this.state.riwMasuk}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default RiwayatMasuk;
