import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Input,
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Modal,
  Form,
  Spin,
} from 'antd';

import {
  SearchOutlined,
  DeleteTwoTone,
  EditTwoTone,
  LoadingOutlined,
} from '@ant-design/icons';
import { UserContext } from '../../context/UserContext';
import myAxios from '../../myAxios';

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const tableLoading = {
  indicator: <Spin indicator={antIcon} />,
};

class ShowCustomer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalVisibleAdd: false,
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

      loadingAct: false,
    };
  }
  formRef = React.createRef();
  static contextType = UserContext;

  openModal = () => {
    this.setState({
      modalVisibleAdd: true,
      nama_bahan: '',
      unit: '',
    });
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
      modalVisibleAdd: false,
      nama_customer: '',
      telepon: '',
      email: '',
    });
  };
  handleCancelAdd = () => {
    this.setState({
      modalVisibleAdd: false,
    });

    this.formRef.current.resetFields();
  };

  editPelanggan = (modalVisible, index) => {
    console.log('id handle  = ' + index);
    this.setState({
      nama_customer: '',
      telepon: '',
      email: '',
      idEdit: index,
      loadingAct: true,
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
          loadingAct: false,
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
    this.setState({
      loading: tableLoading,
    });
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
    this.setState({ loadingAct: true });
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
        this.setState({ customer: filter, loadingAct: false });
        console.log(res);
        message.success(res.data.data.nama_customer + ' berhasil dihapus!');
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
    } else if (!validateEmail(this.state.email)) {
      message.error('Email Tidak Valid!');
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
  handleSubmitAdd = (event) => {
    this.setState({ loading: true });
    console.log('MASUK TAMBAH MENU');
    let newObj = {
      nama_customer: event.nama_customer,
      email: event.email,
      telepon: '0' + event.telepon,
    };
    console.log('newObj');
    console.log(newObj);
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
          modalVisibleAdd: false,
          loading: false,
          customer: [...this.state.customer, data],
        });
      })
      .catch((err) => {
        message.error('Tambah Pelanggan Gagal : ' + err.response.data.message);
        this.setState({
          loading: false,
        });
      });
  };

  checkActionCode = async (rule, value, callback) => {
    console.log('value ' + value);
    console.log(value);
    if (value === '' || value === undefined) {
      rule.message = 'Nomor Telepon Wajib diisi!';
      this.formRef.setFields({
        telepon: {
          value: value,
          errors: [new Error('forbid ha')],
        },
      });
    } else if (value[0] == 0 || value[0] != 8) {
      rule.message = 'Nomor Telepon Harus diawali dengan 8!';
      this.formRef.setFields({
        telepon: {
          value: value,
          errors: [new Error('forbid ha')],
        },
      });
    } else if (value.length < 10) {
      rule.message = 'Nomor Telepon Harus lebih dari 10!';
      this.formRef.setFields({
        telepon: {
          value: value,
          errors: [new Error('forbid ha')],
        },
      });
    } else if (value.length > 14) {
      rule.message = 'Nomor Telepon Harus kurang dari 14!';
      this.formRef.setFields({
        telepon: {
          value: value,
          errors: [new Error('forbid ha')],
        },
      });
    } else {
      await callback();
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
        ...this.getColumnSearchProps('telepon'),
        filteredValue: filteredInfo.telepon || null,
        sorter: (a, b) => a.telepon.length - b.telepon.length,
        ellipsis: true,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        ...this.getColumnSearchProps('email'),
        filteredValue: filteredInfo.email || null,
        sorter: (a, b) => a.email.length - b.email.length,
        ellipsis: true,
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
                  onClick={() => this.editPelanggan(true, dataIndex)}
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
          visible={this.state.modalVisibleAdd}
          title='Tambah Data Pelanggan'
          onCancel={this.handleCancelAdd}
          footer={[]}>
          <Form
            ref={this.formRef}
            name='control-ref'
            onFinish={this.handleSubmitAdd}>
            <label>Nama Pelanggan</label>
            <Form.Item
              name='nama_customer'
              initialValue=''
              rules={[
                {
                  required: true,
                  message: 'Nama pelanggan wajib diisi',
                },
              ]}>
              <Input placeholder='Masukan nama pelanggan' />
            </Form.Item>
            <label>Telepon</label>
            <Form.Item
              name='telepon'
              initialValue=''
              rules={[
                {
                  required: true,
                  validator: this.checkActionCode,
                },
              ]}>
              <Input
                type='number'
                addonBefore='+62'
                placeholder='Telepon'
                autoComplete='off'
              />
            </Form.Item>
            <label>Email</label>
            <Form.Item
              name='email'
              initialValue=''
              rules={[
                {
                  required: true,
                  message: 'Email wajib diisi',
                  type: 'email',
                },
              ]}>
              <Input placeholder='Email' name='email' autoComplete='off' />
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
                Tambah Pelanggan
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          style={{ fontFamily: 'poppins' }}
          visible={this.state.modalVisible}
          title={this.state.judulModal}
          onCancel={this.handleCancel}
          footer={[]}>
          <form onSubmit={this.handleSubmit}>
            <label>Nama Pelanggan</label>
            <Input
              placeholder='Nama Customer'
              name='nama_customer'
              value={this.state.nama_customer}
              onChange={this.handleChangeInput}
              autoComplete='off'
            />
            <label style={{ marginTop: '15px' }}>Telepon</label>
            <Input
              type='number'
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
