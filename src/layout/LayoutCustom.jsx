import React, { useState, useContext, useEffect } from 'react';
import {
  Layout,
  Menu,
  Button,
  Drawer,
  Dropdown,
  message,
  Row,
  Col,
} from 'antd';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import myAxios from '../myAxios';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  IdcardOutlined,
  ApartmentOutlined,
  CoffeeOutlined,
  FileSyncOutlined,
  PoweroffOutlined,
  CaretDownOutlined,
  UserOutlined,
  MenuOutlined,
  NodeIndexOutlined,
  HistoryOutlined,
  TransactionOutlined,
  OrderedListOutlined,
  ScheduleOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';

import MenuCustom from './MenuCustom';
import ContentCustom from './ContentCustom';
import FooterCustom from './FooterCustom';

import { UserContext } from '../context/UserContext';
import LogoAkb from '../asset/logo/logo-col.png';
import LogoAkbFull from '../asset/logo/logo-nav-1.png';
import Profile from '../asset/icon/profile.png';
import './Layout.css';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

const LayoutCustom = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useContext(UserContext);
  const [visible, setVisible] = useState(false);
  const [jabatan, setJabatan] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    console.log(user);
    if (user !== null) setJabatan(user.jabatan);
  });

  const Logout = () => {
    const mytoken = localStorage.getItem('token');
    let newObj;
    myAxios
      .post('logout', newObj, {
        headers: {
          Authorization: 'Bearer ' + mytoken,
        },
      })
      .then((res) => {
        setUser(null);
        message.success('Berhasil keluar!');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('nama');
      })
      .catch((err) => {
        // setLoading(false);
        message.error(JSON.stringify(err.response.data));
      });
  };

  const menu = (
    <Menu style={{ fontFamily: 'poppins' }}>
      <Menu.Item icon={<UserOutlined />}>
        <Link to='/changePass'>Ubah Kata Sandi</Link>
      </Menu.Item>
      <Menu.Item icon={<PoweroffOutlined />}>
        <a target='_blank' rel='noopener noreferrer' onClick={Logout}>
          Keluar
        </a>
      </Menu.Item>
    </Menu>
  );

  const menuDrawer = (
    <Menu
      theme='dark'
      defaultSelectedKeys={['1']}
      style={{ backgroundColor: '#1F1F1F' }}>
      <SubMenu key='sub8' icon={<UserSwitchOutlined />} title='Profil'>
        <Menu.Item key='19' style={{ margin: '0', backgroundColor: '#141414' }}>
          <Link className='link' to='/changePass'>
            Ubah Kata Sandi
          </Link>
        </Menu.Item>
        <Menu.Item key='20' style={{ margin: '0', backgroundColor: '#141414' }}>
          <a target='_blank' rel='noopener noreferrer' onClick={Logout}>
            Keluar
          </a>
        </Menu.Item>
      </SubMenu>
      {(jabatan === 'Owner' || jabatan === 'Operational Manager') && (
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

      {(jabatan === 'Operational Manager' ||
        jabatan === 'Waiter' ||
        jabatan === 'Cashier') && (
        <Menu.Item
          key='3'
          icon={<UserOutlined />}
          style={{ margin: '0', backgroundColor: '#1F1F1F' }}>
          <Link className='link' to='/showCustomer'>
            Pelanggan
          </Link>
        </Menu.Item>
      )}
      {(jabatan === 'Operational Manager' || jabatan === 'Chef') && (
        <Menu.Item
          icon={<NodeIndexOutlined />}
          key='4'
          style={{ margin: '0', backgroundColor: '#1F1F1F' }}>
          <Link className='link' to='/showBahan'>
            Bahan
          </Link>
        </Menu.Item>
      )}

      {(jabatan === 'Operational Manager' ||
        jabatan === 'Waiter' ||
        jabatan === 'Cashier') && (
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
      {jabatan === 'Operational Manager' && (
        <Menu.Item
          key='7'
          icon={<ApartmentOutlined />}
          style={{ margin: '0', backgroundColor: '#1F1F1F' }}>
          <Link className='link' to='/showTable'>
            Meja
          </Link>
        </Menu.Item>
      )}
      {(jabatan === 'Waiter' || jabatan === 'Cashier') && (
        <Menu.Item
          key='8'
          icon={<ApartmentOutlined />}
          style={{ margin: '0', backgroundColor: '#1F1F1F' }}>
          <Link className='link' to='/showTableOnly'>
            Meja
          </Link>
        </Menu.Item>
      )}

      {jabatan === 'Operational Manager' && (
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

      {(jabatan === 'Operational Manager' || jabatan === 'Cashier') && (
        <SubMenu key='sub4' icon={<TransactionOutlined />} title='Transaksi'>
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

      {jabatan === 'Chef' && (
        <Menu.Item
          key='13'
          icon={<OrderedListOutlined />}
          style={{ margin: '0', backgroundColor: '#1F1F1F' }}>
          <Link className='link' to='/pesananChef'>
            Daftar Pesanan
          </Link>
        </Menu.Item>
      )}

      {jabatan === 'Waiter' && (
        <Menu.Item
          key='14'
          icon={<OrderedListOutlined />}
          style={{ margin: '0', backgroundColor: '#1F1F1F' }}>
          <Link className='link' to='/pesananWaiter'>
            Daftar Pesanan
          </Link>
        </Menu.Item>
      )}

      {jabatan === 'Operational Manager' && (
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
      {(jabatan === 'Operational Manager' || jabatan === 'Chef') && (
        <SubMenu key='sub7' icon={<HistoryOutlined />} title='Riwayat Bahan'>
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
      {(jabatan === 'Operational Manager' || jabatan === 'Owner') && (
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
  );

  return (
    <Router>
      <Layout>
        <div className='side-bar'>
          {user != null && (
            <Sider
              theme='dark'
              className='sider-menu'
              trigger={null}
              collapsible
              collapsed={collapsed}
              style={{
                height: '100%',
                minHeight: '100vh',
                backgroundColor: '#1F1F1F',
              }}>
              {collapsed === true && (
                <div className='logo' style={{ width: '80px', height: '64px' }}>
                  <Link to='/'>
                    <img
                      alt=''
                      style={{ transition: 'opacity 1s ease-in-out' }}
                      src={LogoAkb}
                    />
                  </Link>
                </div>
              )}
              {collapsed === false && (
                <div
                  className='logo'
                  style={{ width: '200px', height: '64px' }}>
                  <Link to='/'>
                    <img
                      alt=''
                      style={{ transition: 'opacity 1s ease-in-out' }}
                      src={LogoAkbFull}
                    />
                  </Link>
                </div>
              )}
              <MenuCustom />
            </Sider>
          )}
        </div>

        <Layout className='site-layout'>
          {user && (
            <Header
              theme='dark'
              className='site-layout-background'
              style={{ padding: 0, backgroundColor: '#141414' }}>
              <div className='hamburger-menu'>
                <Button
                  className='menuOutline'
                  // type='danger'
                  background='#EAEFF2'
                  icon={<MenuOutlined style={{ color: '#001529' }} />}
                  onClick={() => setVisible(true)}></Button>
              </div>
              <div className='sider-menu'>
                {React.createElement(
                  collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                  {
                    className: 'trigger',
                    onClick: toggle,
                    style: { marginLeft: '30px', color: 'white' },
                  }
                )}
                {user && (
                  <>
                    <Dropdown
                      overlay={menu}
                      placement='bottomRight'
                      trigger={['click']}>
                      <img
                        alt=''
                        style={{
                          width: '65px',
                          float: 'right',
                          margin: '13px',
                          marginRight: '25px',
                          marginLeft: '-18px',
                        }}
                        icon={<CaretDownOutlined />}
                        src={Profile}></img>
                    </Dropdown>
                    <Row
                      style={{
                        float: 'right',
                        marginRight: '-10px',
                      }}>
                      <Col
                        md={22}
                        style={{ marginTop: '-10px', marginBottom: '-45px' }}>
                        <Dropdown overlay={menu} placement='bottomRight'>
                          <span
                            icon={<PoweroffOutlined />}
                            style={{
                              float: 'right',
                              color: 'white',
                              marginRight: '15px',
                              fontWeight: '900',
                            }}>
                            {user.nama}
                          </span>
                        </Dropdown>
                      </Col>
                      <Col md={22} style={{ marginTop: '0' }}>
                        <span
                          style={{
                            float: 'right',
                            marginRight: '15px',
                            fontSize: '11px',
                            color: '#E3E5E1',
                          }}>
                          {user.email} - {user.jabatan}
                        </span>
                      </Col>
                    </Row>

                    <span
                      style={{
                        float: 'right',
                        color: 'white',
                        marginRight: '15px',
                      }}>
                      {/* <Clock format={"HH:mm:ss"} ticking={true} /> */}
                    </span>
                  </>
                )}
              </div>
            </Header>
          )}
          {user && (
            <Drawer
              closable={false}
              title={'Atma Korean BBQ'}
              placement='left'
              style={{ padding: 0 }}
              onClick={() => setVisible(false)}
              backgroundColor='#1f1f1f'
              visible={visible}>
              {menuDrawer}
            </Drawer>
          )}
          <Content className='backGround' style={{ minHeight: '87vh' }}>
            <ContentCustom />
          </Content>
          <FooterCustom />
        </Layout>
      </Layout>
    </Router>
  );
};

export default LayoutCustom;
