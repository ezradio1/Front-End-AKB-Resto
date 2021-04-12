import React, { Component } from 'react';
import ResizableAntdTable from 'resizable-antd-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Input,
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Tooltip,
  Modal,
  Select,
  DatePicker,
  Tag,
} from 'antd';

import moment from 'moment';
import Moment from 'moment';
import {
  SearchOutlined,
  DeleteTwoTone,
  EditTwoTone,
  LoadingOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons';
import { UserContext } from '../../context/UserContext';
import myAxios from '../../myAxios';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

class DaftarPesananWaiter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pesanan: null,
      filteredInfo: null,
      sortedInfo: null,
      idEdit: null,
      searchText: '',
      searchedColumn: '',
      loading: false,
      validated: false,
    };
  }

  static contextType = UserContext;

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  handleChangeInput = (evt) => {
    console.log(evt.target.value);
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  };

  handleCancel = () => {
    this.setState({
      modalVisible: false,
      modalStokVisible: false,
      modalKeluarVisible: false,
      nama_bahan: null,
      jumlah: '',
      harga: '',
      tanggal: null,
      unit: '',
    });
  };

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

  getPesanan = () => {
    myAxios
      .get(`showDetailPesananWaiter`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((res) => {
        const data = res.data.data;
        this.setState({
          pesanan: data,
          loading: false,
        });
        console.log('Data Bahan = ');
        console.log(res.data.data);
      });

    console.log(this.state.pesanan);
  };

  componentDidMount() {
    this.setState({ loading: true });
    const user = this.context;
    if (this.state.pesanan === null) {
      this.getPesanan();
    }
  }

  updateStatus(param) {
    const mytoken = localStorage.getItem('token');
    console.log('Delete Item ' + param + mytoken);
    let newObj = {
      status_pesanan: 'Already Served',
    };
    myAxios
      .put(`updateStatusPesanan/${param}`, newObj, {
        headers: {
          Authorization: 'Bearer ' + mytoken,
        },
      })
      .then((res) => {
        let filter = this.state.pesanan.filter((el) => {
          return el.id !== param;
        });
        this.setState({ pesanan: filter });
        console.log(res);
        message.success(res.data.data.nama_menu + ' berhasil diupdate!');
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
        title: 'Nomor Transaksi',
        dataIndex: 'nomor_transaksi',
        key: 'nomor_transaksi',
        ...this.getColumnSearchProps('nomor_transaksi'),
        filteredValue: filteredInfo.nomor_transaksi || null,
        sorter: (a, b) => a.nomor_transaksi.length - b.nomor_transaksi.length,
        ellipsis: true,
      },
      {
        title: 'Nama Menu',
        dataIndex: 'nama_menu',
        key: 'nama_menu',
        filteredValue: filteredInfo.nama_menu || null,
        onFilter: (value, record) => record.nama_menu == value,
        sorter: (a, b) => a.nama_menu.length - b.nama_menu.length,
        ellipsis: true,
      },
      {
        title: 'Jumlah Menu',
        dataIndex: 'jumlah',
        key: 'jumlah',
        filteredValue: filteredInfo.jumlah || null,
        onFilter: (value, record) => record.jumlah == value,
        sorter: (a, b) => a.jumlah.length - b.jumlah.length,
        ellipsis: true,
      },
      {
        title: 'Status Pesanan',
        dataIndex: 'status_pesanan',
        key: 'status_pesanan',
        filters: [
          { text: 'Gram', value: 'gram' },
          { text: 'Mililiter', value: 'ml' },
          { text: 'Botol', value: 'botol' },
        ],
        filteredValue: filteredInfo.status_pesanan || null,
        onFilter: (value, record) => record.status_pesanan.includes(value),
        sorter: (a, b) => a.status_pesanan.length - b.status_pesanan.length,
      },
      {
        align: 'center',
        title: 'Action',
        dataIndex: 'id',
        key: 'id',

        render: (dataIndex) => (
          <div>
            <Tooltip
              placement='bottom'
              title='Update Pesanan'
              color='#1f1f1f'
              key='white'>
              <Popconfirm
                placement='left'
                title={'Ubah Status Pesanan ?'}
                onConfirm={() => this.updateStatus(dataIndex)}
                okText='Yes'
                cancelText='No'>
                <CloudUploadOutlined twoToneColor='#d94a4b' />
              </Popconfirm>
            </Tooltip>
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
          <strong>daftar pesanan pelanggan</strong>
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
          loading={this.state.loading}
          loadingIndicator={antIcon}
          scroll={{ x: 900, y: 1000 }}
          columns={columns}
          dataSource={this.state.pesanan}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default DaftarPesananWaiter;
