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
  Spin,
} from 'antd';

import {
  SearchOutlined,
  DeleteTwoTone,
  EditTwoTone,
  LoadingOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons';
import { UserContext } from '../../context/UserContext';
import myAxios from '../../myAxios';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const tableLoading = {
  indicator: <Spin indicator={antIcon} />,
};

class DaftarPesanan extends Component {
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
    this.setState({
      loading: tableLoading,
    });
    myAxios
      .get(`showDetailPesananChef`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((res) => {
        const data = res.data.data;
        this.setState({
          loading: false,
          pesanan: data,
        });
        console.log('Data Pesanan Chef = ');
        console.log(res.data.data);
      })
      .catch((err) => {
        this.setState({
          loading: false,
        });
        message.info(err.response.data.message);
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
      status_pesanan: 'Ready to Serve',
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
        message.success('Pesanan berhasil diupdate!');
      })
      .catch((err) => {
        message.error('Gagal Menghapus : ' + err.response.data.message);
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
        title: 'Nomor Meja',
        dataIndex: 'nomor_meja',
        key: 'nomor_meja',
        ...this.getColumnSearchProps('nomor_meja'),
        filteredValue: filteredInfo.nomor_meja || null,
        onFilter: (value, record) => record.nomor_meja == value,
        sorter: (a, b) => a.nomor_meja.length - b.nomor_meja.length,
        ellipsis: true,
      },
      // {
      //   title: 'Status Pesanan',
      //   dataIndex: 'status_pesanan',
      //   key: 'status_pesanan',
      //   filters: [
      //     { text: 'Gram', value: 'gram' },
      //     { text: 'Mililiter', value: 'ml' },
      //     { text: 'Botol', value: 'botol' },
      //   ],
      //   filteredValue: filteredInfo.status_pesanan || null,
      //   onFilter: (value, record) => record.status_pesanan.includes(value),
      //   sorter: (a, b) => a.status_pesanan.length - b.status_pesanan.length,
      // },
      {
        align: 'center',

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
                <Button type='primary'>Siap Dihidangkan</Button>
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
          <strong>pesanan antre masak</strong>
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

export default DaftarPesanan;
