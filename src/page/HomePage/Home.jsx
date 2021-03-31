import React from 'react';
import { Card, Row, Col } from 'antd';

import User from '../../asset/icon/user.png';

const Home = () => {
  return (
    <div style={{ padding: '50px' }}>
      <Row justify='space-between'>
        <Col md={3} style={{ margin: '7px 2px' }}>
          <Card
            style={{
              height: 200,
              width: 150,
              boxShadow: '0 8px 6px -6px black',
              backgroundColor: '#2BA6E6',
              borderRadius: '10px',
            }}>
            <h1 style={{ textAlign: 'center' }}>
              <img
                style={{ width: '75px', marginBottom: '-10px' }}
                src={User}
              />
            </h1>
            <h1
              style={{
                textAlign: 'center',
                color: 'white',
                marginBottom: '0',
              }}>
              1
            </h1>
            <h3
              style={{ textAlign: 'center', color: 'white', fontSize: '20px' }}>
              Owner
            </h3>
          </Card>
        </Col>
        <Col md={3} style={{ margin: '7px 2px' }}>
          <Card
            style={{
              height: 200,
              width: 150,
              boxShadow: '0 8px 6px -6px black',
              backgroundColor: '#FFB748',
              borderRadius: '10px',
            }}>
            <h1 style={{ textAlign: 'center' }}>
              <img
                style={{ width: '75px', marginBottom: '-10px' }}
                src={User}
              />
            </h1>
            <h1
              style={{
                textAlign: 'center',
                color: 'white',
                marginBottom: '0',
              }}>
              1
            </h1>
            <h4
              style={{ textAlign: 'center', color: 'white', fontSize: '17px' }}>
              Operation Manager
            </h4>
          </Card>
        </Col>
        <Col md={3} style={{ margin: '7px 2px' }}>
          <Card
            style={{
              height: 200,
              width: 150,
              boxShadow: '0 8px 6px -6px black',
              backgroundColor: '#3AA99E',
              borderRadius: '10px',
            }}>
            <h1 style={{ textAlign: 'center' }}>
              <img style={{ width: '80px' }} src={User} />
            </h1>
            <h1
              style={{
                textAlign: 'center',
                color: 'white',
                marginBottom: '0',
              }}>
              2.450
            </h1>
            <h3
              style={{ textAlign: 'center', color: 'white', fontSize: '20px' }}>
              Customer
            </h3>
          </Card>
        </Col>
        <Col md={3} style={{ margin: '7px 2px' }}>
          <Card
            style={{
              height: 200,
              width: 150,
              boxShadow: '0 8px 6px -6px black',
              backgroundColor: '#163D5C',
              borderRadius: '10px',
            }}>
            <h1 style={{ textAlign: 'center' }}>
              <img style={{ width: '80px' }} src={User} />
            </h1>
            <h1
              style={{
                textAlign: 'center',
                color: 'white',
                marginBottom: '0',
              }}>
              5
            </h1>
            <h3
              style={{ textAlign: 'center', color: 'white', fontSize: '20px' }}>
              Cashier
            </h3>
          </Card>
        </Col>
        <Col md={3} style={{ margin: '7px 2px' }}>
          <Card
            style={{
              height: 200,
              width: 150,
              boxShadow: '0 8px 6px -6px black',
              backgroundColor: '#D5502C',
              borderRadius: '10px',
            }}>
            <h1 style={{ textAlign: 'center' }}>
              <img style={{ width: '80px' }} src={User} />
            </h1>
            <h1
              style={{
                textAlign: 'center',
                color: 'white',
                marginBottom: '0',
              }}>
              45
            </h1>
            <h3
              style={{ textAlign: 'center', color: 'white', fontSize: '20px' }}>
              Waiter
            </h3>
          </Card>
        </Col>
        <Col md={3} style={{ margin: '7px 2px' }}>
          <Card
            style={{
              height: 200,
              width: 150,
              boxShadow: '0 8px 6px -6px black',
              backgroundColor: '#F39952',
              borderRadius: '10px',
            }}>
            <h1 style={{ textAlign: 'center' }}>
              <img style={{ width: '80px' }} src={User} />
            </h1>
            <h1
              style={{
                textAlign: 'center',
                color: 'white',
                marginBottom: '0',
              }}>
              26
            </h1>
            <h3
              style={{ textAlign: 'center', color: 'white', fontSize: '20px' }}>
              Chef
            </h3>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
