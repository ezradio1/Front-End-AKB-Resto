import react from 'React';
import { Result, Button } from 'antd';

const SuccessPage = () => {
  return (
    <>
      <Result
        status='success'
        title='Karyawan Berhasil Ditambah'
        subTitle='Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait.'
        extra={[
          <Button type='primary' key='console'>
            Lihat Karyawan
          </Button>,
          <Button key='buy'>Tambah Karyawan</Button>,
        ]}
      />
    </>
  );
};

export default SuccessPage;
