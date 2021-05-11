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
  Tag,
  Spin,
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

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const tableLoading = {
  indicator: <Spin indicator={antIcon} />,
};

class ShowBahan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalStokVisible: false,
      modalVisible: false,
      bahan: null,
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

  handleChangeInputTanggal = (evt) => {
    const tanggal = evt._d;
    console.log(tanggal);
    this.setState({
      tanggal: Moment(tanggal).format('YYYY-MM-DD'),
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
      loadingAct: true,
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
          loadingAct: false,
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

  getBahan = () => {
    myAxios
      .get(`showBahan`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((res) => {
        const data = res.data.data;
        this.setState({
          bahan: data,
          loading: false,
        });
        console.log('Data Bahan = ');
        console.log(res.data.data);
      });

    console.log(this.state.bahan);
  };

  componentDidMount() {
    this.setState({ loading: tableLoading });
    const user = this.context;
    if (this.state.bahan === null) {
      this.getBahan();
    }
  }

  DeleteItem(param) {
    const mytoken = localStorage.getItem('token');
    console.log('Delete Item ' + param + mytoken);
    this.setState({ loadingAct: true });
    let newObj = {};
    myAxios
      .put(`deleteBahan/${param}`, newObj, {
        headers: {
          Authorization: 'Bearer ' + mytoken,
        },
      })
      .then((res) => {
        let filter = this.state.bahan.filter((el) => {
          return el.id !== param;
        });
        this.setState({ bahan: filter, loadingAct: false });
        console.log(res);
        message.success(res.data.data.nama_bahan + ' berhasil dihapus!');
      })
      .catch((err) => {
        this.setState({ loadingAct: false });
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
            this.setState({ loading: false });
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
            this.getBahan();
          })
          .catch((err) => {
            this.setState({ loading: false });
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
          this.getBahan();
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
        title: 'Nama Bahan',
        dataIndex: 'nama_bahan',
        key: 'nama_bahan',
        ...this.getColumnSearchProps('nama_bahan'),
        filteredValue: filteredInfo.nama_bahan || null,
        sorter: (a, b) => a.nama_bahan.length - b.nama_bahan.length,
        ellipsis: true,
      },
      {
        title: 'Jumlah Stok',
        dataIndex: 'jumlah',
        key: 'jumlah',
        filters: [{ text: 'Bahan Habis', value: 0 }],
        filteredValue: filteredInfo.jumlah || null,
        onFilter: (value, record) => record.jumlah == value,
        sorter: (a, b) => a.jumlah - b.jumlah,
        ellipsis: true,
        render: (jumlah) => (
          <>
            <Tag color={jumlah == 0 ? '#A90603' : '#00664B'}>{jumlah}</Tag>
          </>
        ),
      },
      {
        title: 'Unit',
        dataIndex: 'unit',
        key: 'unit',
        filters: [
          { text: 'Gram', value: 'gram' },
          { text: 'Mililiter', value: 'ml' },
          { text: 'Botol', value: 'botol' },
        ],
        filteredValue: filteredInfo.unit || null,
        onFilter: (value, record) => record.unit.includes(value),
        sorter: (a, b) => a.unit.length - b.unit.length,
      },
      {
        align: 'center',
        dataIndex: 'id',
        key: 'id',

        render: (dataIndex) => (
          <>
            {!this.state.loadingAct && (
              <div>
                <EditTwoTone
                  twoToneColor='blue'
                  style={{ marginRight: '5px' }}
                  onClick={() => this.editBahan(true, dataIndex)}
                />
                <Popconfirm
                  placement='left'
                  title={'Apakah anda yakin ingin menghapus ?'}
                  onConfirm={() => this.DeleteItem(dataIndex)}
                  okText='Yes'
                  cancelText='No'>
                  <DeleteTwoTone twoToneColor='red' />
                </Popconfirm>
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
          style={{ fontFamily: 'poppins' }}
          visible={this.state.modalVisible}
          title={this.state.judulModal}
          onCancel={this.handleCancel}
          footer={[]}>
          <form onSubmit={this.handleSubmit}>
            <label>Nama Bahan</label>
            <Input
              placeholder='Nama Bahan'
              name='nama_bahan'
              value={this.state.nama_bahan}
              onChange={this.handleChangeInput}
              autoComplete='off'
            />
            <label style={{ marginTop: '15px' }}>Unit Bahan</label>
            <Input
              placeholder='Unit'
              name='unit'
              value={this.state.unit}
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

        <Modal
          visible={this.state.modalStokVisible}
          title='Tambah Bahan Masuk'
          onCancel={this.handleCancel}
          footer={[]}>
          <form onSubmit={this.handleSubmitStok}>
            <label>Nama Bahan</label>
            {this.state.bahan !== null && (
              <Select
                style={{ width: '100%' }}
                onChange={this.onChangeTak}
                value={this.state.nama_bahan}>
                {this.state.bahan.map((val, item) => (
                  <Select.Option key={val.nama_bahan} value={val.nama_bahan}>
                    {val.nama_bahan}
                  </Select.Option>
                ))}
              </Select>
            )}

            <label style={{ marginTop: '15px' }}>Tanggal Masuk</label>
            <DatePicker
              name='tanggal'
              onChange={this.handleChangeInputTanggal}
              placeholder='Masukan Tanggal Masuk'
              format='YYYY / MM / DD'
              disabledDate={(current) => {
                return current > moment();
              }}
            />

            <label style={{ marginTop: '15px' }}>Jumlah Masuk</label>

            <Input
              type='number'
              suffix={this.state.suffix}
              name='jumlah'
              value={this.state.jumlah}
              onChange={this.handleChangeInput}
              autoComplete='off'
            />
            <label style={{ marginTop: '15px' }}>Harga</label>
            <Input
              type='number'
              prefix='Rp. '
              name='harga'
              value={this.state.harga}
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
                Tambah Stok Bahan
              </button>
            </Button>
          </form>
        </Modal>

        <Modal
          visible={this.state.modalKeluarVisible}
          title='Buang Stok Bahan'
          onCancel={this.handleCancel}
          footer={[]}>
          <form onSubmit={this.handleSubmitKeluar}>
            <label>Nama Bahan</label>
            {this.state.bahan !== null && (
              <Select style={{ width: '100%' }} onChange={this.onChangeTak}>
                {this.state.bahan.map((val, item) => (
                  <Select.Option key={val.nama_bahan} value={val.nama_bahan}>
                    {val.nama_bahan}
                  </Select.Option>
                ))}
              </Select>
            )}

            <label style={{ marginTop: '15px' }}>Tanggal Buang</label>
            <DatePicker
              name='tanggal'
              onChange={this.handleChangeInputTanggal}
              placeholder='Masukan Tanggal Buang'
              format='YYYY / MM / DD'
              disabledDate={(current) => {
                return current > moment();
              }}
            />

            <label style={{ marginTop: '15px' }}>Jumlah Buang</label>

            <Input
              type='number'
              suffix={this.state.suffix}
              name='jumlah'
              value={this.state.jumlah}
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
                Buang Stok Bahan
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
          <strong>data bahan</strong>
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
            Tambah Data Bahan
          </Button>
          <Button
            style={{ width: 'auto', borderRadius: '7px' }}
            type='primary'
            onClick={this.openModalStok}>
            Tambah Bahan Masuk
          </Button>
          <Button
            style={{ width: 'auto', borderRadius: '7px' }}
            type='primary'
            onClick={this.openModalKeluar}>
            Buang Stok Bahan
          </Button>
        </Space>
        <Table
          loading={this.state.loading}
          loadingIndicator={antIcon}
          scroll={{ x: 900, y: 1000 }}
          columns={columns}
          dataSource={this.state.bahan}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default ShowBahan;
