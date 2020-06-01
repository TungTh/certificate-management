import { Col, Row } from 'antd';
import { FileProtectOutlined, CloudUploadOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import React from 'react';

import './Intro.css';

export const Intro = props => (
  <Row >
    <Col span={12}>
      <div
        style={{
          backgroundColor: '#ff4242',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          cursor: 'pointer',
        }}
        onClick={() => {
          props.onClick('verifier');
        }}
        onKeyDown={() => { }}
        role="button"
        tabIndex={0}
      >
        <FileProtectOutlined
          style={{ fontSize: '70px', color: 'white' }}
          className="App-intro"
        />
        <p style={{ color: 'white', fontSize: '20px', marginTop: '15px' }}>
          Verifier
        </p>
      </div>
    </Col>
    <Col span={12}>
      <div
        style={{
          backgroundColor: '#1890ff',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          cursor: 'pointer',
        }}
        onClick={() => {
          props.onClick('issuer');
        }}
        onKeyDown={() => { }}
        role="button"
        tabIndex={0}
      >
        <CloudUploadOutlined

          style={{ fontSize: '70px', color: 'white' }}
          className="App-intro"
        />
        <p style={{ color: 'white', fontSize: '20px', marginTop: '15px' }}>
          Issuer
        </p>
      </div>
    </Col>
  </Row>
);

Intro.propTypes = {
  onClick: PropTypes.func.isRequired,
};
