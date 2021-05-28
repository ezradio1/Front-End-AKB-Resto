import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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
  Form,
} from 'antd';

import {
  SearchOutlined,
  LoadingOutlined,
  DownOutlined,
} from '@ant-design/icons';
import Moment from 'moment';
import { UserContext } from '../../context/UserContext';
import myAxios from '../../myAxios';
import TableHijau from '../../asset/icon/tableHijau.png';
import TableMerah from '../../asset/icon/tableMerah.png';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const tableLoading = {
  indicator: <Spin indicator={antIcon} />,
};

class Transaksi extends Component {
  formRef = React.createRef();
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
      search: false,
      searchTxt: '',

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

  convertToRupiah(angka) {
    var rupiah = '';
    var angkarev = angka.toString().split('').reverse().join('');
    for (var i = 0; i < angkarev.length; i++)
      if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + '.';
    return (
      'Rp. ' +
      rupiah
        .split('', rupiah.length - 1)
        .reverse()
        .join('')
    );
  }

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
        console.log(dataDetail);
        dataDetail.total_harga = this.convertToRupiah(dataDetail.total_harga);
        dataDetail.service = this.convertToRupiah(dataDetail.service);
        dataDetail.pajak = this.convertToRupiah(dataDetail.pajak);
        dataDetail.hargaSetelah = this.convertToRupiah(
          parseInt(dataDetail.hargaSetelah)
        );
        dataDetail.hargaInt = parseInt(dataDetail.hargaInt);

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
    this.setState({ loading: true });
    console.log('loading ' + this.state.loading);
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
          tempmeja: data,
          loading: false,
        });
        console.log('loading2 ' + this.state.loading);
      })
      .catch((err) => {
        message.info(err.response.data.message);
        this.setState({
          loading: false,
        });
      });
  };

  hapusFilter = (values) => {
    this.setState({ meja: this.state.tempmeja, searchTxt: '', search: false });
  };

  onFilter = (param) => {
    console.log('TEMP MEJA = ' + param);
    if (this.state.meja !== null) {
      this.setState({
        meja: this.state.tempmeja.filter((i) => {
          return i.status == param;
        }),
      });
    } else {
      message.info('Tidak ada data transaksi!');
    }
  };

  componentDidMount() {
    if (this.state.meja === null) {
      this.getMeja();
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
        kembalian: evt - this.state.dataDetail.hargaInt,
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
      this.getDetailransaksi(val.id);
      this.setState({ modalVisible: true, idMeja: val.id });
    }
  };

  onChangeMeja = (e) => {
    // console.log(this.state.tempmeja);
    console.log('cek');
    var text = e.target.value;
    this.setState({ searchTxt: text });
    const temp = this.state.tempmeja.filter((i) => {
      return (
        i.nama_customer.toLowerCase().includes(text.toLowerCase()) ||
        i.nomor_meja.includes(e.target.value)
      );
    });
    // console.log('temp adalah ' + temp.length);
    console.log('target = ' + e.target.value);
    if (e.target.value == '') {
      // getTransaksi();
      this.setState({ search: false, meja: this.state.tempmeja });
    } else {
      // setSearch(false);
      this.setState({ search: false, meja: temp });
      // setMeja(temp);
      if (temp == 0) {
        this.setState({ search: true });
      }
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
        this.setState({
          loading: false,
        });
        this.getMeja();
      })
      .catch((err) => {
        message.error('Transaksi Gagal : ' + err.response.data.message);
        this.setState({
          loading: false,
        });
      });

    let newWin = window.open('', 'STRUK', 'resizable,scrollbars');
    myAxios
      .get(`cetakNota/${idTransaksi}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        responseType: 'blob',
      })
      .then((res) => {
        console.log(res);
        const url = window.URL.createObjectURL(res.data);
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute(
        //   'download',
        //   `STRK_${this.state.dataDetail.nomor_transaksi}.pdf`
        // ); //or any other extension
        // link.target = '_blank';
        newWin.location = url;
        // newWin.focus();
        // newWin.print();
        // newWin.close();
        // document.body.appendChild(link);
        // link.click();
        this.getMeja();
        window.location.pathname = `/showTransaksi`;
        this.setState({
          modalVisible: false,
          loading: false,
        });

        message.success('Transaksi Berhasil!');
      })
      .catch((err) => {
        this.setState({
          modalVisible: false,
          loading: false,
        });
      });
  };

  checkActionCode = async (rule, value, callback) => {
    console.log('value ' + value);
    console.log(value);
    if (value === '' || value === undefined || value === null) {
      rule.message = 'Masukan Uang!';
    } else if (value < this.state.dataDetail.hargaInt) {
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
            footer={[]}
            width={1400}>
            <Form
              ref={this.formRef}
              name='control-ref'
              onFinish={this.handleOk}>
              <Row>
                <Col xs={24} md={14}>
                  <Table
                    pagination='topLeft'
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
                        {this.state.dataDetail.total_harga},00
                      </label>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={12}>
                      <strong>
                        <label>Biaya Service 5%</label>
                      </strong>
                    </Col>
                    <Col xs={2} md={2}>
                      :
                    </Col>
                    <Col xs={10} md={10}>
                      <label style={{ color: 'grey' }}>
                        {this.state.dataDetail.service},00
                      </label>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={12}>
                      <strong>
                        <label>Biaya Pajak 10%</label>
                      </strong>
                    </Col>
                    <Col xs={2} md={2}>
                      :
                    </Col>
                    <Col xs={10} md={10}>
                      <label style={{ color: 'grey' }}>
                        {this.state.dataDetail.pajak},00
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
                        {this.state.dataDetail.hargaSetelah},00
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
                value={this.state.searchTxt}
                style={{ marginTop: '10px' }}
              />
            </Col>
          </Row>
          {this.state.search && <Empty style={{ marginTop: '35px' }} />}
          {this.state.loading && (
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
          {!this.state.loading && !this.state.meja && (
            <Empty style={{ marginTop: '35px' }} />
          )}
          {!this.state.loading && this.state.meja && (
            <Row justify='start'>
              {this.state.meja.map((val, index) => {
                return (
                  <Col
                    xs={24}
                    sm={8}
                    md={6}
                    xl={4}
                    style={{ marginTop: '20px' }}>
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
