import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import {
  IdcardOutlined,
  ApartmentOutlined,
  CoffeeOutlined,
  FileSyncOutlined,
  NodeIndexOutlined,
  UserOutlined,
  HistoryOutlined,
  ContainerOutlined,
  OrderedListOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import { UserContext } from '../context/UserContext';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

class MenuCustom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jabatan: null,
    };
  }
  static contextType = UserContext;

  componentDidMount() {
    const user = this.context[0];
    this.setState({
      jabatan: user.jabatan,
    });
    console.log('MenuCustom : ');
    console.log(user);
  }

  render() {
    return (
      <Menu
        theme='dark'
        mode='inline'
        defaultSelectedKeys={['1']}
        style={{ backgroundColor: '#1F1F1F' }}>
        {(this.state.jabatan === 'Owner' ||
          this.state.jabatan === 'Operational Manager') && (
          <SubMenu key='sub1' icon={<IdcardOutlined />} title='Karyawan'>
            <Menu.Item
              key='1'
              style={{ margin: '0', backgroundColor: '#141414' }}>
              <Link className='link' to='/addEmployee'>
                Tambah Karyawan
              </Link>
            </Menu.Item>
            <Menu.Item
              key='2'
              style={{ margin: '0', backgroundColor: '#141414' }}>
              <Link className='link' to='/showEmployee'>
                Tampil Karyawan
              </Link>
            </Menu.Item>
          </SubMenu>
        )}

        {(this.state.jabatan === 'Operational Manager' ||
          this.state.jabatan === 'Waiter' ||
          this.state.jabatan === 'Cashier') && (
          <Menu.Item
            key='3'
            icon={<UserOutlined />}
            style={{ margin: '0', backgroundColor: '#1F1F1F' }}>
            <Link className='link' to='/showCustomer'>
              Pelanggan
            </Link>
          </Menu.Item>
        )}
        {(this.state.jabatan === 'Operational Manager' ||
          this.state.jabatan === 'Chef') && (
          <Menu.Item
            icon={<NodeIndexOutlined />}
            key='4'
            style={{ margin: '0', backgroundColor: '#1F1F1F' }}>
            <Link className='link' to='/showBahan'>
              Bahan
            </Link>
          </Menu.Item>
        )}

        {(this.state.jabatan === 'Operational Manager' ||
          this.state.jabatan === 'Waiter' ||
          this.state.jabatan === 'Cashier') && (
          <Menu.Item
            icon={<ScheduleOutlined />}
            key='5'
            style={{ margin: '0', backgroundColor: '#1F1F1F' }}>
            <Link className='link' to='/showReservasi'>
              Reservasi
            </Link>
          </Menu.Item>
        )}
        {this.state.jabatan === 'Operational Manager' && (
          <Menu.Item
            key='6'
            icon={<ApartmentOutlined />}
            style={{ margin: '0', backgroundColor: '#1F1F1F' }}>
            <Link className='link' to='/showTable'>
              Meja
            </Link>
          </Menu.Item>
        )}

        {(this.state.jabatan === 'Waiter' || this.state.jabatan === 'Chef') && (
          <Menu.Item
            key='7'
            icon={<OrderedListOutlined />}
            style={{ margin: '0', backgroundColor: '#1F1F1F' }}>
            <Link className='link' to='/showTable'>
              Daftar Pesanan
            </Link>
          </Menu.Item>
        )}

        {(this.state.jabatan === 'Operational Manager' ||
          this.state.jabatan === 'Cashier') && (
          <Menu.Item
            key='8'
            icon={<ContainerOutlined />}
            style={{ margin: '0', backgroundColor: '#1F1F1F' }}>
            <Link className='link' to='/showTable'>
              Transaksi
            </Link>
          </Menu.Item>
        )}

        {this.state.jabatan === 'Operational Manager' && (
          <SubMenu key='sub2' icon={<CoffeeOutlined />} title='Menu'>
            <Menu.Item
              key='9'
              style={{ margin: '0', backgroundColor: '#141414' }}>
              <Link className='link' to='/addMenu'>
                Tambah Menu
              </Link>
            </Menu.Item>
            <Menu.Item
              key='10'
              style={{ margin: '0', backgroundColor: '#141414' }}>
              <Link className='link' to='/showMenu'>
                Tampil Menu
              </Link>
            </Menu.Item>
          </SubMenu>
        )}
        {(this.state.jabatan === 'Operational Manager' ||
          this.state.jabatan === 'Chef') && (
          <SubMenu key='sub3' icon={<HistoryOutlined />} title='Riwayat Bahan'>
            <Menu.Item
              key='11'
              style={{ margin: '0', backgroundColor: '#141414' }}>
              <Link className='link' to='/riwmas'>
                Riwayat Masuk
              </Link>
            </Menu.Item>
            <Menu.Item
              key='12'
              style={{ margin: '0', backgroundColor: '#141414' }}>
              <Link className='link' to='/riwkel'>
                Riwayat Keluar
              </Link>
            </Menu.Item>
          </SubMenu>
        )}
        {(this.state.jabatan === 'Operational Manager' ||
          this.state.jabatan === 'Owner') && (
          <SubMenu key='sub4' icon={<FileSyncOutlined />} title='Laporan'>
            <Menu.Item
              key='13'
              style={{ margin: '0', backgroundColor: '#141414' }}>
              <Link className='link' to='/showStockReport'>
                Stok
              </Link>
            </Menu.Item>
            <Menu.Item
              key='14'
              style={{ margin: '0', backgroundColor: '#141414' }}>
              <Link className='link' to='/showSaleReport'>
                Penjualan
              </Link>
            </Menu.Item>
            <Menu.Item
              key='15'
              style={{ margin: '0', backgroundColor: '#141414' }}>
              <Link className='link' to='/showIncomeReport'>
                Pendapatan
              </Link>
            </Menu.Item>
            <Menu.Item
              key='16'
              style={{ margin: '0', backgroundColor: '#141414' }}>
              <Link className='link' to='/showSpendingReport'>
                Pengeluaran
              </Link>
            </Menu.Item>
          </SubMenu>
        )}
      </Menu>
    );
  }
}

export default MenuCustom;
