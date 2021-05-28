import React, { useState, useEffect, useContext } from 'react';
import { Card, Row, Col, Spin } from 'antd';

import { Line } from '@ant-design/charts';
import { HomeOutlined, LoadingOutlined } from '@ant-design/icons';
import './home.css';
import Kartu1 from '../../asset/icon/kartu1.png';
import Kartu2 from '../../asset/icon/kartu2.png';
import Kartu3 from '../../asset/icon/kartu3.png';
import Kartu4 from '../../asset/icon/kartu4.png';

import myAxios from '../../myAxios';
import { UserContext } from '../../context/UserContext';

const data = [
  { Bulan: 'Januari', Penjualan: 150 },
  { Bulan: 'Februari', Penjualan: 142 },
  { Bulan: 'Maret', Penjualan: 156 },
  { Bulan: 'April', Penjualan: 242 },
  { Bulan: 'Mei', Penjualan: 268 },
  { Bulan: 'Juni', Penjualan: 251 },
  { Bulan: 'Juli', Penjualan: 195 },
  { Bulan: 'Agustus', Penjualan: 210 },
  { Bulan: 'September', Penjualan: 250 },
  { Bulan: 'Oktober', Penjualan: 215 },
  { Bulan: 'November', Penjualan: 251 },
  { Bulan: 'Desember', Penjualan: 265 },
];
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const config = {
  data,
  height: 400,
  xField: 'Bulan',
  yField: 'Penjualan',
  point: {
    size: 5,
    shape: 'diamond',
  },
  label: {
    style: {
      fill: '#aaa',
    },
  },
};

const Home = () => {
  const [jumlahKaryawan, setJumlahKar] = useState(null);
  const [jumlahTransaksi, setJumlahTr] = useState(null);
  const [jumlahBahan, setJumlahBah] = useState(null);
  const [jumlahMenu, setJumlahMen] = useState(null);

  const [user] = useContext(UserContext);

  useEffect(() => {
    if (jumlahKaryawan === null) {
      myAxios
        .get(`getJumlahKaryawan`, {
          headers: {
            Authorization: 'Bearer ' + user.token,
          },
        })
        .then((res) => {
          const data = res.data.data;
          setJumlahKar(data[0].jumlah);
        })
        .catch((err) => {});
    }
    if (jumlahTransaksi === null) {
      myAxios
        .get(`getJumlahTransaksi`, {
          headers: {
            Authorization: 'Bearer ' + user.token,
          },
        })
        .then((res) => {
          const data = res.data.data;
          setJumlahTr(data[0].jumlah);
        })
        .catch((err) => {});
    }
    if (jumlahBahan === null) {
      myAxios
        .get(`getJumlahBahan`, {
          headers: {
            Authorization: 'Bearer ' + user.token,
          },
        })
        .then((res) => {
          const data = res.data.data;
          setJumlahBah(data[0].jumlah);
        })
        .catch((err) => {});
    }
    if (jumlahMenu === null) {
      myAxios
        .get(`getJumlahMenu`, {
          headers: {
            Authorization: 'Bearer ' + user.token,
          },
        })
        .then((res) => {
          const data = res.data.data;
          setJumlahMen(data[0].jumlah);
        })
        .catch((err) => {});
    }
  });

  return (
    <div style={{ padding: '25px 30px' }}>
      <Row>
        <Col>
          <HomeOutlined
            style={{
              marginLeft: '5px',
              marginRight: '20px',
              fontSize: '20px',
              marginTop: '5px',
            }}
          />
        </Col>
        <Col>
          <h1 style={{ fontWeight: 'bold', fontSize: '25px' }}>
            Dashboard Statistik
          </h1>
        </Col>
      </Row>
      <div
        style={{
          border: '1px solid #8C98AD',
          marginBottom: '15px',
        }}></div>
      <Card
        className='card-reservasi'
        style={{
          marginTop: 16,
          marginBottom: 16,
          borderRadius: '8px',
          border: '0.5px solid #3C8065',
          backgroundColor: '#DFF0D8',
        }}>
        <p
          style={{
            color: '#3C8065',
            marginTop: '-10px',
            fontWeight: 'bold',
          }}>
          Selamat Datang di Halaman Website AKB Restaurant
        </p>
        <p
          style={{
            color: '#3C8065',
            marginBottom: '-10px',
            marginTop: '-10px',
          }}>
          Berikan layanan terbaik pada pelanggan AKB Restaurant untuk
          mengingkatkan kualitas dari AKB Restaurant!
        </p>
      </Card>
      {!jumlahKaryawan && !jumlahBahan && !jumlahMenu && !jumlahTransaksi && (
        <h1
          style={{
            marginTop: '35px',
            textAlign: 'center',
          }}>
          <Spin indicator={antIcon} />
          <p style={{ color: 'grey', fontSize: '15px', marginTop: '5px' }}>
            Memuat
          </p>
        </h1>
      )}
      {jumlahKaryawan && jumlahBahan && jumlahMenu && jumlahTransaksi && (
        <div>
          {/* Menu */}
          <Row justify='center'>
            <Col style={{ margin: '0 11px' }}>
              <div className='mycard'>
                <h1>{jumlahKaryawan}</h1>
                <img alt='' src={Kartu1} />
              </div>
            </Col>
            <Col style={{ margin: '0 11px' }}>
              <div className='mycard'>
                <h1 style={{ color: '#3C763D' }}>{jumlahMenu}</h1>
                <img alt='' src={Kartu2} />
              </div>
            </Col>
            <Col style={{ margin: '0 11px' }}>
              <div className='mycard'>
                <h1 style={{ color: '#A94442' }}>{jumlahBahan}</h1>
                <img alt='' src={Kartu3} />
              </div>
            </Col>
            <Col style={{ margin: '0 11px' }}>
              <div className='mycard'>
                <h1 style={{ color: '#EF9B0F ' }}>{jumlahTransaksi}</h1>
                <img alt='' src={Kartu4} />
              </div>
            </Col>
          </Row>
          <h1 style={{ textAlign: 'CENTER', marginTop: '30px' }}>
            <b>Grafik Penjualan AKB Resto Tahun 2020</b>
          </h1>
          <Line {...config} />
          <Row>
            <Col></Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default Home;
