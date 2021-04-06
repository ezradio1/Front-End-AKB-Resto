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
  Modal,
  Select,
  DatePicker,
} from 'antd';

import moment from 'moment';
import Moment from 'moment';
import {
  SearchOutlined,
  DeleteTwoTone,
  EditTwoTone,
  LoadingOutlined,
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

class ShowCustomer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      customer: null,
      filteredInfo: null,
      sortedInfo: null,
      idEdit: null,
      searchText: '',
      searchedColumn: '',
      judulModal: '',
      buttonModal: '',
      loading: false,
      validated: false,

      nama_customer: '',
      telepon: '',
      email: '',
    };
  }

  static contextType = UserContext;

  openModal = () => {
    this.setState({
      modalVisible: true,
      buttonModal: 'Tambah Pelanggan',
      judulModal: 'Tambah Data Pelanggan',
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

  onFinish = (values) => {
    console.log('Success:', values.curr);
    console.log('Masuk On Finish');

    this.setState({ modalVisible: false });
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
    });
  };

  editPelanggan = (modalVisible, index) => {
    console.log('id handle  = ' + index);
    this.setState({
      nama_customer: '',
      telepon: '',
      email: '',
      idEdit: index,
    });
    myAxios
      .get(`showCustomer/${index}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((res) => {
        const data = res.data.data;
        this.setState({
          modalVisible,
          judulModal: 'Edit Data Pelanggan',
          buttonModal: 'Edit Pelanggan',
          nama_customer: data.nama_customer,
          telepon: data.telepon,
          email: data.email,
        });
        console.log('Data Pelanggan = ');
        console.log(res.data.data);
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

  getCustomer = () => {
    myAxios
      .get(`showCustomer`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((res) => {
        const data = res.data.data;
        this.setState({
          customer: data,
          loading: false,
        });
        console.log('Data Customer = ');
        console.log(res.data.data);
      });
  };

  componentDidMount() {
    this.setState({ loading: true });
    const user = this.context;
    if (this.state.customer === null) {
      this.getCustomer();
    }
  }

  DeleteItem(param) {
    const mytoken = localStorage.getItem('token');
    console.log('Delete Item ' + param + mytoken);
    let newObj = {};
    myAxios
      .put(`deleteCustomer/${param}`, newObj, {
        headers: {
          Authorization: 'Bearer ' + mytoken,
        },
      })
      .then((res) => {
        let filter = this.state.customer.filter((el) => {
          return el.id !== param;
        });
        this.setState({ customer: filter });
        console.log(res);
        message.success(res.data.data.nama_customer + ' berhasil dihapus!');
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
    if (this.state.telepon[0] == 0 || this.state.telepon[0] != 8) {
      message.error('Nomor telepon harus diawali dengan 8!');
    } else if (
      this.state.nama_customer === '' ||
      this.state.telepon === '' ||
      this.state.email === ''
    ) {
      message.error('Masukan input yang valid!');
    } else {
      if (this.state.idEdit === null) {
        this.setState({ loading: true });
        console.log('MASUK TAMBAH MENU');
        let newObj = {
          nama_customer: this.state.nama_customer,
          email: this.state.email,
          telepon: '0' + this.state.telepon,
        };
        myAxios
          .post(`customer`, newObj, {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          })
          .then((res) => {
            message.success(newObj.nama_customer + ' berhasil ditambahkan!');
            let data = res.data.data;
            this.setState({
              modalVisible: false,
              nama_customer: '',
              telepon: '',
              email: '',
              loading: false,
              customer: [...this.state.customer, data],
            });
          })
          .catch((err) => {
            message.error(
              'Tambah Pelanggan Gagal : ' + err.response.data.message
            );
            this.setState({
              loading: false,
            });
          });
      } else {
        console.log('MASUK EDIT PELANGGAN');
        this.setState({ loading: true });
        let newObj = {
          nama_customer: this.state.nama_customer,
          telepon: '0' + this.state.telepon,
          email: this.state.email,
        };
        myAxios
          .put(`editCustomer/${this.state.idEdit}`, newObj, {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          })
          .then((res) => {
            message.success(newObj.nama_customer + ' berhasil diubah!');
            let data = res.data.data;
            this.setState({
              modalVisible: false,
              nama_customer: '',
              telepon: '',
              email: '',
              idEdit: null,
              loading: false,
            });
            this.getCustomer();
          })
          .catch((err) => {
            this.setState({
              loading: false,
            });
            message.error(
              'Ubah Data Pelanggan Gagal : ' + err.response.data.message
            );
          });
      }
    }
  };

  handleSubmitStok = (event) => {
    event.preventDefault();

    if (
      this.state.nama_bahan === '' ||
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
            tanggal: '',
            loading: false,
          });
          this.getCustomer();
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
      this.state.nama_bahan === '' ||
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
          this.getCustomer();
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
        title: 'Nama Pelanggan',
        dataIndex: 'nama_customer',
        key: 'nama_customer',
        ...this.getColumnSearchProps('nama_customer'),
        filteredValue: filteredInfo.nama_customer || null,
        sorter: (a, b) => a.nama_customer.length - b.nama_customer.length,
        ellipsis: true,
      },
      {
        title: 'Telepon',
        dataIndex: 'telepon',
        key: 'telepon',
        onFilter: (value, record) => record.telepon == value,
        sorter: (a, b) => a.telepon.length - b.telepon.length,
        ellipsis: true,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        onFilter: (value, record) => record.email.includes(value),
        sorter: (a, b) => a.email.length - b.email.length,
      },
      {
        align: 'center',
        title: 'Action',
        dataIndex: 'id',
        key: 'id',

        render: (dataIndex) => (
          <div>
            <EditTwoTone
              twoToneColor='#d94a4b'
              style={{ marginRight: '5px' }}
              onClick={() => this.editPelanggan(true, dataIndex)}
            />
            <Popconfirm
              placement='left'
              title={'Apakah anda yakin ingin menghapus ?'}
              onConfirm={() => this.DeleteItem(dataIndex)}
              okText='Yes'
              cancelText='No'>
              <DeleteTwoTone twoToneColor='#d94a4b' />
            </Popconfirm>
          </div>
        ),
      },
    ];

    return (
      <div style={{ padding: '25px 30px' }}>
        <Modal
          visible={this.state.modalVisible}
          title={this.state.judulModal}
          onCancel={this.handleCancel}
          footer={[]}>
          <form onSubmit={this.handleSubmit}>
            <label>Nama Bahan</label>
            <Input
              placeholder='Nama Customer'
              name='nama_customer'
              value={this.state.nama_customer}
              onChange={this.handleChangeInput}
              autoComplete='off'
            />
            <label style={{ marginTop: '15px' }}>Telepon</label>
            <Input
              addonBefore='+62'
              placeholder='Telepon'
              name='telepon'
              value={this.state.telepon}
              onChange={this.handleChangeInput}
              autoComplete='off'
            />
            <label style={{ marginTop: '15px' }}>Email</label>
            <Input
              placeholder='Email'
              name='email'
              value={this.state.email}
              onChange={this.handleChangeInput}
              autoComplete='off'
            />
            <Button
              loading={this.state.loading}
              type='primary'
              style={{
                marginTop: '20px',
                width: '100%',
              }}>
              <button
                style={{
                  width: '100%',
                  border: 'transparent',
                  backgroundColor: 'transparent',
                }}>
                {this.state.buttonModal}
              </button>
            </Button>
          </form>
        </Modal>

        <h1
          style={{
            fontSize: 'x-large',
            color: '#001529',
            textTransform: 'uppercase',
          }}>
          <strong>data pelanggan</strong>
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
          <Button
            style={{ width: 'auto', borderRadius: '7px' }}
            type='primary'
            onClick={this.openModal}>
            Tambah Data Pelanggan
          </Button>
        </Space>
        <Table
          loading={this.state.loading}
          loadingIndicator={antIcon}
          scroll={{ x: 900, y: 1000 }}
          columns={columns}
          dataSource={this.state.customer}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default ShowCustomer;
