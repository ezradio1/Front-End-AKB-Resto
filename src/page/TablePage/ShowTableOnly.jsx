import React, { useEffect, useState } from 'react';

import {
  Input,
  Row,
  Col,
  Button,
  Menu,
  Empty,
  Dropdown,
  Spin,
  message,
} from 'antd';

import { DownOutlined, LoadingOutlined } from '@ant-design/icons';
import TableHijau from '../../asset/icon/tableHijau.png';
import TableMerah from '../../asset/icon/tableMerah.png';
import myAxios from '../../myAxios';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const ShowTableOnly = () => {
  const [meja, setMeja] = useState(null);
  const [search, setSearch] = useState(false);
  const [tempmeja, settempMeja] = useState(null);

  const onFilter = (param) => {
    console.log('TEMP MEJA = ' + param);
    setMeja(
      tempmeja.filter((i) => {
        return i.status === param;
      })
    );
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <a
          target='_blank'
          rel='noopener noreferrer'
          onClick={() => onFilter('Kosong')}>
          Tampil Meja Kosong
        </a>
      </Menu.Item>
      <Menu.Item>
        <a
          target='_blank'
          rel='noopener noreferrer'
          onClick={() => onFilter('Terisi')}>
          Tampil Meja Terisi
        </a>
      </Menu.Item>
    </Menu>
  );

  const getMeja = () => {
    myAxios
      .get(`showMeja`, {
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
        setMeja(data);
        settempMeja(data);
      });
  };

  const hapusFilter = (values) => {
    setMeja(tempmeja);
  };

  const onChange = (e) => {
    const temp = tempmeja.filter((i) => {
      return i.nomor_meja.includes(e.target.value);
    });
    console.info('ada');
    console.info(temp[0]);
    if (e.target.value === '') {
      getMeja();
      setSearch(false);
    } else {
      setSearch(false);
      setMeja(
        tempmeja.filter((i) => {
          return i.nomor_meja.includes(e.target.value);
        })
      );
      if (temp.length === 0) {
        setSearch(true);
      }
    }
  };

  useEffect(() => {
    if (meja === null) {
      getMeja();
    }
    console.log(meja);
  });

  return (
    <div style={{ padding: '15px 30px' }}>
      <h1
        style={{
          fontSize: 'x-large',
          color: '#001529',
          textTransform: 'uppercase',
        }}>
        <strong>data meja</strong>
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
            onClick={hapusFilter}
            style={{ width: '120px', marginTop: '10px' }}>
            Hapus Filter
          </Button>
        </Col>
        <Col xs={24} md={2}>
          <Dropdown overlay={menu}>
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
            placeholder='Cari nomor meja disini ..'
            icons='search'
            onChange={onChange}
            style={{ marginTop: '10px' }}
          />
        </Col>
      </Row>

      {search && <Empty style={{ marginTop: '35px' }} />}

      {!meja && (
        <h1
          style={{
            marginTop: '35px',
            textAlign: 'center',
          }}>
          <Spin indicator={antIcon} />
          <p style={{ color: 'grey', fontSize: '15px' }}>
            Mengambil data meja...
          </p>
        </h1>
      )}
      {meja && (
        <Row justify='start'>
          {meja.map((val, index) => {
            return (
              <Col xs={24} sm={8} md={6} xl={4} style={{ marginTop: '10px' }}>
                <div>
                  <div className='flip-card'>
                    <div className='flip-card-front'>
                      <h1 style={{ textAlign: 'center' }}>{val.nomor_meja}</h1>
                      {val.status !== 'Kosong' && (
                        <img src={TableMerah} alt='' />
                      )}
                      {val.status === 'Kosong' && (
                        <img src={TableHijau} alt='' />
                      )}
                    </div>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
};

export default ShowTableOnly;
