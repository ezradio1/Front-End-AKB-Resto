import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Input,
  Form,
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Modal,
  Select,
  DatePicker,
  Tag,
  Row,
  Col,
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
      modalEditVisible: false,
      bahan: null,
      bahanAll: null,
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

      editTemp: null,
    };
  }
  formRef = React.createRef();
  formRefMasuk = React.createRef();
  formRefKeluar = React.createRef();
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
    this.getBahan();
    this.setState({
      modalKeluarVisible: true,
      nama_bahan: '',
    });
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
      modalEditVisible: false,
      nama_bahan: '',
      jumlah: '',
      harga: '',
      tanggal: null,
      unit: '',
      suffix: null,
    });
  };

  handleCancelMasuk = () => {
    this.formRefMasuk.current.resetFields();
    this.setState({
      modalStokVisible: false,
    });
  };

  handleCancelKeluar = () => {
    this.formRefKeluar.current.resetFields();
    this.setState({
      modalKeluarVisible: false,
    });
  };

  editBahan = (modalVisible, index) => {
    console.log('id handle  = ' + index);
    let filter = this.state.bahanAll.filter((el) => {
      return el.id === index;
    });
    console.log(filter[0]);
    console.log('editBahan');
    console.log(filter[0]);
    this.setState({
      modalEditVisible: modalVisible,
      nama_bahan: filter[0].nama_bahan,
      unit: filter[0].unit,
      idEdit: index,
      loadingAct: false,
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

  getDataAll = () => {
    myAxios
      .get(`showBahan`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((res) => {
        const data = res.data.data;
        this.setState({
          bahanAll: data,
          loading: false,
        });
        console.log('Data Bahan = ');
        console.log(res.data.data);
      });

    console.log(this.state.bahan);
  };

  getBahan = () => {
    myAxios
      .get(`showBahanMakananUtama`, {
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
    if (this.state.bahan === null) {
      this.getDataAll();
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
    const bahan = this.state.bahanAll.filter((i) => {
      return i.id == evt;
    });
    console.log('onchangetak');
    console.log(evt);
    this.setState({
      nama_bahan: evt,
      suffix: bahan[0].unit,
    });
  };

  handleSubmit = (event) => {
    console.log(event);
    // event.preventDefault();
    // console.log('Id = ' + this.state.idEdit);
    // if (this.state.nama_bahan === '' || this.state.unit === '') {
    //   message.error('Masukan input yang valid!');
    // } else {
    //   if (this.state.idEdit === null) {
    //     this.setState({ loading: true });
    //     console.log('MASUK TAMBAH MENU');
    //     console.log('Handle Submit + ' + this.state.nama_bahan);
    let newObj = {
      nama_bahan: event.nama_bahan,
      jumlah: 0,
      unit: event.unit,
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
          bahanAll: [...this.state.bahanAll, data],
        });
        this.formRef.current.resetFields();
      })
      .catch((err) => {
        this.setState({ loading: false });
        message.error('Tambah Bahan Gagal : ' + err.response.data.message);
      });
    //   } else {
    //     console.log('MASUK EDIT MENU');
    //     this.setState({ loading: true });
    //     let newObj = {
    //       nama_bahan: this.state.nama_bahan,
    //       unit: this.state.unit,
    //     };
    //     myAxios
    //       .put(`editBahan/${this.state.idEdit}`, newObj, {
    //         headers: {
    //           Authorization: 'Bearer ' + localStorage.getItem('token'),
    //         },
    //       })
    //       .then((res) => {
    //         message.success(newObj.nama_bahan + ' berhasil diubah!');
    //         let data = res.data.data;
    //         const temp = this.state.bahan.filter((i) => {
    //           return i.id !== data.id;
    //         });
    //         this.setState({
    //           modalVisible: false,
    //           nama_bahan: '',
    //           unit: '',
    //           idEdit: null,
    //           loading: false,
    //         });
    //         this.getBahan();
    //       })
    //       .catch((err) => {
    //         this.setState({ loading: false });
    //         message.error('Ubah Bahan Gagal : ' + err.response.data.message);
    //       });
    //   }
    // }
  };

  handleSubmitEdit = (event) => {
    console.log(event);
    event.preventDefault();
    console.log('Id = ' + this.state.idEdit);
    if (this.state.nama_bahan === '' || this.state.unit === '') {
      message.error('Masukan input yang valid!');
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
          this.setState({
            modalEditVisible: false,
            nama_bahan: '',
            unit: '',
            idEdit: null,
            loading: false,
          });
          this.getDataAll();
        })
        .catch((err) => {
          this.setState({ loading: false });
          message.error('Ubah Bahan Gagal : ' + err);
        });
    }
  };

  handleSubmitStok = (event) => {
    console.log(event);
    let newObj = {
      tanggal: Moment(event.tanggal).format('YYYY-MM-DD'),
      jumlah: event.jumlah,
      harga: event.harga,
      id_bahan: event.id_bahan,
    };
    this.setState({ loading: true });
    console.log(newObj);
    myAxios
      .post(`riwayatBahanMasuk`, newObj, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((res) => {
        const temp = this.state.bahanAll.filter((i) => {
          return i.id === event.id_bahan;
        });

        message.success(temp[0].nama_bahan + ' berhasil tambah stok!');
        this.setState({
          modalStokVisible: false,
          loading: false,
        });
        this.formRefMasuk.current.resetFields();
        this.getDataAll();
      })
      .catch((err) => {
        this.setState({
          loading: false,
        });
        message.error('Tambah Stok Bahan Gagal : ' + err.response.data.message);
      });
  };

  handleSubmitKeluar = (event) => {
    this.setState({
      loading: true,
    });
    let newObj = {
      tanggal: Moment(event.tanggal).format('YYYY-MM-DD'),
      jumlah: event.jumlah,
      id_bahan: event.id_bahan,
      status: 'Buang',
    };
    console.log(newObj);
    myAxios
      .post(`riwayatBahanKeluar`, newObj, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((res) => {
        const temp = this.state.bahanAll.filter((i) => {
          return i.id === event.id_bahan;
        });
        message.success(temp[0].nama_bahan + ' berhasil dibuang!');
        this.setState({
          modalKeluarVisible: false,
          loading: false,
        });
        this.formRefKeluar.current.resetFields();
        this.getDataAll();
      })
      .catch((err) => {
        this.setState({
          loading: false,
        });
        message.error('Buang Bahan Gagal : ' + err.response.data.message);
      });
  };

  checkActionCode = async (rule, value, callback) => {
    console.log('value ac ' + value);
    console.log(value);
    let filter = this.state.bahan.filter((el) => {
      return el.id == this.state.nama_bahan;
    });
    console.log(this.state.nama_bahan);
    if (this.state.nama_bahan !== '') {
      if (value <= 0 || value === '' || value === undefined) {
        rule.message = 'Jumlah wajib diisi!';
        this.formRefKeluar.current.setFields({
          jumlah: {
            value: value,
            errors: [new Error('forbid ha')],
          },
        });
      } else if (Number(filter[0].jumlah) < value) {
        rule.message = 'Jumlah buang tidak boleh melebihi jumlah sekarang!';
        this.formRefKeluarm.current.setFields({
          jumlah: {
            value: value,
            errors: [new Error('forbid ha')],
          },
        });
      }
    } else {
      await callback();
    }
  };

  checkActionCodeHarga = async (rule, value, callback) => {
    console.log('value ' + value);
    console.log(value);
    if (value < 0 || value === undefined || value === '' || value === null) {
      rule.message = 'Harga tidak boleh kurang dari 0!';
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

  checkActionCodeJmlMasuk = async (rule, value, callback) => {
    console.log('value ' + value);
    console.log(value);
    if (value < 0 || value === undefined || value === '' || value === null) {
      rule.message = 'Jumlah tidak boleh kurang dari 0!';
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

  render() {
    let { filteredInfo } = this.state;
    // sortedInfo = sortedInfo || {};
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
        onFilter: (value, record) => record.jumlah === value,
        sorter: (a, b) => a.jumlah - b.jumlah,
        ellipsis: true,
        render: (jumlah) => (
          <>
            <Tag color={jumlah === 0 ? '#A90603' : '#00664B'}>{jumlah}</Tag>
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
          <Form
            ref={this.formRef}
            name='control-ref'
            onFinish={this.handleSubmit}>
            <label>Nama Bahan</label>
            <Form.Item
              name='nama_bahan'
              initialValue=''
              rules={[
                {
                  required: true,
                  message: 'Nama bahan wajib diisi',
                },
              ]}>
              <Input placeholder='Masukan nama bahan' />
            </Form.Item>
            <label>Unit</label>
            <Form.Item
              name='unit'
              initialValue=''
              rules={[
                {
                  required: true,
                  message: 'Unit wajib diisi',
                },
              ]}>
              <Input placeholder='Masukan unit' />
            </Form.Item>

            <Form.Item>
              <Button
                loading={this.state.loading}
                htmlType='submit'
                type='primary'
                style={{
                  marginTop: '20px',
                  width: '100%',
                }}>
                {this.state.buttonModal}
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          style={{ fontFamily: 'poppins' }}
          visible={this.state.modalEditVisible}
          title='Edit Data Bahan'
          onCancel={this.handleCancel}
          footer={[]}>
          <form onSubmit={this.handleSubmitEdit}>
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
                Edit Bahan
              </button>
            </Button>
          </form>
        </Modal>

        <Modal
          style={{ fontFamily: 'poppins' }}
          visible={this.state.modalStokVisible}
          title='Tambah Bahan Masuk'
          onCancel={this.handleCancelMasuk}
          footer={[]}>
          <Form
            ref={this.formRefMasuk}
            name='control-ref'
            onFinish={this.handleSubmitStok}>
            <label>Nama Bahan</label>
            {this.state.bahanAll !== null && (
              <Form.Item
                name='id_bahan'
                rules={[
                  {
                    required: true,
                    message: 'Nama bahan wajib diisi',
                  },
                ]}>
                <Select
                  placeholder='Masukan nama bahan'
                  style={{ width: '100%' }}
                  onChange={this.onChangeTak}
                  // value={this.state.nama_bahan}
                >
                  {this.state.bahanAll.map((val, item) => (
                    <Select.Option key={val.id} value={val.id}>
                      {val.nama_bahan}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            <label>Tanggal Masuk</label>
            <Form.Item
              name='tanggal'
              rules={[
                {
                  required: true,
                  message: 'Tanggal masuk wajib diisi',
                },
              ]}>
              <DatePicker
                // name='tanggal'
                // onChange={this.handleChangeInputTanggal}
                placeholder='Masukan Tanggal Masuk'
                format='YYYY / MM / DD'
                disabledDate={(current) => {
                  return current > moment();
                }}
              />
            </Form.Item>

            <label>Jumlah Masuk</label>
            <Form.Item
              name='jumlah'
              rules={[
                {
                  required: true,
                  validator: this.checkActionCodeJmlMasuk,
                },
              ]}>
              <Input
                type='number'
                suffix={this.state.suffix}
                placeholder='Masukan jumlah'
                min='0'
                // name='jumlah'
                // value={this.state.jumlah}
                // onChange={this.handleChangeInput}
                autoComplete='off'
              />
            </Form.Item>
            <label>Harga</label>
            <Form.Item
              name='harga'
              rules={[
                {
                  required: true,
                  validator: this.checkActionCodeHarga,
                },
              ]}>
              <Input
                type='number'
                prefix='Rp. '
                placeholder='Masukan harga'
                // name='harga'
                // value={this.state.harga}
                // onChange={this.handleChangeInput}
                autoComplete='off'
              />
            </Form.Item>
            <Form.Item>
              <Button
                loading={this.state.loading}
                type='primary'
                htmlType='submit'
                style={{
                  marginTop: '20px',
                  width: '100%',
                }}>
                Tambah Stok Bahan
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          style={{ fontFamily: 'poppins' }}
          visible={this.state.modalKeluarVisible}
          title='Buang Stok Bahan'
          onCancel={this.handleCancelKeluar}
          footer={[]}>
          <Form
            ref={this.formRefKeluar}
            name='control-ref'
            onFinish={this.handleSubmitKeluar}>
            <label>Nama Bahan</label>
            {this.state.bahan !== null && (
              <Form.Item
                name='id_bahan'
                rules={[
                  {
                    required: true,
                    message: 'Nama bahan wajib diisi',
                  },
                ]}>
                <Select
                  placeholder='Masukan nama bahan'
                  style={{ width: '100%' }}
                  onChange={this.onChangeTak}>
                  {this.state.bahan.map((val, item) => (
                    <Select.Option key={val.nama_bahan} value={val.id}>
                      {val.nama_bahan}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            <label>Tanggal Buang</label>
            <Form.Item
              name='tanggal'
              rules={[
                {
                  required: true,
                  message: 'Tanggal buang wajib diisi',
                },
              ]}>
              <DatePicker
                placeholder='Masukan tanggal buang'
                format='YYYY / MM / DD'
                // name='tanggal'
                // onChange={this.handleChangeInputTanggal}
                disabledDate={(current) => {
                  return current > moment();
                }}
              />
            </Form.Item>

            <label>Jumlah Buang</label>
            <Form.Item
              name='jumlah'
              rules={[
                {
                  required: true,
                  validator: this.checkActionCode,
                },
              ]}>
              <Input
                type='number'
                placeholder='Masukan jumlah buang'
                suffix={this.state.suffix}
                // name='jumlah'
                // value={this.state.jumlah}
                // onChange={this.handleChangeInput}
                autoComplete='off'
              />
            </Form.Item>
            <Form.Item>
              <Button
                loading={this.state.loading}
                type='primary'
                htmlType='submit'
                style={{
                  marginTop: '20px',
                  width: '100%',
                }}>
                Buang Stok Bahan
              </Button>
            </Form.Item>
          </Form>
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
          <Row>
            <Col>
              <Button
                type='primary'
                style={{ width: 'auto', borderRadius: '7px' }}
                onClick={this.clearFilters}>
                Hapus Filter
              </Button>
            </Col>
            <Col>
              <Button
                style={{ width: 'auto', borderRadius: '7px' }}
                type='primary'
                onClick={this.openModal}>
                Tambah Data Bahan
              </Button>
            </Col>
            <Col>
              <Button
                style={{ width: 'auto', borderRadius: '7px' }}
                type='primary'
                onClick={this.openModalStok}>
                Tambah Bahan Masuk
              </Button>
            </Col>
            <Col>
              <Button
                style={{ width: 'auto', borderRadius: '7px' }}
                type='primary'
                onClick={this.openModalKeluar}>
                Buang Stok Bahan
              </Button>
            </Col>
          </Row>
        </Space>
        <Table
          loading={this.state.loading}
          loadingIndicator={antIcon}
          scroll={{ x: 900, y: 1000 }}
          columns={columns}
          dataSource={this.state.bahanAll}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default ShowBahan;
