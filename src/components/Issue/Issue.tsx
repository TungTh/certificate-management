import { Button, List, message, Tabs, Tag, Upload, Spin } from 'antd';
import { CloudUploadOutlined, DownloadOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import sha256 from 'crypto-js/sha256';
import JSZip, { forEach } from 'jszip';
import React from 'react';
import { Animated } from 'react-animated-css';
import Dropzone from 'react-dropzone';
import Web3 from 'web3';

import { abi, COLOR } from '../../constants';
import { downloadFile } from '../../libs/download';
import {
  getContractAddressList,
  revokeCertificate,
} from '../../libs/smartContractUtils';
import { createMT } from '../../libs/verifymt';
import IssuingBatchInfoModalForm from '../ModalForm/ModalForm';
import RevokeForm from '../RevokeForm/RevokeForm';
import './Issue.css';
import { stringify } from 'querystring';

const { TabPane } = Tabs;
const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess('ok');
    console.log(file);
  }, 0);
};

const uploadProps = {
  name: 'file',
  customRequest: dummyRequest,
};

interface Props {
  MyContract: any;
  contractAddress: string;
  account: string;
  getContractAddressList: string[];
  createContract: (
    MTRoot,
    instituteName,
    logoUrl,
    yearOfGraduation,
    description,
  ) => void;
}

interface IState {
  hashedCertArray: string[];
  waitingForFileUpload: boolean;
  fileNames: string[];
  fileList: any;
  proofs: any;
  disableButton: boolean;
  MTRoot: string;
  selectedAddress: string;
  reason: string;
  createdContractAddress: string[];
  sectionName: string;
}

interface ISection {
  id: number,
  name: string,
  proof: any[],
  revocationCheckHash: any[],
  image: any,
  mandatory: any
}



class Issue extends React.Component<Props, IState> {
  static readUploadedFileAsText = (inputFile: any) => {
    const temporaryFileReader = new FileReader();

    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException('Problem parsing input file.'));
      };

      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result as any);
      };
      temporaryFileReader.readAsText(inputFile);
    });
  };
  private modal: any;

  constructor(props) {
    super(props);
    this.state = {
      hashedCertArray: [],
      waitingForFileUpload: false,
      fileNames: [],
      fileList: [],
      proofs: [],
      disableButton: true,
      MTRoot: '',
      selectedAddress: '',
      reason: '',
      createdContractAddress: [],
      sectionName: '',
    };
    this.modal = React.createRef();
  }

  async componentWillMount() {
    const createdContractAddress = await getContractAddressList();
    this.setState({
      createdContractAddress,
    });
  }

  uploadFile = async (files: any) => {
    const fileList = files;

    const fileNamesArray: string[] = [];
    this.setState({ waitingForFileUpload: true, hashedCertArray: [], fileList });
    for (let i = 0; i < fileList.length; i++) {
      // TODO: read student ID from json
      // TODO: Define and check file format
      // take file name for student ID. Ex: ITITIU14076
      fileNamesArray.push(fileList[i].name);
    }

    this.setState({
      fileNames: fileNamesArray,
    });

    // Uploads will push to the file input's `.files` array. Get the last uploaded file.
    // Hash files and store the results
    for (let i = 0; i < fileList.length; i++) {
      try {
        let fileContents = await Issue.readUploadedFileAsText(fileList[i]);
        fileContents = sha256(fileContents).toString();

        const modifiedhashedCertArray = this.state.hashedCertArray;
        modifiedhashedCertArray.push(fileContents as string);

        this.setState({
          hashedCertArray: modifiedhashedCertArray,
        });
      } catch (e) {
        console.log(e);
        this.setState({
          waitingForFileUpload: false,
        });
      }
    }

    // Build a merkle tree for all certs
    const data = createMT(this.state.hashedCertArray);
    const { MTRoot, proofs } = data;
    this.setState({
      proofs,
      disableButton: false,
      MTRoot,
    });

    this.setState({
      waitingForFileUpload: false,
    });

    this.modal.current.showModal();

  };
  getProof = (filename) => {
    const indexOfFile = this.state.fileNames.indexOf(filename);
    //lấy index của filename trên array fileNames
    //dùng index đó để lấy trên array proofs
    return this.state.proofs[indexOfFile];
  }

  getFile = (filename) => {
    const indexOfFile = this.state.fileNames.indexOf(filename);
    return this.state.fileList[indexOfFile];
  }


  createContractTrigger = async (values: any) => {
    const { MTRoot } = this.state;
    const { instituteName, logoUrl, yearOfGraduation, description } = values;
    //ToDo: create state => copy value
    //TODO: await has no effect. Because: ??
    await this.props.createContract(
      MTRoot,
      instituteName,
      logoUrl,
      yearOfGraduation,
      description,
    );
    const createdContractAddress = await getContractAddressList();
    this.setState({
      createdContractAddress,
    });
  };

  generateReceipt = () => {
    const { contractAddress } = this.props;
    const { fileList, proofs, fileNames } = this.state;
    const zip = new JSZip();
    const Issuer = {
        "ethereumAccount":"0x2CafB80C3F42Eac0B28Ba157296ad88Ff1F2f01D",
        "ethereumAccountSignature":"CDwiHt/9vuNrwiDlmUCJKq4iickjBWB1mtUtiw5jK+9hfvmmTlS+Ec0ODLBwW+wj\n4Ib0HThenGXX7xBN7QEzOe61QnRQ3QsNln3fpTHf9KtmSDL2QA9LSrl/e7bpJzHM\nEw+Cswx8xYOMDpk2R9CC0x8BY8UXYqMsrcLGpg/zEFqWOTkUN+G1LYOz2eGL2NzY\n1gAT0WxdYfpXfi7t9K2elKLx/3fo114qFGKFhmONilhf4lw6DflZ/rTwPbKQ3QM3\nCCcZL1qWOKnPDmiePtK6v2fqupi5bKoV7mpql+dICdT/AIBiy7M+7aprrLWS11e1\nmCR5IoItzCWOwBMHXnoaRw==",
        "issuerCertificateChain": "-----BEGIN CERTIFICATE-----\nMIIFgzCCA2ugAwIBAgIDFKHtMA0GCSqGSIb3DQEBCwUAMHkxEDAOBgNVBAoTB1Jv\nb3QgQ0ExHjAcBgNVBAsTFWh0dHA6Ly93d3cuY2FjZXJ0Lm9yZzEiMCAGA1UEAxMZ\nQ0EgQ2VydCBTaWduaW5nIEF1dGhvcml0eTEhMB8GCSqGSIb3DQEJARYSc3VwcG9y\ndEBjYWNlcnQub3JnMB4XDTIwMDcxMjE0MDYwM1oXDTIxMDEwODE0MDYwM1owQzEY\nMBYGA1UEAxMPQ0FjZXJ0IFdvVCBVc2VyMScwJQYJKoZIhvcNAQkBFhh0cmFudGhh\nbmgudHVuZ0B5YWhvby5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIB\nAQDE0AA4ZidBh6Yn0inm/qo2BgyO9QpCQgNq8SyLtyLZR/efy99dfXEC2Pnyy6yg\nG0GJwylIhWzop1ccww+g9vT+ZqG73XrIw8GiUvQqGKeLp7o5Dt3LONtTNqjouwOw\n2ejZpH2x63+9tZstz5nBLMQ0EBSK8wR6ouU1LRV99JtHeXPlAEdYlCH+fQ4NNl8x\noVcfWWUm3yHdWUfCsyu322acAwztJ3E9zE3kde1fhOyNbgLy9JOod706MA/n9CuZ\nQuMtq1ypPqnhz6Bat4XM0Th7UxPGTX1opumEuo/BXgWALai3mNVYP5lQNprxYZ9n\n0N/SWa5hALR2qaLYwXCB4emJAgMBAAGjggFIMIIBRDAMBgNVHRMBAf8EAjAAMFYG\nCWCGSAGG+EIBDQRJFkdUbyBnZXQgeW91ciBvd24gY2VydGlmaWNhdGUgZm9yIEZS\nRUUgaGVhZCBvdmVyIHRvIGh0dHA6Ly93d3cuQ0FjZXJ0Lm9yZzAOBgNVHQ8BAf8E\nBAMCA6gwQAYDVR0lBDkwNwYIKwYBBQUHAwQGCCsGAQUFBwMCBgorBgEEAYI3CgME\nBgorBgEEAYI3CgMDBglghkgBhvhCBAEwMgYIKwYBBQUHAQEEJjAkMCIGCCsGAQUF\nBzABhhZodHRwOi8vb2NzcC5jYWNlcnQub3JnMDEGA1UdHwQqMCgwJqAkoCKGIGh0\ndHA6Ly9jcmwuY2FjZXJ0Lm9yZy9yZXZva2UuY3JsMCMGA1UdEQQcMBqBGHRyYW50\naGFuaC50dW5nQHlhaG9vLmNvbTANBgkqhkiG9w0BAQsFAAOCAgEAStlMDJDJCquB\nQ9OrpT3gdxCWnyxVMTeYRCglopCVXq4B7Feb/B5/U5UPHyzQmHceY/UNPm9jed2f\nzpuVmkP7rH8zHP3xUM+6z7jvhvvrGke8RVg/6poctkDTMVpf3ll4vMRVALspzQKJ\nrPzGrh8BB8iBM6EyEJhSVexuLW8thX3DSQug93SdhYi7U4VhOjfSmvvdK8wBdij2\n4+q2E3fnWGywFmsrpNZBgFMgabKRJu3XHpdVGPbOchCN1bBG4ZO7uz/GdI2RhsjB\nM9EC82yilTapAHowjY8X8sHXpR+101YVHanXThwXpDYYR6BcCiAsTB0xABGTBXpa\ng3Wj/cG7lsd9JBiN2Ye6yCAGmbaJ2OAKKJN1KkTKBtHfndNWXLmEMacIKM1OMTEg\n9vOs4rcz1+sGjjN6IOtkkD2OGyFHtDbgP+0VhZDT+dkuBUg5Wi1dEMQ7gd5HTWpn\nCqxvx6u6QXBaViavHeQBiGx1MO44/TKUB7q9znt+mx0O+ehEQYX5a/s1Y6ZgCBQ2\n+q4XJEQAo969bu00I00GrWxcgOP/ftBKURaGNW+dgsAMLa7X8gshGXuISxJDeTou\nUsbEVgXEXi/TGHuFfwnBAC8FsFNbelRKikTWcE3p0Z8jqp9+vhF2SYIXA7I5An1J\nbt1AZhTwUTd+9FOEZiSOrxhUuucswOg=\n-----END CERTIFICATE-----\n-----BEGIN CERTIFICATE-----\nMIIG7jCCBNagAwIBAgIBDzANBgkqhkiG9w0BAQsFADB5MRAwDgYDVQQKEwdSb290\nIENBMR4wHAYDVQQLExVodHRwOi8vd3d3LmNhY2VydC5vcmcxIjAgBgNVBAMTGUNB\nIENlcnQgU2lnbmluZyBBdXRob3JpdHkxITAfBgkqhkiG9w0BCQEWEnN1cHBvcnRA\nY2FjZXJ0Lm9yZzAeFw0wMzAzMzAxMjI5NDlaFw0zMzAzMjkxMjI5NDlaMHkxEDAO\nBgNVBAoTB1Jvb3QgQ0ExHjAcBgNVBAsTFWh0dHA6Ly93d3cuY2FjZXJ0Lm9yZzEi\nMCAGA1UEAxMZQ0EgQ2VydCBTaWduaW5nIEF1dGhvcml0eTEhMB8GCSqGSIb3DQEJ\nARYSc3VwcG9ydEBjYWNlcnQub3JnMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIIC\nCgKCAgEAziLA4kZ97DYoB1CW8qAzQIxL8TtmPzHlawI229Z89vGIj053NgVBlfkJ\n8BLPRoZzYLdufujAWGSuzbCtRRcMY/pnCujW0r8+55jE8Ez64AO7NV1sId6eINm6\nzWYyN3L69wj1x81YyY7nDl7qPv4coRQKFWyGhFtkZip6qUtTefWIonvuLwphK42y\nfk1WpRPs6tqSnqxEQR5YYGUFZvjARL3LlPdCfgv3ZWiYUQXw8wWRBB0bF4LsyFe7\nw2t6iPGwcswlWyCR7BYCEo8y6RcYSNDHBS4CMEK4JZwFaz+qOqfrU0j36NK2B5jc\nG8Y0f3/JHIJ6BVgrCFvzOKKrF11myZjXnhCLotLddJr3cQxyYN/Nb5gznZY0dj4k\nepKwDpUeb+agRThHqtdB7Uq3EvbXG4OKDy7YCbZZ16oE/9KTfWgu3YtLq1i6L43q\nlaegw1SJpfvbi1EinbLDvhG+LJGGi5Z4rSDTii8aP8bQUWWHIbEZAWV/RRyH9XzQ\nQUxPKZgh/TMfdQwEUfoZd9vUFBzugcMd9Zi3aQaRIt0AUMyBMawSB3s42mhb5ivU\nfslfrejrckzzAeVLIL+aplfKkQABi6F1ITe1Yw1nPkZPcCBnzsXWWdsC4PDSy826\nYreQQejdIOQpvGQpQsgi3Hia/0PsmBsJUUtaWsJx8cTLc6nloQsCAwEAAaOCAX8w\nggF7MB0GA1UdDgQWBBQWtTIb1Mfz4OaO873SsDrusjkY0TAPBgNVHRMBAf8EBTAD\nAQH/MDQGCWCGSAGG+EIBCAQnFiVodHRwOi8vd3d3LmNhY2VydC5vcmcvaW5kZXgu\ncGhwP2lkPTEwMFYGCWCGSAGG+EIBDQRJFkdUbyBnZXQgeW91ciBvd24gY2VydGlm\naWNhdGUgZm9yIEZSRUUgaGVhZCBvdmVyIHRvIGh0dHA6Ly93d3cuY2FjZXJ0Lm9y\nZzAxBgNVHR8EKjAoMCagJKAihiBodHRwOi8vY3JsLmNhY2VydC5vcmcvcmV2b2tl\nLmNybDAzBglghkgBhvhCAQQEJhYkVVJJOmh0dHA6Ly9jcmwuY2FjZXJ0Lm9yZy9y\nZXZva2UuY3JsMDIGCCsGAQUFBwEBBCYwJDAiBggrBgEFBQcwAYYWaHR0cDovL29j\nc3AuY2FjZXJ0Lm9yZzAfBgNVHSMEGDAWgBQWtTIb1Mfz4OaO873SsDrusjkY0TAN\nBgkqhkiG9w0BAQsFAAOCAgEAR5zXs6IX01JTt7Rq3b+bNRUhbO9vGBMggczo7R0q\nIh1kdhS6WzcrDoO6PkpuRg0L3qM7YQB6pw2V+ubzF7xl4C0HWltfzPTbzAHdJtja\nJQw7QaBlmAYpN2CLB6Jeg8q/1Xpgdw/+IP1GRwdg7xUpReUA482l4MH1kf0W0ad9\n4SuIfNWQHcdLApmno/SUh1bpZyeWrMnlhkGNDKMxCCQXQ360TwFHc8dfEAaq5ry6\ncZzm1oetrkSviE2qofxvv1VFiQ+9TX3/zkECCsUB/EjPM0lxFBmu9T5Ih+Eqns9i\nvmrEIQDv9tNyJHuLsDNqbUBal7OoiPZnXk9LH+qb+pLf1ofv5noy5vX2a5OKebHe\n+0Ex/A7e+G/HuOjVNqhZ9j5Nispfq9zNyOHGWD8ofj8DHwB50L1Xh5H+EbIoga/h\nJCQnRtxWkHP699T1JpLFYwapgplivF4TFv4fqp0nHTKC1x9gGrIgvuYJl1txIKmx\nXdfJzgscMzqpabhtHOMXOiwQBpWzyJkofF/w55e0LttZDBkEsilV/vW0CJsPs3eN\naQF+iMWscGOkgLFlWsAS3HwyiYLNJo26aqyWPaIdc8E4ck7Sk08WrFrHIK3EHr4n\n1FZwmLpFAvucKqgl0hr+2jypyh5puA3KksHF3CsUzjMUvzxMhykh9zrMxQAHLBVr\nGwc=\n-----END CERTIFICATE-----\n-----BEGIN CERTIFICATE-----\nMIIG0jCCBLqgAwIBAgIBDjANBgkqhkiG9w0BAQsFADB5MRAwDgYDVQQKEwdSb290\nIENBMR4wHAYDVQQLExVodHRwOi8vd3d3LmNhY2VydC5vcmcxIjAgBgNVBAMTGUNB\nIENlcnQgU2lnbmluZyBBdXRob3JpdHkxITAfBgkqhkiG9w0BCQEWEnN1cHBvcnRA\nY2FjZXJ0Lm9yZzAeFw0xMTA1MjMxNzQ4MDJaFw0yMTA1MjAxNzQ4MDJaMFQxFDAS\nBgNVBAoTC0NBY2VydCBJbmMuMR4wHAYDVQQLExVodHRwOi8vd3d3LkNBY2VydC5v\ncmcxHDAaBgNVBAMTE0NBY2VydCBDbGFzcyAzIFJvb3QwggIiMA0GCSqGSIb3DQEB\nAQUAA4ICDwAwggIKAoICAQCrSTURSHzSJn5TlM9Dqd0o10Iqi/OHeBlYfA+e2ol9\n4fvrcpANdKGWZKufoCSZc9riVXbHF3v1BKxGuMO+f2SNEGwk82GcwPKQ+lHm9WkB\nY8MPVuJKQs/iRIwlKKjFeQl9RrmK8+nzNCkIReQcn8uUBByBqBSzmGXEQ+xOgo0J\n0b2qW42S0OzekMV/CsLj6+YxWl50PpczWejDAz1gM7/30W9HxM3uYoNSbi4ImqTZ\nFRiRpoWSR7CuSOtttyHshRpocjWr//AQXcD0lKdq1TuSfkyQBX6TwSyLpI5idBVx\nbgtxA+qvFTia1NIFcm+M+SvrWnIl+TlG43IbPgTDZCciECqKT1inA62+tC4T7V2q\nSNfVfdQqe1z6RgRQ5MwOQluM7dvyz/yWk+DbETZUYjQ4jwxgmzuXVjit89Jbi6Bb\n6k6WuHzX1aCGcEDTkSm3ojyt9Yy7zxqSiuQ0e8DYbF/pCsLDpyCaWt8sXVJcukfV\nm+8kKHA4IC/VfynAskEDaJLM4JzMl0tF7zoQCqtwOpiVcK01seqFK6QcgCExqa5g\neoAmSAC4AcCTY1UikTxW56/bOiXzjzFU6iaLgVn5odFTEcV7nQP2dBHgbbEsPyyG\nkZlxmqZ3izRg0RS0LKydr4wQ05/EavhvE/xzWfdmQnQeiuP43NJvmJzLR5iVQAX7\n6QIDAQABo4IBiDCCAYQwHQYDVR0OBBYEFHWocWBMiBPweNmJd7VtxYnfvLF6MA8G\nA1UdEwEB/wQFMAMBAf8wXQYIKwYBBQUHAQEEUTBPMCMGCCsGAQUFBzABhhdodHRw\nOi8vb2NzcC5DQWNlcnQub3JnLzAoBggrBgEFBQcwAoYcaHR0cDovL3d3dy5DQWNl\ncnQub3JnL2NhLmNydDBKBgNVHSAEQzBBMD8GCCsGAQQBgZBKMDMwMQYIKwYBBQUH\nAgEWJWh0dHA6Ly93d3cuQ0FjZXJ0Lm9yZy9pbmRleC5waHA/aWQ9MTAwNAYJYIZI\nAYb4QgEIBCcWJWh0dHA6Ly93d3cuQ0FjZXJ0Lm9yZy9pbmRleC5waHA/aWQ9MTAw\nUAYJYIZIAYb4QgENBEMWQVRvIGdldCB5b3VyIG93biBjZXJ0aWZpY2F0ZSBmb3Ig\nRlJFRSwgZ28gdG8gaHR0cDovL3d3dy5DQWNlcnQub3JnMB8GA1UdIwQYMBaAFBa1\nMhvUx/Pg5o7zvdKwOu6yORjRMA0GCSqGSIb3DQEBCwUAA4ICAQBakBbQNiNWZJWJ\nvI+spCDJJoqp81TkQBg/SstDxpt2CebKVKeMlAuSaNZZuxeXe2nqrdRM4SlbKBWP\n3Rn0lVknlxjbjwm5fXh6yLBCVrXq616xJtCXE74FHIbhNAUVsQa92jzQE2OEbTWU\n0D6Zghih+j+cN0eFiuDuc3iC1GuZMb/Zw21AXbkVxzZ4ipaL0YQgsSt1P22ipb69\n6OLkrURctgY2cHS4pI62VpRgkwJ/Lw2n+C9vtukozMhrlPSTA0OhNEGiGp2hRpWa\nhiG+HGcIYfAV9v7og3dO9TnS0XDbbk1RqXPpc/DtrJWzmZN0O4KIx0OtLJJWG9zp\n9JrJyO6USIFYgar0U8HHHoTccth+8vJirz7Aw4DlCujo27OoIksg3OzgX/DkvWYl\n0J8EMlXoH0iTv3qcroQItOUFsgilbjRba86Q5kLhnCxjdW2CbbNSp8vlZn0uFxd8\nspxQcXs0CIn19uvcQIo4Z4uQ+00Lg9xI9YFV9S2MbSanlNUlvbB4UvHkel0p6bGt\nAmp1dJBSkZOFm0Z6ek+G7w7R1aTifjGJrdw032O+VIKwCgu8DdskR0w0B68ydZn0\nATnMnr5ExvcWkZBtCgQa2NvSKrcQnlaqo9icEF4XevI/VTezlb1LjYMWHVd5R6C2\np4wTyVBIM8hjrLcKiChF43GRJtne7w==\n-----END CERTIFICATE-----"
    }
    const Sections = [{
      id: '',
      name: String,
      proof: [],
      manadatory: String,
    },
    {
      id: '',
      name: String,
      proof: [],
      manadatory: String
    },
    {
      id: '',
      name: String,
      proof: [],
      manadatory: '',
    },
    ]

    const blockchainReceipt = {
      contractAddress,
      Sections,
      Issuer
    };

    // 0. Dictionary array {}, mỗi student_id có 1 list files
    let dic = {};

    // 1. Group file theo StudentID
    // forEach fileNames{
    //     split.filename(_)
    //     if (student nằm trong dictionary) {
    //       đưa file vào list
    //     }
    //     else tạo list mới gồm một phần tử là fileName
    // }
    for (let i = 0; i < fileNames.length; i++) {
      let result = fileNames[i].split('_');
      if (result[0] in dic) {
        dic[result[0]].push(result[1]);
      }
      else {
        dic[result[0]] = [result[1]]
      }
    }
    console.log(dic);
    // 2. forEach Group, kiểm tra các phần tử đúng format không, tạo receipt
    for (var studentID in dic) {

      for (let i = 0; i < dic[studentID].length; i++) {
        const fullFileName = studentID + "_" + dic[studentID][i];
        const sectionName = dic[studentID][i].split('.')[0];

        if (dic[studentID][i] == 'CertificateOfAchievement.pdf') {
          blockchainReceipt.Sections[0].id = '1';
          blockchainReceipt.Sections[0].manadatory = 'true';
          blockchainReceipt.Sections[0].proof = this.getProof(fullFileName);
          blockchainReceipt.Sections[0].name = sectionName;
        }
        else if (dic[studentID][i] == 'ScienceProfile.pdf') {
          blockchainReceipt.Sections[1].id = '2';
          blockchainReceipt.Sections[1].manadatory = 'false';
          blockchainReceipt.Sections[1].proof = this.getProof(fullFileName);
          blockchainReceipt.Sections[1].name = sectionName;
        }
        else if (dic[studentID][i] == 'Transcript.pdf') {
          blockchainReceipt.Sections[2].id = '3';
          blockchainReceipt.Sections[2].manadatory = 'false';
          blockchainReceipt.Sections[2].proof = this.getProof(fullFileName);
          blockchainReceipt.Sections[2].name = sectionName;
        }

        const receipt = new Blob([JSON.stringify(blockchainReceipt)], {
          type: 'json',
        });
        console.log(studentID);
        const folder = zip.folder(studentID);
        if (folder != null) {
          folder.file(
            `${studentID}_blockchainReceipt.json`,
            receipt,
          );

          const file = this.getFile(fullFileName);
          folder.file(fullFileName, file);
        }
      }

    }
    zip.generateAsync({ type: 'blob' }).then((content: any) => {
      downloadFile(content, 'certBatch.zip', 'zip');
    });
  };




  // for (let i = 0; i < fileNames.length; i++) {
  //   blockchainReceipt.proof = proofs[i];
  //   const receipt = new Blob([JSON.stringify(blockchainReceipt)], {
  //     type: 'json',
  //   });

  // const folder = zip.folder(fileNames[i].split('.')[0]);
  // if (folder != null) {
  //   folder.file(
  //     `${fileNames[i].split('.')[0]}_blockchainReceipt.json`,
  //     receipt,
  //   );
  //     folder.file(fileNames[i], fileList[i]);
  // }
  // }

  // zip.generateAsync({ type: 'blob' }).then((content: any) => {
  //   downloadFile(content, 'certBatch.zip', 'zip');
  // });


  uploadForRevoking = async (info: any) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      const { account } = this.props;
      const { selectedAddress, reason } = this.state;
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
      const MyContract = new web3.eth.Contract(abi, selectedAddress);
      message.success(`${info.file.name} file uploaded successfully`);
      const fileContents = await Issue.readUploadedFileAsText(
        info.file.originFileObj,
      );
      const hashedCert = sha256(fileContents).toString();

      revokeCertificate(
        hashedCert,
        reason,
        account,
        MyContract,
        selectedAddress,
      );
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  render() {
    const { disableButton, createdContractAddress } = this.state;
    const { contractAddress } = this.props;

    return (
      <div style={{ display: 'grid' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: '#1890ff' }}>Issuing section</h1>
        </div>

        <Tabs
          defaultActiveKey="1"
          tabBarStyle={{ display: 'flex', justifyContent: 'flex-start' }}
        >
          <TabPane
            tab={
              <span>
                <CloudUploadOutlined
                  style={{ display: 'inline-block', verticalAlign: 'middle' }}
                />
                Issue certificates
              </span>
            }
            key="1"
          >
            <Spin spinning={this.state.waitingForFileUpload} size="large">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  width: '100%',
                }}
              >
                <Dropzone
                  onDrop={this.uploadFile}
                  accept=".pdf,.doc,.docs,images/*"
                  multiple
                  className="dropzone"
                >
                  <Animated
                    animationIn="wobble"
                    animationOut={'none' as any}
                    isVisible
                  >
                    <CloudUploadOutlined
                      style={{
                        fontSize: '70px',
                        color: COLOR.yellow,
                        cursor: 'pointer',
                        marginBottom: '20px',
                      }}
                      className="App-intro"
                    />
                  </Animated>
                  <p>
                    Drop your{' '}
                    <span style={{ fontWeight: 'bold', color: COLOR.blue }}>
                      certificates
                  </span>{' '}
                  here or click to select
                </p>
                </Dropzone>
                <Tag color="blue" style={{ marginBottom: '50px' }}>
                  {this.state.fileNames.length} file(s) selected
              </Tag>
                <div
                  style={{
                    width: 300,
                    display: 'inline-block',
                  }}
                  className="App"
                >
                  <Button
                    size="large"
                    type="primary"
                    disabled={contractAddress ? false : disableButton}
                    block
                    onClick={() => {
                      this.generateReceipt();
                    }}
                  >
                    <DownloadOutlined
                      style={{ display: 'inline-block', verticalAlign: 'middle' }}
                    />
                  Download blockchain receipt
                </Button>

                  <IssuingBatchInfoModalForm
                    ref={this.modal}
                    createContractTrigger={this.createContractTrigger}
                  />
                </div>
              </div>
            </Spin>
            {/* {this.state.waitingForFileUpload && <span>Uploading file...</span>} */}
          </TabPane>
          <TabPane
            tab={
              <span>
                <DeleteOutlined
                  style={{ display: 'inline-block', verticalAlign: 'middle' }}
                />
                Revoke
              </span>
            }
            key="2"
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                // padding: '0 300px',
              }}
            >
              <div style={{ marginTop: '10px' }}>
                <h3 style={{ marginBottom: '30px' }}>Revoke form</h3>
                <RevokeForm
                  onChange={(selectedAddress, reason) => {
                    this.setState({
                      selectedAddress,
                      reason,
                    });
                  }}
                />
                <Upload {...uploadProps} onChange={this.uploadForRevoking}>
                  <Button disabled={!this.state.selectedAddress}>
                    <UploadOutlined
                      style={{
                        display: 'inline-block',
                        verticalAlign: 'middle',
                      }}
                    />{' '}
                    Select certificate to revoke
                  </Button>
                </Upload>
              </div>
              <div>
                <List
                  header={<h3>Created contract address list</h3>}
                  // border="true"
                  split
                  dataSource={createdContractAddress}
                  renderItem={item => (
                    <List.Item style={{ color: '#1890ff' }}>{item}</List.Item>
                  )}
                  pagination={{
                    onChange: page => {
                      console.log(page);
                    },
                    pageSize: 5,
                  }}
                />
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Issue;

