import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FormInstance } from 'antd/lib/form';
import {
  Input,
  Table,
  Button,
  Space,
  message,
  Modal,
  Tooltip,
  Row,
  Col,
  Spin,
  Empty,
  Menu,
  Select,
  Dropdown,
  DatePicker,
  InputNumber,
  Form,
} from 'antd';

import {
  SearchOutlined,
  LoadingOutlined,
  DownOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import Moment from 'moment';
import { UserContext } from '../../context/UserContext';
import myAxios from '../../myAxios';
import TableHijau from '../../asset/icon/tableHijau.png';
import TableMerah from '../../asset/icon/tableMerah.png';

import ReactToPrint from 'react-to-print';

import { ComponentToPrint } from './Nota';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const { Search } = Input;
const { Option } = Select;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const tableLoading = {
  indicator: <Spin indicator={antIcon} />,
};

class Transaksi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      transaksi: null,
      filteredInfo: null,
      sortedInfo: null,
      idEdit: null,
      searchText: '',
      searchedColumn: '',
      judulModal: '',
      buttonModal: '',
      loading: false,
      validated: false,
      detail: null,
      dataDetail: null,

      meja: null,
      tempmeja: null,
      idMeja: null,

      dataPembayaran: {
        id_transaksi: null,
        id_meja: null,
        metode_pembayaran: null,
        jenis_kartu: null,
        nama_pemilik: null,
        kode_verifikasi: null,
        bayar: null,
        nomor_kartu: 0,
        kembalian: 0,
        tanggal_kadaluwarsa: null,
      },
    };
  }

  static contextType = UserContext;

  openModal = async (index) => {
    this.setState({ detail: null });
    if (this.state.detail == null) {
      await this.getDetailransaksi(index);
      let filter = this.state.transaksi.filter((el) => {
        return el.id === index;
      });
      var item = filter[0];
      console.log(item);
      if (item.status === 'Pending') {
        message.info('Transaksi Belum Selesai!');
      } else {
        this.setState({
          modalVisible: true,
          judulModal: 'Detail Transaksi Pembayaran',
        });
        console.log(this.state.modalVisible);
      }
    }
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
      dataPembayaran: {
        metode_pembayaran: null,
        jenis_kartu: null,
        nama_pemilik: null,
        kode_verifikasi: null,
        bayar: null,
        nomor_kartu: null,
        kembalian: 0,
      },
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
        data.telepon = data.telepon.slice(1);
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

  getTransaksi = () => {
    this.setState({
      loading: tableLoading,
    });
    myAxios
      .get(`showRiwayatTransaksi`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((res) => {
        const data = res.data.data;
        data.map((el) => {
          el.tanggal_transaksi = Moment(el.tanggal_transaksi).format(
            'D MMM YY'
          );
        });
        this.setState({
          transaksi: data,
          loading: false,
        });
        console.log('Data Customer = ');
        console.log(res.data.data);
      });
  };
  getDetailransaksi = (id) => {
    console.log('id' + id);
    myAxios
      .get(`showDetailAll/${id}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((res) => {
        const data = res.data.dataDetailTransaksi;
        const dataDetail = res.data.dataTransaksi;

        this.setState({
          detail: data,
          dataDetail: dataDetail,
          loading: false,
        });
        console.log('Data Detail = ');
        console.log(dataDetail);
      });
  };

  getMeja = () => {
    myAxios
      .get(`showTransaksi`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
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
        this.setState({
          meja: data,
          tempMeja: data,
        });
      });
  };

  componentDidMount() {
    this.setState({ loading: true });
    const user = this.context;
    if (this.state.meja === null) {
      this.getMeja();
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
        this.setState({ transaksi: filter });
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

  onChangeNomor = (evt) => {
    this.setState((prevState) => ({
      dataPembayaran: {
        ...prevState.dataPembayaran,
        nomor_kartu: evt.target.value,
      },
    }));
  };
  onChangePemilik = (evt) => {
    this.setState((prevState) => ({
      dataPembayaran: {
        ...prevState.dataPembayaran,
        nama_pemilik: evt.target.value,
      },
    }));
  };
  onChangeVerif = (evt) => {
    this.setState((prevState) => ({
      dataPembayaran: {
        ...prevState.dataPembayaran,
        kode_verifikasi: evt.target.value,
      },
    }));
    console.log(evt);
  };
  onChangeMetode = (evt) => {
    this.setState((prevState) => ({
      dataPembayaran: { ...prevState.dataPembayaran, metode_pembayaran: evt },
    }));
  };
  onChangeKembalian = (evt) => {
    this.setState((prevState) => ({
      dataPembayaran: {
        ...prevState.dataPembayaran,
        kembalian:
          this.state.dataPembayaran.bayar - this.state.dataDetail.hargaSetelah,
      },
    }));
  };
  onChangeJenis = (evt) => {
    this.setState((prevState) => ({
      dataPembayaran: { ...prevState.dataPembayaran, jenis_kartu: evt },
    }));
  };
  onChangeUang = (e) => {
    let evt = e.target.value;
    this.setState((prevState) => ({
      dataPembayaran: {
        ...prevState.dataPembayaran,
        bayar: evt,
        kembalian: evt - this.state.dataDetail.hargaSetelah,
      },
    }));
  };
  onChangeTanggalKadal = (evt) => {
    const tanggal = evt._d;
    this.setState((prevState) => ({
      dataPembayaran: {
        ...prevState.dataPembayaran,
        tanggal_kadaluwarsa: Moment(tanggal).format('YYYY-MM-DD'),
      },
    }));
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log('Id = ' + this.state.idEdit);
    if (
      this.state.nama_customer === '' ||
      this.state.telepon === '' ||
      this.state.email === ''
    ) {
      message.error('Masukan input yang valid!');
    } else if (this.state.telepon[0] == 0 || this.state.telepon[0] != 8) {
      message.error('Nomor telepon harus diawali dengan 8!');
    } else if (
      this.state.telepon.length < 10 ||
      this.state.telepon.length > 14
    ) {
      message.error('Nomor telepon harus 10 - 14 digit!');
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
            this.getTransaksi();
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
          this.getTransaksi();
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
  };

  openTransaksi = (val) => {
    console.log('Get Meja');
    console.log(val);
    this.setState((prevState) => ({
      dataPembayaran: {
        ...prevState.dataPembayaran,
        id_transaksi: val.id,
        id_meja: val.id_meja,
      },
    }));
    if (val.status === 'Pending') {
      message.error('Transaksi belum selesai!');
    } else {
      console.log('masok');
      this.getDetailransaksi(val.id);
      this.setState({ modalVisible: true, idMeja: val.id });
      var tanggal = Moment(new Date(), 'YYYY-MM-DD');
    }
  };

  onChangeMeja = (e) => {
    // console.log(tempmeja);
    console.log('cek');
    var text = e.target.value;
    // const temp = tempmeja.filter((i) => {
    //   return (
    //     i.nama_customer.toLowerCase().includes(text.toLowerCase()) ||
    //     i.nomor_meja == e.target.value
    //   );
    // });
    // console.log('temp adalah ' + temp.length);
    console.log('target = ' + e.target.value);
    if (e.target.value == '') {
      // getTransaksi();
      // setSearch(false);
    } else {
      // setSearch(false);
      // setMeja(temp);
      // if (temp == 0) {
      //   setSearch(true);
      // }
    }
    // console.log(
    //   'ADALAH = ' +
    //     tempmeja.filter((i) => {
    //       return i.nomor_meja == e.target.value;
    //     })
    // );
  };

  handleOk = () => {
    this.setState({ loading: true });
    let idTransaksi = this.state.dataPembayaran.id_transaksi;
    let userr = JSON.parse(localStorage.getItem('user'));
    let newObj = {
      nomor_kartu: this.state.dataPembayaran.nomor_kartu,
      jenis_kartu: this.state.dataPembayaran.jenis_kartu,
      metode_pembayaran: this.state.dataPembayaran.metode_pembayaran,
      nama_pemilik: this.state.dataPembayaran.nama_pemilik,
      kode_verifikasi: this.state.dataPembayaran.kode_verifikasi,
      tanggal_kadaluwarsa: Moment(
        this.state.dataPembayaran.tanggal_kadaluwarsa
      ).format('YYYY-MM-DD'),
      id_meja: this.state.dataPembayaran.id_meja,
      id_karyawan: userr.id_karyawan,
    };
    myAxios
      .put(`bayar/${idTransaksi}`, newObj, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((res) => {
        let data = res.data.data;

        this.getMeja();
      })
      .catch((err) => {
        message.error('Transaksi Gagal : ' + err.response.data.message);
        this.setState({
          loading: false,
        });
      });

    myAxios
      .get(`cetakNota/${idTransaksi}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
          responseType: 'blob',
        },
      })
      .then((res) => {
        console.log(res);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'remaining_fee.pdf'); //or any other extension
        document.body.appendChild(link);
        link.click();
        this.setState({
          modalVisible: false,
          loading: false,
        });
        message.success('Transaksi Berhasil!');
      })
      .catch((err) => {
        message.error('Error cetak nota');
        this.setState({
          loading: false,
        });
      });
  };

  checkActionCode = async (rule, value, callback) => {
    console.log('value ' + value);
    console.log(value);
    if (value === '' || value === undefined || value === null) {
      rule.message = 'Masukan Uang!';
      this.formRef.setFields({
        masuk: {
          value: value,
          errors: [new Error('forbid ha')],
        },
      });
    } else if (value < this.state.dataDetail.hargaSetelah) {
      rule.message = 'Uang kurang!';
      this.formRef.setFields({
        masuk: {
          value: value,
          errors: [new Error('forbid ha')],
        },
      });
    } else {
      await callback();
    }
  };

  menu = (
    <Menu>
      <Menu.Item>
        <a
          target='_blank'
          rel='noopener noreferrer'
          onClick={() => this.onFilter('Selesai')}>
          Tampil Meja Selesai
        </a>
      </Menu.Item>
      <Menu.Item>
        <a
          target='_blank'
          rel='noopener noreferrer'
          onClick={() => this.onFilter('Pending')}>
          Tampil Meja Pending
        </a>
      </Menu.Item>
    </Menu>
  );

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
        title: 'Tanggal',
        dataIndex: 'tanggal_transaksi',
        key: 'tanggal_transaksi',
        ...this.getColumnSearchProps('tanggal_transaksi'),
        filteredValue: filteredInfo.tanggal_transaksi || null,
        sorter: (a, b) =>
          a.tanggal_transaksi.length - b.tanggal_transaksi.length,
        ellipsis: true,
      },
      {
        title: 'Pelanggan',
        dataIndex: 'nama_customer',
        key: 'nama_customer',
        ...this.getColumnSearchProps('nama_customer'),
        filteredValue: filteredInfo.nama_customer || null,
        sorter: (a, b) => a.nama_customer.length - b.nama_customer.length,
        ellipsis: true,
      },
      {
        title: 'Nomor Meja',
        dataIndex: 'nomor_meja',
        key: 'nomor_meja',
        ...this.getColumnSearchProps('nomor_meja'),
        onFilter: (value, record) => record.nomor_meja == value,
        filteredValue: filteredInfo.nomor_meja || null,
        sorter: (a, b) => a.nomor_meja.length - b.nomor_meja.length,
        ellipsis: true,
      },
      {
        title: 'Nama Kasir',
        dataIndex: 'nama_karyawan',
        key: 'nama_karyawan',
        ...this.getColumnSearchProps('nama_karyawan'),
        onFilter: (value, record) => record.nama_karyawan == value,
        filteredValue: filteredInfo.nama_karyawan || null,
        sorter: (a, b) => a.nama_karyawan.length - b.nama_karyawan.length,
        ellipsis: true,
      },
      {
        title: 'Total',
        dataIndex: 'total_harga',
        key: 'total_harga',
        onFilter: (value, record) => record.total_harga == value,
        filteredValue: filteredInfo.total_harga || null,
        sorter: (a, b) => a.total_harga.length - b.total_harga.length,
        ellipsis: true,
        width: '10%',
      },

      {
        title: '',
        dataIndex: 'id',
        key: 'id',
        width: '5%',

        render: (dataIndex) => (
          <div>
            <Tooltip
              placement='bottom'
              title='Lihat Detail Transaksi'
              color='#1f1f1f'
              key='white'>
              <InfoCircleOutlined
                type='primary'
                style={{ marginRight: '5px', borderRadius: 5 }}
                onClick={() => this.openModal(dataIndex)}>
                Detail
              </InfoCircleOutlined>
            </Tooltip>
          </div>
        ),
      },
    ];
    const columnsDetail = [
      {
        title: 'Nama Menu',
        dataIndex: 'nama_menu',
        key: 'nama_menu',
        ...this.getColumnSearchProps('nama_menu'),
        filteredValue: filteredInfo.nama_menu || null,
        sorter: (a, b) => a.nama_menu.length - b.nama_menu.length,
        ellipsis: true,
      },
      {
        title: 'Jumlah',
        dataIndex: 'jumlah',
        key: 'jumlah',
        filteredValue: filteredInfo.jumlah || null,
        sorter: (a, b) => a.jumlah.length - b.jumlah.length,
        ellipsis: true,
      },
      {
        title: 'Sub Total',
        dataIndex: 'subtotal',
        key: 'subtotal',
        filteredValue: filteredInfo.subtotal || null,
        sorter: (a, b) => a.subtotal.length - b.subtotal.length,
        ellipsis: true,
      },
    ];

    return (
      <div style={{ padding: '25px 30px' }}>
        {this.state.dataDetail && this.state.detail && (
          <Modal
            onOk={this.state.handleOk}
            style={{ top: 25 }}
            visible={this.state.modalVisible}
            title='Detail Transaksi'
            onCancel={this.handleCancel}
            footer={
              [
                // <Button key='back' onClick={this.handleCancel} type='danger'>
                //   Batal
                // </Button>,
                // <Button
                //   key='submit'
                //   type='primary'
                //   loading={this.state.loading}
                //   onClick={this.handleOk}>
                //   Bayar
                // </Button>,
              ]
            }
            width={1400}>
            <Form
              {...layout}
              ref={this.formRef}
              name='control-ref'
              onFinish={this.handleOk}>
              <Row>
                <Col xs={24} md={14}>
                  <Table
                    pagination='topLeft'
                    loading={this.state.loading}
                    loadingIndicator={antIcon}
                    scroll={{ x: 400, y: 500 }}
                    columns={columnsDetail}
                    dataSource={this.state.detail}
                    onChange={this.handleChange}
                  />
                </Col>
                <Col md={1}></Col>
                <Col xs={24} md={9}>
                  <Row>
                    <Col xs={12} md={12}>
                      <strong>
                        <label>Nomor Transaksi</label>
                      </strong>
                    </Col>
                    <Col xs={2} md={2}>
                      :
                    </Col>
                    <Col xs={10} md={10}>
                      <label style={{ color: 'grey' }}>
                        {this.state.dataDetail.nomor_transaksi}
                      </label>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={12}>
                      <strong>
                        <label>Tanggal Transaksi</label>
                      </strong>
                    </Col>
                    <Col xs={2} md={2}>
                      :
                    </Col>
                    <Col md={10} md={10}>
                      <label style={{ color: 'grey' }}>
                        {Moment(this.state.dataDetail.tanggal_transaksi).format(
                          'DD MMMM YYYY'
                        )}
                      </label>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={12}>
                      <strong>
                        <label>Nama Pelanggan</label>
                      </strong>
                    </Col>
                    <Col xs={2} md={2}>
                      :
                    </Col>
                    <Col xs={10} md={10}>
                      <label style={{ color: 'grey' }}>
                        {this.state.dataDetail.nama_customer}
                      </label>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={12}>
                      <strong>
                        <label>Nomor Meja</label>
                      </strong>
                    </Col>
                    <Col xs={2} md={2}>
                      :
                    </Col>
                    <Col xs={10} md={10}>
                      <label style={{ color: 'grey' }}>
                        {this.state.dataDetail.nomor_meja}
                      </label>
                    </Col>
                  </Row>

                  <hr style={{ margin: '7px auto' }} />
                  <Row>
                    <Col xs={12} md={12}>
                      <strong>
                        <label>Total Harga</label>
                      </strong>
                    </Col>
                    <Col xs={2} md={2}>
                      :
                    </Col>
                    <Col xs={10} md={10}>
                      <label style={{ color: 'grey' }}>
                        Rp. {this.state.dataDetail.total_harga},00
                      </label>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={12}>
                      <strong>
                        <label>Biaya Layanan</label>
                      </strong>
                    </Col>
                    <Col xs={2} md={2}>
                      :
                    </Col>
                    <Col xs={10} md={10}>
                      <label style={{ color: 'grey' }}>
                        Rp. {this.state.dataDetail.service},00
                      </label>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={12}>
                      <strong>
                        <label>Biaya Pajak</label>
                      </strong>
                    </Col>
                    <Col xs={2} md={2}>
                      :
                    </Col>
                    <Col xs={10} md={10}>
                      <label style={{ color: 'grey' }}>
                        Rp. {this.state.dataDetail.pajak},00
                      </label>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={12}>
                      <strong>
                        <label>Harga Total</label>
                      </strong>
                    </Col>
                    <Col xs={2} md={2}>
                      :
                    </Col>
                    <Col xs={10} md={10}>
                      <label style={{ color: 'grey' }}>
                        Rp. {this.state.dataDetail.hargaSetelah},00
                      </label>
                    </Col>
                  </Row>
                  <hr style={{ margin: '7px auto' }} />
                  <div style={{ height: '350px' }}>
                    <Row>
                      <Col xs={12} md={12}>
                        <strong>
                          <label>Metode Pembayaran</label>
                        </strong>
                      </Col>
                      <Col xs={2} md={2}>
                        :
                      </Col>
                      <Col xs={10} md={10}>
                        <Form.Item
                          name='metode_pembayaran'
                          rules={[
                            {
                              required: true,
                              message: 'Metode pembayaran wajib diisi',
                            },
                          ]}>
                          <Select
                            placeholder='Metode'
                            onChange={this.onChangeMetode}
                            value={this.state.dataPembayaran.metode_pembayaran}>
                            <Select.Option value='Tunai'>Tunai</Select.Option>
                            <Select.Option value='Non-Tunai'>
                              Non-Tunai
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    {this.state.dataPembayaran.metode_pembayaran ===
                      'Non-Tunai' && (
                      <>
                        <Row>
                          <Col xs={12} md={12}>
                            <strong>
                              <label>Nomor Kartu</label>
                            </strong>
                          </Col>
                          <Col xs={2} md={2}>
                            :
                          </Col>
                          <Col xs={10} md={10}>
                            <Form.Item
                              name='nomor_kartu'
                              rules={[
                                {
                                  required:
                                    this.state.dataPembayaran
                                      .metode_pembayaran === 'Non-Tunai'
                                      ? true
                                      : false,
                                  message: 'Nomor harus 16 digit!',
                                  min: 16,
                                  max: 16,
                                },
                              ]}>
                              <Input
                                style={{ width: '100%' }}
                                type='number'
                                onChange={this.onChangeNomor}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={12} md={12}>
                            <strong>
                              <label>Jenis Kartu</label>
                            </strong>
                          </Col>
                          <Col xs={2} md={2}>
                            :
                          </Col>
                          <Col xs={10} md={10}>
                            <Form.Item
                              name='jenis_kartu'
                              rules={[
                                {
                                  required: true,
                                  message: 'Jenis kartu wajib diisi',
                                },
                              ]}>
                              <Select
                                style={{ width: '100%' }}
                                placeholder='Jenis kartu'
                                onChange={this.onChangeJenis}
                                value={this.state.dataPembayaran.jenis_kartu}>
                                <Select.Option value='Kredit'>
                                  Kredit
                                </Select.Option>
                                <Select.Option value='Debit'>
                                  Debit
                                </Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                        {this.state.dataPembayaran.jenis_kartu === 'Kredit' && (
                          <Row>
                            <Col xs={12} md={12}>
                              <strong>
                                <label>Nama Pemilik</label>
                              </strong>
                            </Col>
                            <Col xs={2} md={2}>
                              :
                            </Col>
                            <Col xs={10} md={10}>
                              <Form.Item
                                name='nama_pemilik'
                                rules={[
                                  {
                                    required:
                                      this.state.dataPembayaran.jenis_kartu ===
                                      'Kredit'
                                        ? true
                                        : false,
                                    message: 'Nama wajib diisi',
                                  },
                                ]}>
                                <Input
                                  style={{ width: '100%' }}
                                  onChange={this.onChangePemilik}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        )}
                        <Row>
                          <Col xs={12} md={12}>
                            <strong>
                              <label>Kode Verifikasi</label>
                            </strong>
                          </Col>
                          <Col xs={2} md={2}>
                            :
                          </Col>
                          <Col xs={10} md={10}>
                            <Form.Item
                              name='kodeverifikasi'
                              rules={[
                                {
                                  required:
                                    this.state.dataPembayaran
                                      .metode_pembayaran === 'Non-Tunai'
                                      ? true
                                      : false,
                                  message: 'Kode wajib diisi',
                                },
                              ]}>
                              <Input
                                style={{ width: '100%' }}
                                onChange={this.onChangeVerif}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={12} md={12}>
                            <strong>
                              <label>Tanggal Kadaluwarsa</label>
                            </strong>
                          </Col>
                          <Col xs={2} md={2}>
                            :
                          </Col>
                          <Col xs={10} md={10}>
                            <Form.Item
                              name='kode_verifikasi'
                              rules={[
                                {
                                  required:
                                    this.state.dataPembayaran
                                      .metode_pembayaran === 'Non-Tunai'
                                      ? true
                                      : false,
                                  message: 'Tanggal wajib diisi',
                                },
                              ]}>
                              <DatePicker
                                style={{ width: '100%' }}
                                placeholder='Masukan Tanggal Kadaluwarsa'
                                format='YYYY/MM/DD'
                                onChange={this.onChangeTanggalKadal}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    )}
                    {this.state.dataPembayaran.metode_pembayaran ===
                      'Tunai' && (
                      <>
                        <Row>
                          <Col xs={12} md={12}>
                            <strong>
                              <label>Masukan Uang</label>
                            </strong>
                          </Col>
                          <Col xs={2} md={2}>
                            :
                          </Col>
                          <Col xs={10} md={10}>
                            <Form.Item
                              name='masuk'
                              rules={[
                                {
                                  required:
                                    this.state.dataPembayaran
                                      .metode_pembayaran === 'Tunai'
                                      ? true
                                      : false,
                                  message: 'Masukan uang!',
                                  validator: this.checkActionCode,
                                },
                              ]}>
                              <Input
                                style={{ width: '100%' }}
                                type='number'
                                prefix='Rp. '
                                onChange={this.onChangeUang}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        {this.state.dataPembayaran.kembalian > 0 && (
                          <Row>
                            <Col xs={12} md={12}>
                              <strong>
                                <label>Kembalian</label>
                              </strong>
                            </Col>
                            <Col xs={2} md={2}>
                              :
                            </Col>
                            <Col xs={10} md={10}>
                              <Input
                                disabled
                                type='number'
                                prefix='Rp. '
                                value={this.state.dataPembayaran.kembalian}
                              />
                            </Col>
                          </Row>
                        )}
                      </>
                    )}
                  </div>
                  <Form.Item>
                    <Row style={{}}>
                      <Col>
                        <Button
                          key='back'
                          onClick={this.handleCancel}
                          loading={this.state.loading}
                          type='danger'>
                          Batal
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          type='primary'
                          htmlType='submit'
                          loading={this.state.loading}>
                          Bayar
                        </Button>
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        )}

        <>
          <h1
            style={{
              fontSize: 'x-large',
              color: '#001529',
              textTransform: 'uppercase',
            }}>
            <strong>transaksi per hari</strong>
          </h1>
          <div
            style={{
              border: '1px solid #8C98AD',
              marginTop: '-10px',
              marginBottom: '5px',
            }}></div>

          <Row align='middle' justify='space-between' style={{ width: '100%' }}>
            <Col xs={24} md={1}>
              <Button
                type='primary'
                onClick={this.hapusFilter}
                style={{ width: '120px', marginTop: '10px' }}>
                Hapus Filter
              </Button>
            </Col>
            <Col xs={24} md={2}>
              <Dropdown overlay={this.menu}>
                <Button
                  type='primary'
                  style={{ width: '100px', marginTop: '10px' }}>
                  Filter <DownOutlined />
                </Button>
              </Dropdown>
            </Col>
            <Col md={3}></Col>
            <Col xs={24} md={12}>
              <Input
                placeholder='Cari nomor meja atau nama pelanggan disini ..'
                icons='search'
                onChange={this.onChangeMeja}
                style={{ marginTop: '10px' }}
              />
            </Col>
          </Row>
          {this.state.search && <Empty style={{ marginTop: '35px' }} />}
          {!this.state.meja && (
            <h1
              style={{
                marginTop: '25px',
                textAlign: 'center',
              }}>
              <Spin />
              <p style={{ color: 'grey', fontSize: '15px' }}>
                Mengambil data transaksi...
              </p>
            </h1>
          )}
          {this.state.meja && (
            <Row justify='start'>
              {this.state.meja.map((val, index) => {
                return (
                  <Col xs={12} md={4} style={{ marginTop: '10px' }}>
                    <Tooltip title={val.nomor_transaksi} placement='bottom'>
                      <div onClick={() => this.openTransaksi(val)}>
                        <div className='flip-card'>
                          <div className='flip-card-front'>
                            <h1 style={{ textAlign: 'center' }}>
                              {val.nomor_meja}
                            </h1>
                            {val.status === 'Pending' && (
                              <img src={TableMerah} alt='' />
                            )}
                            {val.status === 'Selesai' && (
                              <img src={TableHijau} alt='' />
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
  }
}

export default Transaksi;
