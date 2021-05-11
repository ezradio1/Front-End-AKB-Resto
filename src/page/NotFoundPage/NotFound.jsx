import React, { Component } from 'react';
import { Button } from 'antd';
import './customStyle.css';
const NotFound = () => {
  return (
    <>
      <section class='error-container'>
        <span class='four'>
          <span class='screen-reader-text'>4</span>
        </span>
        <span class='zero'>
          <span class='screen-reader-text'>0</span>
        </span>
        <span class='four'>
          <span class='screen-reader-text'>4</span>
        </span>
        <p class='zoom-area'>
          <b>Halaman</b> tidak ditemukan.
        </p>
      </section>
      <div class='link-container'>
        <Button type='primary'>Kembali ke Menu Utama</Button>
      </div>
    </>
  );
};
export default NotFound;
