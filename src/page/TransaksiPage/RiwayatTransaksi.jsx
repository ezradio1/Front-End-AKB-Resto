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
} from 'antd';

import {
  SearchOutlined,
  LoadingOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import Moment from 'moment';
import { UserContext } from '../../context/UserContext';
import myAxios from '../../myAxios';

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

      nama_customer: '',
      telepon: '',
      email: '',
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

  componentDidMount() {
    this.setState({ loading: true });
    if (this.state.transaksi === null) {
      this.getTransaksi();
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
    let { filteredInfo } = this.state;
    // sortedInfo = sortedInfo || {};
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
        onFilter: (value, record) => record.nomor_meja === value,
        filteredValue: filteredInfo.nomor_meja || null,
        sorter: (a, b) => a.nomor_meja.length - b.nomor_meja.length,
        ellipsis: true,
      },
      {
        title: 'Nama Kasir',
        dataIndex: 'nama_karyawan',
        key: 'nama_karyawan',
        ...this.getColumnSearchProps('nama_karyawan'),
        filteredValue: filteredInfo.nama_karyawan || null,
        sorter: (a, b) => a.nama_karyawan.length - b.nama_karyawan.length,
        ellipsis: true,
      },
      {
        title: 'Total',
        dataIndex: 'total_harga',
        key: 'total_harga',
        onFilter: (value, record) => record.total_harga === value,
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
            style={{ top: 25 }}
            visible={this.state.modalVisible}
            title={this.state.judulModal}
            onCancel={this.handleCancel}
            footer={[]}
            width={1400}>
            <Row>
              <Col md={14} xs={24}>
                <Table
                  pagination='topLeft'
                  loading={this.state.loading}
                  loadingIndicator={antIcon}
                  scroll={{ x: 400, y: 400 }}
                  columns={columnsDetail}
                  dataSource={this.state.detail}
                  onChange={this.handleChange}
                />
              </Col>
              <Col md={1}></Col>
              <Col md={9} xs={24}>
                <Row>
                  <Col md={24}>
                    <strong>
                      <h1 style={{ fontSize: '50', margin: 0 }}>KETERANGAN </h1>
                    </strong>
                  </Col>
                </Row>
                <hr style={{ margin: '7px auto', width: '100%' }} />
                <Row>
                  <Col md={12} xs={11}>
                    <strong>
                      <label>Nomor Transaksi</label>
                    </strong>
                  </Col>
                  <Col md={2} xs={2}>
                    {' '}
                    :{' '}
                  </Col>
                  <Col md={10} xs={10}>
                    <label style={{ color: 'grey' }}>
                      {this.state.dataDetail.nomor_transaksi}
                    </label>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} xs={11}>
                    <strong>
                      <label>Tanggal Transaksi</label>
                    </strong>
                  </Col>
                  <Col md={2} xs={2}>
                    {' '}
                    :{' '}
                  </Col>
                  <Col md={10} xs={10}>
                    <label style={{ color: 'grey' }}>
                      {Moment(this.state.dataDetail.tanggal_transaksi).format(
                        'DD MMMM YYYY'
                      )}
                    </label>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} xs={11}>
                    <strong>
                      <label>Nama Pelanggan</label>
                    </strong>
                  </Col>
                  <Col md={2} xs={2}>
                    {' '}
                    :{' '}
                  </Col>
                  <Col md={10} xs={10}>
                    <label style={{ color: 'grey' }}>
                      {this.state.dataDetail.nama_customer}
                    </label>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} xs={11}>
                    <strong>
                      <label>Nomor Meja</label>
                    </strong>
                  </Col>
                  <Col md={2} xs={2}>
                    {' '}
                    :{' '}
                  </Col>
                  <Col md={10} xs={10}>
                    <label style={{ color: 'grey' }}>
                      {this.state.dataDetail.nomor_meja}
                    </label>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} xs={11}>
                    <strong>
                      <label>Metode Pembayaran </label>
                    </strong>
                  </Col>
                  <Col md={2} xs={2}>
                    {' '}
                    :{' '}
                  </Col>
                  <Col md={10} xs={10}>
                    <label style={{ color: 'grey' }}>
                      {this.state.dataDetail.metode_pembayaran}
                    </label>
                  </Col>
                </Row>
                {this.state.dataDetail.metode_pembayaran === 'Non-Tunai' && (
                  <>
                    <Row>
                      <Col md={12} xs={11}>
                        <strong>
                          <label>Kode Verifikasi</label>
                        </strong>
                      </Col>
                      <Col md={2} xs={2}>
                        {' '}
                        :{' '}
                      </Col>
                      <Col md={10} xs={10}>
                        <label style={{ color: 'grey' }}>
                          {this.state.dataDetail.kode_verifikasi}
                        </label>
                      </Col>
                    </Row>
                    {this.state.dataDetail.nama_pemilik && (
                      <Row>
                        <Col md={12} xs={11}>
                          <strong>
                            <label>Nama Pemilik</label>
                          </strong>
                        </Col>
                        <Col md={2} xs={2}>
                          {' '}
                          :{' '}
                        </Col>
                        <Col md={10} xs={10}>
                          <label style={{ color: 'grey' }}>
                            {this.state.dataDetail.nama_pemilik}
                          </label>
                        </Col>
                      </Row>
                    )}
                    <Row>
                      <Col md={12} xs={11}>
                        <strong>
                          <label>Jenis Kartu</label>
                        </strong>
                      </Col>
                      <Col md={2} xs={2}>
                        {' '}
                        :{' '}
                      </Col>
                      <Col md={10} xs={10}>
                        <label style={{ color: 'grey' }}>
                          {this.state.dataDetail.jenis_kartu}
                        </label>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12} xs={11}>
                        <strong>
                          <label>Tanggal Kadaluwarsa</label>
                        </strong>
                      </Col>
                      <Col md={2} xs={2}>
                        {' '}
                        :{' '}
                      </Col>
                      <Col md={10} xs={10}>
                        <label style={{ color: 'grey' }}>
                          {Moment(
                            this.state.dataDetail.tanggal_kadaluwarsa
                          ).format('DD MMMM YYYY')}
                        </label>
                      </Col>
                    </Row>
                  </>
                )}
                <hr style={{ margin: '7px auto' }} />
                <Row>
                  <Col md={12} xs={11}>
                    <strong>
                      <label>Total Harga</label>
                    </strong>
                  </Col>
                  <Col md={2} xs={2}>
                    :
                  </Col>
                  <Col md={10} xs={11}>
                    <label style={{ color: 'grey' }}>
                      Rp. {this.state.dataDetail.total_harga},00
                    </label>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} xs={11}>
                    <strong>
                      <label>Biaya Layanan</label>
                    </strong>
                  </Col>
                  <Col md={2} xs={2}>
                    :
                  </Col>
                  <Col md={10} xs={10}>
                    <label style={{ color: 'grey' }}>
                      Rp. {this.state.dataDetail.service},00
                    </label>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} xs={11}>
                    <strong>
                      <label>Biaya Pajak</label>
                    </strong>
                  </Col>
                  <Col md={2} xs={2}>
                    :
                  </Col>
                  <Col md={10} xs={10}>
                    <label style={{ color: 'grey' }}>
                      Rp. {this.state.dataDetail.pajak},00
                    </label>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} xs={11}>
                    <strong>
                      <label>Harga Total</label>
                    </strong>
                  </Col>
                  <Col md={2} xs={2}>
                    :
                  </Col>
                  <Col md={10} xs={11}>
                    <label style={{ color: 'grey' }}>
                      Rp. {this.state.dataDetail.hargaSetelah},00
                    </label>
                  </Col>
                </Row>
                <hr style={{ margin: '7px auto' }} />
              </Col>
            </Row>
          </Modal>
        )}

        <h1
          style={{
            fontSize: 'x-large',
            color: '#001529',
            textTransform: 'uppercase',
          }}>
          <strong>riwayat transaksi</strong>
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
          dataSource={this.state.transaksi}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default Transaksi;
