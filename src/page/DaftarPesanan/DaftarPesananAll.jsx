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

class DaftarPesananAll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalStokVisible: false,
      modalVisible: false,
      pesanan: null,
      filteredInfo: null,
      sortedInfo: null,
      idEdit: null,
      searchText: '',
      searchedColumn: '',
      judulModal: '',
      buttonModal: '',
      loading: false,
      validated: false,

      nama_bahan: null,
      unit: '',

      harga: '',
      tanggal: null,
      jumlah: '',
      suffix: null,
    };
  }

  static contextType = UserContext;

  openModal = () => {
    this.setState({
      modalVisible: true,
      buttonModal: 'Tambah Bahan',
      judulModal: 'Tambah Data Bahan',
      nama_bahan: '',
      unit: '',
    });
    console.log(this.state.modalVisible);
  };

  openModalStok = () => {
    this.setState({
      modalStokVisible: true,
    });
    console.log(this.state.modalStokVisible);
  };

  openModalKeluar = () => {
    this.setState({
      modalKeluarVisible: true,
    });
    console.log(this.state.modalVisible);
  };

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

  editBahan = (modalVisible, index) => {
    console.log('id handle  = ' + index);
    this.setState({
      nama_bahan: '',
      unit: '',
      idEdit: index,
    });
    myAxios
      .get(`showBahan/${index}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((res) => {
        const data = res.data.data;
        this.setState({
          modalVisible,
          judulModal: 'Edit Data Bahan',
          buttonModal: 'Edit Bahan',
          nama_bahan: data.nama_bahan,
          unit: data.unit,
        });
        console.log('Data Bahan = ');
        console.log(res.data.data);
      });

    console.log('ID Edit Adalah : ' + this.state.nama_bahan);
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
      .get(`showPesananAll`, {
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
        console.log('Data Pesanan = ');
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

  onChangeTak = (evt) => {
    const bahan = this.state.bahan.filter((i) => {
      return i.nama_bahan == evt;
    });
    this.setState({
      nama_bahan: evt,
      suffix: bahan[0].unit,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log('Id = ' + this.state.idEdit);
    if (this.state.nama_bahan === '' || this.state.unit === '') {
      message.error('Masukan input yang valid!');
    } else {
      if (this.state.idEdit === null) {
        this.setState({ loading: true });
        console.log('MASUK TAMBAH MENU');
        console.log('Handle Submit + ' + this.state.nama_bahan);
        let newObj = {
          nama_bahan: this.state.nama_bahan,
          jumlah: 0,
          unit: this.state.unit,
        };
        myAxios
          .post(`bahan`, newObj, {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          })
          .then((res) => {
            message.success(newObj.nama_bahan + ' berhasil ditambahkan!');
            let data = res.data.data;
            this.setState({
              modalVisible: false,
              nama_bahan: '',
              unit: '',
              loading: false,
              bahan: [...this.state.bahan, data],
            });
          })
          .catch((err) => {
            message.error('Tambah Bahan Gagal : ' + err.response.data.message);
          });
      } else {
        console.log('MASUK EDIT MENU');
        this.setState({ loading: true });
        let newObj = {
          nama_bahan: this.state.nama_bahan,
          unit: this.state.unit,
        };
        myAxios
          .put(`editBahan/${this.state.idEdit}`, newObj, {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          })
          .then((res) => {
            message.success(newObj.nama_bahan + ' berhasil diubah!');
            let data = res.data.data;
            const temp = this.state.bahan.filter((i) => {
              return i.id !== data.id;
            });
            this.setState({
              modalVisible: false,
              nama_bahan: '',
              unit: '',
              idEdit: null,
              loading: false,
            });
            // this.getBahan();
          })
          .catch((err) => {
            message.error('Ubah Bahan Gagal : ' + err.response.data.message);
          });
      }
    }
  };

  handleSubmitStok = (event) => {
    event.preventDefault();

    if (
      this.state.nama_bahan === null ||
      this.state.tanggal === '' ||
      this.state.harga === '' ||
      this.state.jumlah === ''
    ) {
      message.error('Masukan input yang valid!');
    } else {
      this.setState({
        loading: true,
      });
      console.log('MASUK TAMBAH STOK MENU');
      const temp = this.state.bahan.filter((i) => {
        return i.nama_bahan == this.state.nama_bahan;
      });
      let newObj = {
        tanggal: this.state.tanggal,
        jumlah: this.state.jumlah,
        harga: this.state.harga,
        id_bahan: temp[0].id,
      };
      myAxios
        .post(`riwayatBahanMasuk`, newObj, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        })
        .then((res) => {
          message.success(newObj.nama_bahan + ' berhasil tambah stok!');
          let data = res.data.data;
          this.setState({
            modalStokVisible: false,
            nama_bahan: '',
            harga: '',
            jumlah: '',
            tanggal: '',
            loading: false,
          });
          //   this.getBahan();
        })
        .catch((err) => {
          this.setState({
            loading: false,
          });
          message.error(
            'Tambah Stok Bahan Gagal : ' + err.response.data.message
          );
        });
    }
  };

  handleSubmitKeluar = (event) => {
    event.preventDefault();

    if (
      this.state.nama_bahan === null ||
      this.state.tanggal === '' ||
      this.state.jumlah === ''
    ) {
      message.error('Masukan input yang valid!');
    } else {
      this.setState({
        loading: true,
      });
      console.log('MASUK TAMBAH BAHAN BUANG');
      const temp = this.state.bahan.filter((i) => {
        return i.nama_bahan == this.state.nama_bahan;
      });
      let newObj = {
        tanggal: this.state.tanggal,
        jumlah: this.state.jumlah,
        id_bahan: temp[0].id,
        status: 'Buang',
      };
      myAxios
        .post(`riwayatBahanKeluar`, newObj, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        })
        .then((res) => {
          message.success(newObj.nama_bahan + ' berhasil dibuang!');
          let data = res.data.data;
          this.setState({
            modalKeluarVisible: false,
            nama_bahan: '',
            jumlah: '',
            tanggal: '',
            loading: false,
          });
          this.getBahan();
        })
        .catch((err) => {
          this.setState({
            loading: false,
          });
          message.error(
            'Tambah Bahan Buang Gagal : ' + err.response.data.message
          );
        });
    }
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

export default DaftarPesananAll;
