import React from 'react';

import 'antd/dist/antd.css';

const FooterCustom = () => {
  return (
    <div className='footer-custom' style={{ backgroundColor: '#141414' }}>
      <h5
        style={{
          color: '#E6ECEE',
          height: '25px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '10px',
        }}>
        AKB © 2021 by Ezra Audivano Dirfa
      </h5>
    </div>
  );
};

export default FooterCustom;
