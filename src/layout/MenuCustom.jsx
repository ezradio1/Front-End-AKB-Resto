import React, { Component } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import {
  IdcardOutlined,
  ApartmentOutlined,
  CoffeeOutlined,
  FileSyncOutlined,
  NodeIndexOutlined,
  UserOutlined,
  HistoryOutlined,
  TransactionOutlined,
  OrderedListOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import { UserContext } from '../context/UserContext';

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
      <>
        {/* <p
          style={{
            marginLeft: "15px",
            color: "#E3E5E1",
            fontWeight: "bold",
            marginBottom: "-10px",
          }}
        >
          MENU
        </p> */}
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
            <SubMenu key='sub2' icon={<ScheduleOutlined />} title='Reservasi'>
              <Menu.Item
                key='5'
                style={{ margin: '0', backgroundColor: '#1F1F1F' }}>
                <Link className='link' to='/showReservasiLangsung'>
                  Langsung
                </Link>
              </Menu.Item>
              <Menu.Item
                key='6'
                style={{ margin: '0', backgroundColor: '#1F1F1F' }}>
                <Link className='link' to='/showReservasiTakLangsung'>
                  Tidak Langsung
                </Link>
              </Menu.Item>
            </SubMenu>
          )}
          {this.state.jabatan === 'Operational Manager' && (
            <Menu.Item
              key='7'
              icon={<ApartmentOutlined />}
              style={{ margin: '0', backgroundColor: '#1F1F1F' }}>
              <Link className='link' to='/showTable'>
                Meja
              </Link>
            </Menu.Item>
          )}
          {(this.state.jabatan === 'Waiter' ||
            this.state.jabatan === 'Cashier') && (
            <Menu.Item
              key='8'
              icon={<ApartmentOutlined />}
              style={{ margin: '0', backgroundColor: '#1F1F1F' }}>
              <Link className='link' to='/showTableOnly'>
                Meja
              </Link>
            </Menu.Item>
          )}

          {this.state.jabatan === 'Operational Manager' && (
            <SubMenu
              key='sub6'
              icon={<OrderedListOutlined />}
              title='Daftar Pesanan'>
              <Menu.Item
                key='9'
                style={{ margin: '0', backgroundColor: '#1F1F1F' }}>
                <Link className='link' to='/pesananChef'>
                  Antre Masak
                </Link>
              </Menu.Item>
              <Menu.Item
                key='10'
                style={{ margin: '0', backgroundColor: '#1F1F1F' }}>
                <Link className='link' to='/PesananWaiter'>
                  Siap Antar
                </Link>
              </Menu.Item>
            </SubMenu>
          )}

          {(this.state.jabatan === 'Operational Manager' ||
            this.state.jabatan === 'Cashier') && (
            <SubMenu
              key='sub4'
              icon={<TransactionOutlined />}
              title='Transaksi'>
              <Menu.Item
                key='11'
                style={{ margin: '0', backgroundColor: '#141414' }}>
                <Link className='link' to='/showTransaksi'>
                  Pembayaran
                </Link>
              </Menu.Item>
              <Menu.Item
                key='12'
                style={{ margin: '0', backgroundColor: '#141414' }}>
                <Link className='link' to='/showRiwayatTransaksi'>
                  Riwayat Pembayaran
                </Link>
              </Menu.Item>
            </SubMenu>
          )}

          {this.state.jabatan === 'Chef' && (
            <Menu.Item
              key='13'
              icon={<OrderedListOutlined />}
              style={{ margin: '0', backgroundColor: '#1F1F1F' }}>
              <Link className='link' to='/pesananChef'>
                Daftar Pesanan
              </Link>
            </Menu.Item>
          )}

          {this.state.jabatan === 'Waiter' && (
            <Menu.Item
              key='14'
              icon={<OrderedListOutlined />}
              style={{ margin: '0', backgroundColor: '#1F1F1F' }}>
              <Link className='link' to='/pesananWaiter'>
                Daftar Pesanan
              </Link>
            </Menu.Item>
          )}

          {this.state.jabatan === 'Operational Manager' && (
            <SubMenu key='sub3' icon={<CoffeeOutlined />} title='Menu'>
              <Menu.Item
                key='15'
                style={{ margin: '0', backgroundColor: '#141414' }}>
                <Link className='link' to='/addMenu'>
                  Tambah Menu
                </Link>
              </Menu.Item>
              <Menu.Item
                key='16'
                style={{ margin: '0', backgroundColor: '#141414' }}>
                <Link className='link' to='/showMenu'>
                  Tampil Menu
                </Link>
              </Menu.Item>
            </SubMenu>
          )}
          {(this.state.jabatan === 'Operational Manager' ||
            this.state.jabatan === 'Chef') && (
            <SubMenu
              key='sub7'
              icon={<HistoryOutlined />}
              title='Riwayat Bahan'>
              <Menu.Item
                key='17'
                style={{ margin: '0', backgroundColor: '#141414' }}>
                <Link className='link' to='/riwmas'>
                  Riwayat Masuk
                </Link>
              </Menu.Item>
              <Menu.Item
                key='21'
                style={{ margin: '0', backgroundColor: '#141414' }}>
                <Link className='link' to='/riwkel'>
                  Riwayat Keluar
                </Link>
              </Menu.Item>
            </SubMenu>
          )}
          {(this.state.jabatan === 'Operational Manager' ||
            this.state.jabatan === 'Owner') && (
            <Menu.Item
              icon={<FileSyncOutlined />}
              key='18'
              style={{ margin: '0', backgroundColor: '#1F1F1F' }}>
              <Link className='link' to='/showReport'>
                Laporan
              </Link>
            </Menu.Item>
          )}
        </Menu>
      </>
    );
  }
}

export default MenuCustom;
