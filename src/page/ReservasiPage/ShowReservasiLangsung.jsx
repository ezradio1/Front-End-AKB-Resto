import React, { Component } from 'react';
import { Link, BrowserRouter as Route, Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Iframe from 'react-iframe';

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
  Tag,
  Empty,
  Spin,
  Tooltip,
} from 'antd';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import QRCode from 'react-qr-code';
import Moment from 'moment';
import moment from 'moment';
import {
  SearchOutlined,
  DeleteTwoTone,
  EditTwoTone,
  LoadingOutlined,
  QrcodeOutlined,
  ScanOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { UserContext } from '../../context/UserContext';
import myAxios from '../../myAxios';
import LogoQR from '../../asset/logo/akb-logo-full.png';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const tableLoading = {
  indicator: <Spin indicator={antIcon} />,
};

class ShowReservasiLangsung extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      reservasi: null,
      filteredInfo: null,
      sortedInfo: null,
      idEdit: null,
      searchText: '',
      searchedColumn: '',
      judulModal: '',
      buttonModal: '',
      loading: false,
      loadingAct: false,
      validated: false,
      modalQr: false,
      objectQr: '',
      loadingQr: false,
      printed: '',
      loadingTable: null,
      cekStatus: false,
      no_trans: '',
    };
  }

  static contextType = UserContext;

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  EditRoute = ({ ...props }) => {
    let filter = this.state.reservasi.filter((el) => {
      return el.id === this.state.idEdit;
    });
    if (filter[0].status === 'Selesai') {
      message.error('Tidak Bisa Diedit');
    } else {
      return <Route {...props} />;
    }
  };

  handleChangeInput = (evt) => {
    console.log(evt.target.value);
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  };

  handleChangeInputTanggal = (evt) => {
    const tanggal = evt._d;
    console.log(tanggal);
    this.setState({
      tanggal: Moment(tanggal).format('YYYY-MM-DD'),
    });
  };

  handleCancel = () => {
    this.setState({
      modalQr: false,
    });
  };

  editReservasi = (index) => {
    this.setState({ loadingAct: true });
    let filter = this.state.reservasi.filter((el) => {
      return el.id === index;
    });
    let data_reservasi = filter[0];
    if (data_reservasi.status === 'Selesai') {
      this.setState({ cekStatus: true });
      this.setState({ idEdit: index.id });
      this.setState({ loadingAct: false });
      message.error('Data Reservasi "Selesai" tidak bisa diedit!');
    } else {
      window.location.pathname = `/showReservasiLangsung/editReservasiLangsung/${index}`;
      this.setState({ cekStatus: false });
    }
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

  getReservasi = () => {
    this.setState({
      loadingTable: tableLoading,
    });
    myAxios
      .get(`showReservasiLangsung`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((res) => {
        const data = res.data.data;
        data.map((el) => {
          el.tanggal_reservasi = Moment(el.tanggal_reservasi).format(
            'D MMM YY'
          );
        });
        this.setState({
          reservasi: data,
          loading: false,
          loadingTable: false,
        });
        console.log('Data Reservasi = ');
        console.log(res.data.data);
      })
      .catch((err) => {
        message.info(err.response.data.message);
        this.setState({
          loading: false,
          loadingTable: false,
        });
      });

    console.log(this.state.bahan);
  };

  componentDidMount() {
    this.setState({ loading: true });
    const user = this.context;
    if (this.state.reservasi === null) {
      this.getReservasi();
    }
  }

  DeleteItem(param) {
    let filter = this.state.reservasi.filter((el) => {
      return el.id === param;
    });
    this.setState({ loadingAct: true });
    let data_reservasi = filter[0];
    console.log('hay');
    console.log(param);
    if (data_reservasi.status === 'Selesai') {
      this.setState({ cekStatus: true });
      this.setState({ idEdit: param, loadingAct: false });
      message.error('Data Reservasi "Selesai" tidak bisa dihapus!');
    } else {
      const mytoken = localStorage.getItem('token');
      console.log('Delete Item ' + param + mytoken);
      let newObj = {};
      myAxios
        .put(`deleteReservasi/${param}`, newObj, {
          headers: {
            Authorization: 'Bearer ' + mytoken,
          },
        })
        .then((res) => {
          let filter = this.state.reservasi.filter((el) => {
            return el.id !== param;
          });
          this.setState({ reservasi: filter, loadingAct: false });
          console.log(res);
          message.success('Data Reservasi berhasil dihapus!');
        })
        .catch((err) => {
          this.setState({ loadingAct: false });
          message.error('Gagal Menghapus : ' + err);
        });
      this.setState({ cekStatus: false });
    }
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

  openModalQr = (id) => {
    console.log('hay');
    console.log(id);
    let filter = this.state.reservasi.filter((el) => {
      return el.id === id;
    });
    var wkt = moment().format('LT');
    var tgl = moment().format('l');

    if (
      Moment(filter[0].tanggal_reservasi).format('YYYY-MM-DD') ==
      Moment().format('YYYY-MM-DD')
    ) {
      let newObj = {
        id_reservasi: id,
      };
      this.setState({
        loadingQr: true,
        loadingAct: true,
      });
      console.log(this.state.modalQr);
      myAxios
        .post(`transaksi`, newObj, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        })
        .then((res) => {
          let data = res.data.data;
          console.log(data);
          console.log('qr di table');
          let objQr = `${data.id_transaksi};${filter[0].nama_customer};Table ${filter[0].nomor_meja};${tgl};${wkt}`;

          this.setState({
            modalQr: true,
            no_trans: data.nomor_transaksi,
            objectQr: objQr,
            idEdit: id,
            loadingQr: false,
            printed: data.printed,
            loadingAct: false,
          });
          this.getReservasi();
        })
        .catch((err) => {
          message.error('Tambah Bahan Gagal : ' + err.response.data.message);
          this.setState({
            loadingQr: false,
            loadingAct: false,
          });
        });
    } else {
      message.info('Tanggal reservasi bukan hari ini!');
    }
  };

  generatePdfQr = () => {
    this.setState({ loading: true });
    let el = document.getElementById('modalQr');
    // var pri = document.getElementById('ifmcontentstoprint').contentWindow;
    // pri.document.open();
    // pri.document.write(el.innerHTML);
    // pri.document.close();
    // pri.focus();
    // pri.print();

    var pdf = new jsPDF('p', 'mm', [140, 185]);
    html2canvas(el, { scale: 1, scrollY: window.scrollY }).then((canvas) => {
      let img = canvas.toDataURL('image/jpg');
      pdf.addImage(img, 'JPEG', 10, 15, el.style.width, el.style.height);
      pdf.autoPrint();
      pdf.output('dataurlnewwindow', 'QR_' + this.state.no_trans + '.pdf');
      // pdf.save('QR_' + this.state.no_trans + '.pdf');
      this.setState({ loading: false, modalQr: false });
    });
  };

  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [
      {
        title: 'Tanggal',
        dataIndex: 'tanggal_reservasi',
        key: 'tanggal_reservasi',
        ...this.getColumnSearchProps('tanggal_reservasi'),
        filteredValue: filteredInfo.tanggal_reservasi || null,
        sorter: (a, b) =>
          a.tanggal_reservasi.length - b.tanggal_reservasi.length,
        ellipsis: true,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        filters: [
          { text: 'Pending', value: 'Pending' },
          { text: 'Selesai', value: 'Selesai' },
        ],

        filteredValue: filteredInfo.status || null,
        onFilter: (value, record) => record.status.includes(value),
        sorter: (a, b) => a.status.length - b.status.length,
        ellipsis: true,
        render: (status) => (
          <>
            <Tag color={status === 'Pending' ? 'blue' : 'green'}>
              {status.toUpperCase()}
            </Tag>
          </>
        ),
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
        title: 'Meja',
        dataIndex: 'nomor_meja',
        key: 'nomor_meja',
        ...this.getColumnSearchProps('nomor_meja'),
        filteredValue: filteredInfo.nomor_meja || null,
        onFilter: (value, record) => record.nomor_meja.includes(value),
        sorter: (a, b) => a.nomor_meja - b.nomor_meja,
      },
      {
        title: 'Karyawan',
        dataIndex: 'nama_karyawan',
        key: 'nama_karyawan',
        ...this.getColumnSearchProps('nama_karyawan'),
        filteredValue: filteredInfo.nama_karyawan || null,
        sorter: (a, b) => a.nama_karyawan.length - b.nama_karyawan.length,
      },
      {
        align: 'center',
        // title: "Action",
        dataIndex: 'id',
        key: 'id',

        render: (dataIndex) => (
          <>
            {!this.state.loadingAct && (
              <div>
                <Tooltip
                  placement='bottom'
                  title='Cetak Qr'
                  color='#1f1f1f'
                  key='white'>
                  <QrcodeOutlined
                    style={{ marginRight: '5px' }}
                    onClick={() => this.openModalQr(dataIndex)}
                  />
                </Tooltip>

                <Tooltip
                  placement='bottom'
                  title='Edit Reservasi'
                  color='#1f1f1f'
                  key='white'>
                  <EditTwoTone
                    twoToneColor='blue'
                    style={{ marginRight: '5px' }}
                    onClick={() => this.editReservasi(dataIndex)}></EditTwoTone>
                </Tooltip>
                <Tooltip
                  placement='bottom'
                  title='Hapus Reservasi'
                  color='#1f1f1f'
                  key='white'>
                  <Popconfirm
                    placement='left'
                    title={'Apakah anda yakin ingin menghapus ?'}
                    onConfirm={() => this.DeleteItem(dataIndex)}
                    okText='Yes'
                    cancelText='No'>
                    <DeleteTwoTone twoToneColor='red' />
                  </Popconfirm>
                </Tooltip>
              </div>
            )}
            {this.state.loadingAct && <Spin indicator={antIcon} />}
          </>
        ),
      },
    ];

    return (
      <div style={{ padding: '25px 30px' }}>
        <Modal
          id='modalQrr'
          style={{ top: 30, fontFamily: 'poppins' }}
          visible={this.state.modalQr}
          title='Cetak QR Code Pesanan'
          onCancel={this.handleCancel}
          footer={[]}
          width={500}>
          <div id='modalQr'>
            <h1 style={{ textAlign: 'center' }}>
              <img
                style={{ width: '32%', marginBottom: '5px' }}
                src={LogoQR}
                alt=''
              />

              <br />
              {this.state.loadingQr && <Spin indicator={antIcon} />}
              <br />
              {!this.state.loadingQr && (
                <>
                  <QRCode
                    fgColor='#1F1F1F'
                    style={{
                      textAlign: 'center',
                      marginBottom: '10px',
                    }}
                    value={this.state.objectQr}
                  />
                  <br />
                  <p
                    style={{
                      fontSize: '20px',
                      marginTop: '35px',
                      fontFamily: 'poppins',
                    }}>
                    <b>{this.state.printed}</b>
                    <span
                      style={{
                        fontSize: '15px',
                        color: 'grey',
                      }}>
                      <br />
                      Printed by {localStorage.getItem('nama')}
                    </span>
                    <hr />
                    <p>FUN PLACE TO GRILL</p>
                    <hr />
                  </p>
                </>
              )}
            </h1>
          </div>

          <h1 style={{ textAlign: 'center' }}>
            <Button
              type='primary'
              onClick={this.generatePdfQr}
              loading={this.state.loading}
              style={{
                borderRadius: '5px',
                margin: '15px',
                width: '60%',
                fontFamily: 'poppins',
              }}>
              Cetak QR Code
            </Button>
          </h1>
        </Modal>

        <h1
          style={{
            fontSize: 'x-large',
            color: '#001529',
            textTransform: 'uppercase',
          }}>
          <b>reservasi langsung</b>
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
            onClick={this.reservasiLangsung}>
            <Link className='link' to='showReservasiLangsung/reservasiLangsung'>
              Tambah Reservasi
            </Link>
          </Button>
        </Space>
        <Table
          loading={this.state.loadingTable}
          loadingIndicator={antIcon}
          scroll={{ x: 900, y: 1000 }}
          columns={columns}
          dataSource={this.state.reservasi}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default ShowReservasiLangsung;
