import React, { Component, useState, useContext, useEffect } from 'react';
import {
  Layout,
  Menu,
  Button,
  Drawer,
  Dropdown,
  message,
  Row,
  Badge,
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
  ClockCircleOutlined,
} from '@ant-design/icons';

import MenuCustom from './MenuCustom';
import ContentCustom from './ContentCustom';
import FooterCustom from './FooterCustom';

import { UserContext } from '../context/UserContext';
import LogoAkb from '../asset/logo/logo-col.png';
import LogoAkbFull from '../asset/logo/logo-nav-1.png';
import Clock from 'react-live-clock';
import Profile from '../asset/icon/profile.png';
import './Layout.css';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

const LayoutCustom = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useContext(UserContext);
  const [visible, setVisible] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    console.log(user);
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
    <Menu theme='light' mode='inline' defaultSelectedKeys={['1']}>
      <SubMenu key='sub1' icon={<IdcardOutlined />} title='Employees'>
        <Menu.Item key='1'>Add Employee</Menu.Item>
        <Menu.Item key='2'>Show Employee</Menu.Item>
      </SubMenu>
      <SubMenu key='sub2' icon={<ApartmentOutlined />} title='Table'>
        <Menu.Item key='3'>Add Table</Menu.Item>
        <Menu.Item key='4'>Show Table</Menu.Item>
      </SubMenu>
      <SubMenu key='sub3' icon={<CoffeeOutlined />} title='Menu'>
        <Menu.Item key='5'>Add Menu</Menu.Item>
        <Menu.Item key='6'>Show Menu</Menu.Item>
      </SubMenu>
      <SubMenu key='sub4' icon={<NodeIndexOutlined />} title='Ingredients'>
        <Menu.Item key='7'>Add Ingredients</Menu.Item>
        <Menu.Item key='8'>Show Ingredients</Menu.Item>
      </SubMenu>
      <SubMenu key='sub5' icon={<FileSyncOutlined />} title='Report'>
        <Menu.Item key='9'>Stock</Menu.Item>
        <Menu.Item key='10'>Sale of Menu Items</Menu.Item>
        <Menu.Item key='11'>Income</Menu.Item>
        <Menu.Item key='12'>Spending</Menu.Item>
      </SubMenu>
      <SubMenu key='sub6' icon={<FileSyncOutlined />} title='Account'>
        {menu}
      </SubMenu>
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
                  type='danger'
                  backgtound='#EAEFF2'
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
                            color: 'white',
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
              title={'Atma Korean BBQ'}
              placement='left'
              // onClick={() => setVisible(true)}
              onClose={() => setVisible(false)}
              visible={visible}>
              {menuDrawer}
            </Drawer>
          )}
          <Content className='backGround' style={{ minHeight: '80vh' }}>
            <ContentCustom />
          </Content>
          <FooterCustom />
        </Layout>
      </Layout>
    </Router>
  );
};

export default LayoutCustom;
