import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Space, Popconfirm, Input, message, Tag } from 'antd';
import { Link } from 'react-router-dom';

import { SearchOutlined, DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import { UserContext } from '../../context/UserContext';
import myAxios from '../../myAxios';

class ShowEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      karyawan: null,
      filteredInfo: null,
      sortedInfo: null,
      currId: null,
      token: null,
      searchText: '',
      searchedColumn: '',
    };
  }
  static contextType = UserContext;

  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: null,
      sortDirection: 'asc',
      searchText: '',
      searchedColumn: '',
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
        order: 'descend',
        columnKey: 'year',
      },
    });
  };

  componentDidMount() {
    const user = this.context;
    console.log('CEK ' + user.object);
    this.setState({ token: localStorage.getItem('token') });
    console.log('SYALALA : ' + localStorage.getItem('token'));
    if (this.state.karyawan === null) {
      myAxios
        .get(`showKaryawan`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        })
        .then((res) => {
          const data = res.data.data;
          this.setState({
            karyawan: data,
          });
          console.log('Data Karyawan = ');
          console.log(res.data.data);
        })
        .catch((err) => {
          message.error('Gagal Ambil : ' + err);
          console.log('error  : ' + err);
        });
    }
    console.log(this.state.karyawan);
  }

  DeleteItem(param) {
    const mytoken = localStorage.getItem('token');
    console.log('Delete Item ' + param + mytoken);
    let newObj = {};
    axios
      .put(
        `https://dbakbresto.ezraaudivano.com/api/deleteKaryawan/${param}`,
        newObj,
        {
          headers: {
            Authorization: 'Bearer ' + mytoken,
          },
        }
      )
      .then((res) => {
        let filter = this.state.karyawan.filter((el) => {
          return el.id === param;
        });
        console.log(res);
        message.success(res.data.data.nama + ' berhasil dinonaktifkan!');
      })
      .catch((err) => {
        message.error('Gagal Menghapus : ' + err);
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
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}>
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size='small'
            style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    console.log(
      'data:' +
        selectedKeys[0] +
        'confirmnya : ' +
        confirm +
        'datin :' +
        dataIndex
    );
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [
      {
        title: 'Nama',
        dataIndex: 'nama',
        key: 'nama',
        ...this.getColumnSearchProps('nama'),
        filteredValue: filteredInfo.nama || null,
        sorter: (a, b) => a.nama.length - b.nama.length,
        ellipsis: true,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        sorter: (a, b) => a.email.length - b.email.length,
        ellipsis: true,
      },
      {
        title: 'Gender',
        dataIndex: 'jenisKelamin',
        key: 'jenisKelamin',
        filters: [
          { text: 'Laki-Laki', value: 'Laki-Laki' },
          { text: 'Perempuan', value: 'Perempuan' },
        ],
        filteredValue: filteredInfo.jenisKelamin || null,
        onFilter: (value, record) => record.jenisKelamin.includes(value),
        sorter: (a, b) => a.jenisKelamin.length - b.jenisKelamin.length,
      },
      {
        title: 'Jabatan',
        dataIndex: 'jabatan',
        key: 'jabatan',
        filters: [
          { text: 'Owner', value: 'Owner' },
          { text: 'Operational Manager', value: 'Operational Manager' },
          { text: 'Cashier', value: 'Cashier' },
          { text: 'Chef', value: 'Chef' },
          { text: 'Waiter', value: 'Waiter' },
        ],
        filteredValue: filteredInfo.jabatan || null,
        onFilter: (value, record) => record.jabatan.includes(value),
        sorter: (a, b) => a.jabatan.length - b.jabatan.length,
        ellipsis: true,
      },
      {
        title: 'Telepon',
        dataIndex: 'telepon',
        key: 'telepon',
        ellipsis: true,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        filters: [
          { text: 'Aktif', value: 'Aktif' },
          { text: 'Resign', value: 'Resign' },
        ],
        filteredValue: filteredInfo.status || null,
        onFilter: (value, record) => record.status.includes(value),
        sorter: (a, b) => a.status.length - b.status.length,
        ellipsis: true,
        render: (status) => (
          <>
            <Tag color={status === 'Resign' ? 'red' : 'blue'}>
              {status.toUpperCase()}
            </Tag>
          </>
        ),
      },
      {
        title: 'Bergabung',
        dataIndex: 'tanggal_bergabung',
        key: 'tanggal_bergabung',
        ...this.getColumnSearchProps('tanggal_bergabung'),
        filteredValue: filteredInfo.title || null,
        sorter: (a, b) => a.title.length - b.title.length,
        ellipsis: true,
      },
      {
        title: 'Action',
        dataIndex: 'id',
        key: 'id',

        render: (dataIndex) => (
          <div>
            <Link className='link' to={`/editEmployee/${dataIndex}`}>
              <EditTwoTone
                twoToneColor='#d94a4b'
                style={{ marginRight: '5px' }}
              />
            </Link>
          </div>
        ),
      },
    ];
    return (
      <div style={{ padding: '25px 30px' }}>
        <h1
          style={{
            fontSize: 'x-large',
            color: '#001529',
            textTransform: 'uppercase',
          }}>
          <strong>data karyawan</strong>
        </h1>
        <div
          style={{
            border: '1px solid #8C98AD',
            marginTop: '-10px',
            marginBottom: '15px',
          }}></div>
        <Space style={{ marginBottom: 16 }}>
          <Button
            type='primary'
            style={{ width: 'auto', borderRadius: '7px' }}
            onClick={this.clearFilters}>
            Hapus Filter
          </Button>
        </Space>
        <Table
          scroll={{ x: 900, y: 1000 }}
          columns={columns}
          dataSource={this.state.karyawan}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default ShowEmployee;
