import React, { Component } from "react";
import axios from "axios";
import { Table, Button, Space, Input, message, Tag, Spin } from "antd";

import moment from "moment";
import Moment from "moment";

import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";
import { UserContext } from "../../context/UserContext";
import myAxios from "../../myAxios";
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const tableLoading = {
  indicator: <Spin indicator={antIcon} />,
};

class RiwayatKeluar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      riwKel: null,
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
    this.setState({
      token: localStorage.getItem("token"),
      loading: tableLoading,
    });
    console.log("SYALALA : " + localStorage.getItem("token"));
    if (this.state.riwKel === null) {
      myAxios
        .get(`showRiwayatBahanKeluar`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          const data = res.data.data;
          moment().format("Do MMm YY");
          data.map((el) => {
            el.tanggal = Moment(el.tanggal).format("D MMM YY");
          });
          console.log("test test");
          console.log(data.tanggal);
          this.setState({
            riwKel: data,
            loading: false,
          });
          console.log("Data riwKel = ");
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
    console.log(this.state.riwKel);
  }

  DeleteItem(param) {
    const mytoken = localStorage.getItem("token");
    console.log("Delete Item " + param + mytoken);
    let newObj = {};
    axios
      .put(
        `https://dbakbresto.ezraaudivano.com/api/deleteriwKel/${param}`,
        newObj,
        {
          headers: {
            Authorization: "Bearer " + mytoken,
          },
        }
      )
      .then((res) => {
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
    let { filteredInfo } = this.state;
    // sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [
      {
        title: "Tanggal Keluar",
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
        title: "Status",
        dataIndex: "status",
        key: "status",
        filters: [
          { text: "Buang", value: "Buang" },
          { text: "Keluar", value: "Keluar" },
        ],
        filteredValue: filteredInfo.status || null,
        onFilter: (value, record) => record.status.includes(value),
        sorter: (a, b) => a.status.length - b.status.length,
        ellipsis: true,
        render: (status) => (
          <>
            <Tag color={status === "Buang" ? "green" : "blue"}>
              {status.toUpperCase()}
            </Tag>
          </>
        ),
      },

      //   {
      //     title: 'Action',
      //     dataIndex: 'id',
      //     key: 'id',
      //     align: 'center',

      //     render: (dataIndex) => (
      //       <div>
      //         <Link className='link' to={`/editEmployee/${dataIndex}`}>
      //           <EditTwoTone
      //             twoToneColor='#d94a4b'
      //             style={{ marginRight: '5px' }}
      //           />
      //         </Link>
      //       </div>
      //     ),
      //   },
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
          <strong>data riwayat bahan keluar</strong>
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
          dataSource={this.state.riwKel}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default RiwayatKeluar;
