import React from 'react';
import LogoQR from '../../asset/logo/akb-logo-full.png';
import myAxios from '../../myAxios';
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
  Empty,
  Spin,
  Tooltip,
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import QRCode from 'react-qr-code';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
export class ComponentToPrint extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      objectQr: '',
    };
  }
  componentDidMount() {
    console.log(this.state.objectQr);
    if (localStorage.getItem('id_reservasi') !== null) {
      console.log('id_Reservasi');
      console.log(localStorage.getItem('id_reservasi'));
      let newObj = {
        id_reservasi: localStorage.getItem(['id_reservasi']),
      };
      myAxios
        .post(`transaksi`, newObj, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        })
        .then((res) => {
          let data = res.data.data;
          let objQr = {
            id_transaksi: data.id_transaksi,
            nomor_meja: data.nomor_meja,
            nama_customer: data.nama_customer,
          };
          console.log(data);
          this.setState({
            // no_trans: data.nomor_transaksi,
            objectQr: JSON.stringify(objQr),
            // idEdit: id,
            // loadingQr: false,
            // printed: data.printed,
            // loadingAct: false,
          });
          //   this.getReservasi();
        })
        .catch((err) => {
          message.error('QR Gagal');
        });
    }
  }
  componentDidUpdate() {
    console.log(this.state.objectQr);
    if (localStorage.getItem('id_reservasi') !== null) {
      console.log('id_Reservasi');
      console.log(localStorage.getItem('id_reservasi'));
      let newObj = {
        id_reservasi: localStorage.getItem(['id_reservasi']),
      };
      myAxios
        .post(`transaksi`, newObj, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        })
        .then((res) => {
          let data = res.data.data;
          let objQr = {
            id_transaksi: data.id_transaksi,
            nomor_meja: data.nomor_meja,
            nama_customer: data.nama_customer,
          };
          console.log(data);
          this.setState({
            // no_trans: data.nomor_transaksi,
            objectQr: JSON.stringify(objQr),
            // idEdit: id,
            // loadingQr: false,
            // printed: data.printed,
            // loadingAct: false,
          });
          //   this.getReservasi();
        })
        .catch((err) => {
          message.error('QR Gagal');
        });
    }
  }
  render() {
    return (
      <div id='modalQr'>
        <h1 style={{ textAlign: 'center' }}>
          <img
            style={{ width: '32%', marginBottom: '5px' }}
            src={LogoQR}
            alt=''
          />

          <br />
          {/* {this.state.loadingQr && <Spin indicator={antIcon} />} */}
          <br />
          {this.state.objectQr !== '' && (
            <>
              <QRCode
                fgColor='#1F1F1F'
                style={{
                  textAlign: 'center',
                  marginBottom: '10px',
                }}
                value={this.state.objectQr}
              />
              <br />
              <p
                style={{
                  fontSize: '20px',
                  marginTop: '35px',
                  fontFamily: 'poppins',
                }}>
                {/* <b>{this.state.printed}</b> */}
                <span
                  style={{
                    fontSize: '15px',
                    color: 'grey',
                  }}>
                  <br />
                  Printed by {localStorage.getItem('nama')}
                </span>
                <hr />
                <p>FUN PLACE TO GRILL</p>
                <hr />
              </p>
            </>
          )}
        </h1>
      </div>
    );
  }
}
