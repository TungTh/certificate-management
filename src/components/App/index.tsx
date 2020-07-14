import { Layout, Menu, message, Spin } from 'antd';
import { SafetyCertificateOutlined, FileProtectOutlined } from '@ant-design/icons';
import React, { Component } from 'react';
import Web3 from 'web3';

import { abi, bytecode } from '../../constants';
import {
  getContractAddressList,
  setContractAddress,
} from '../../libs/smartContractUtils';
import { Intro } from '../Intro/Intro';
import Issue from '../Issue/Issue';
import Select from '../select/select';
import './App.css';
import Logo from './CertMana-logo.png';

//Ref: https://stackoverflow.com/questions/12709074/how-do-you-explicitly-set-a-new-property-on-window-in-typescript?rq=1
declare global {
  interface Window {
      ethereum:any;
  }
}

interface IState {
  web3: any;
  institute: string;
  contractAddress: string;
  MyContract: any;
  currentSection: string;
  intro: boolean;
  pendingContract: boolean;
  account: string;
  getContractAddressList: string[];
}

const { Header, Content } = Layout;
class App extends Component<{}, IState> {
  state = {
    web3: new Web3(Web3.givenProvider || 'http://localhost:8545'),
    institute: '',
    contractAddress: '',
    MyContract: null,
    currentSection: 'verifier',
    intro: true,
    pendingContract: false,
    account: '',
    getContractAddressList: [],
  };

  onAccountChange = (accounts) => {
    this.setState({account: accounts[0]});
    console.log(this.state.account);
  }

  async componentDidMount() {
    const { web3 } = this.state;
    const accounts = await window.ethereum.enable();

    window.ethereum.on('accountsChanged', this.onAccountChange);

    const contractAddressList = await getContractAddressList();
    const account = accounts[0];
    this.setState({
      account,
      getContractAddressList: contractAddressList,
    });
  }

  createContract = async (
    MTRoot: string,
    instituteName: string,
    logoUrl: string,
    yearOfGraduation: string,
    description: string,
  ) => {
    const { web3 } = this.state;
    this.setState({
      pendingContract: true,
    });
    console.log(this.state.institute, MTRoot);
    console.log(
      'im also here',
      MTRoot,
      instituteName,
      logoUrl,
      yearOfGraduation,
      description,
    );

    web3.eth.getAccounts().then(accounts => {
      const account = accounts[0];
      const certContract: any = new web3.eth.Contract(abi as any);

      certContract.setProvider(web3.currentProvider);

      certContract
        .deploy({
          arguments: [
            instituteName,
            logoUrl,
            yearOfGraduation,
            description,
            MTRoot,
          ],
          data: bytecode,
        })
        .send({
          from: account,
          gas: 4700000,
          gasPrice: '3000000',
        })
        .then(async newContractInstance => {
          const MyContract = new web3.eth.Contract(
            abi,
            newContractInstance.options.address,
          );
          this.setState({
            contractAddress: newContractInstance.options.address,
            MyContract,
            pendingContract: false,
          });
          message.success('Smart Contract created');
          console.log('address: ', newContractInstance.options.address);
          await setContractAddress(
            newContractInstance.options.address,
            this.state.account,
          );
        });
    });
    const contractAddressList = await getContractAddressList();
    this.setState({
      getContractAddressList: contractAddressList,
    });
  };

  selectSection = (section: string) => {
    this.setState({
      currentSection: section,
    });
  };

  render() {
    const {
      MyContract,
      contractAddress,
      currentSection,
      intro,
      pendingContract,
      account,
    } = this.state;

    return intro ? (
      <Intro
        onClick={chosenSection => {
          this.setState({
            currentSection: chosenSection,
            intro: false,
          });
        }}
      />
    ) : (
        <Spin spinning={pendingContract} tip="Deploying smart contract ...">
          <Layout className="layout" style={{ height: '100vh' }}>
            <Header>
              <div
                className="logo"
                style={{
                  background: 'transparent',
                  margin: '0 24px 0 0',
                }}
              >
                <img src={Logo} alt="logo" style={{ width: '120px' }} />
              </div>
              <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={[currentSection]}
                style={{ lineHeight: '64px' }}
              >
                <Menu.Item
                  key="verifier"
                  onClick={() => this.selectSection('verifier')}
                >
                  <SafetyCertificateOutlined 
                   style={{ display: 'inline-block', verticalAlign: 'middle' }}/>
                   Verifier

                </Menu.Item>
                <Menu.Item
                  key="issuer"
                  onClick={() => this.selectSection('issuer')}
                >
                  <FileProtectOutlined
                    style={{ display: 'inline-block', verticalAlign: 'middle' }}
                  />
                Issuer
                </Menu.Item>
                <Menu.Item
                  key="select"
                  onClick={() => this.selectSection('Select Discloser')}
                >
                  <FileProtectOutlined
                    style={{ display: 'inline-block', verticalAlign: 'middle' }}
                  />
                Select
                </Menu.Item>
              </Menu>
            </Header>
            <Content style={{ padding: '0 50px' }} className="App">
              <div style={{ background: '#fff', padding: 24, height: '93vh' }}>
                {currentSection === 'issuer' ? (
                  <Issue
                    MyContract={MyContract}
                    contractAddress={contractAddress}
                    account={account}
                    getContractAddressList={this.state.getContractAddressList}
                    createContract={(
                      MTRoot: string,
                      instituteName: string,
                      logoUrl: string,
                      yearOfGraduation: string,
                      description: string,
                    ) =>
                      this.createContract(
                        MTRoot,
                        instituteName,
                        logoUrl,
                        yearOfGraduation,
                        description,
                      )
                    }
                  />
                ) : (
                    <Select />
                  )}
              </div>
            </Content>
          </Layout>
        </Spin>
      );
  }
}

export default App;
