export const rootAddressRinkeby = '0x9efd4724e03f003ab3cfe534499f87b8efb855e9';
export const rootAddressRopsten = '0x9ebf8424616feef1c244d68fb3028ff98333e27b';
export const rootAddressLocal = '0xC5647fB1c574B5c822de2B100EBB6Ab644964C51';
//TODO: update on new chain
export const abi: any = [
  {
    constant: false,
    inputs: [
      {
        name: '_studentID',
        type: 'string',
      },
      {
        name: '_reasonForRevoke',
        type: 'string',
      },
    ],
    name: 'revokeCertificate',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_studentID',
        type: 'string',
      },
    ],
    name: 'unRevokeCertificate',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        name: '_institute',
        type: 'string',
      },
      {
        name: '_logoURL',
        type: 'string',
      },
      {
        name: '_yearOfGraduation',
        type: 'int256',
      },
      {
        name: '_description',
        type: 'string',
      },
      {
        name: '_MTRoot',
        type: 'bytes32',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'studentID',
        type: 'string',
      },
      {
        indexed: false,
        name: 'announcement',
        type: 'string',
      },
    ],
    name: 'revoke',
    type: 'event',
  },
  {
    constant: true,
    inputs: [],
    name: 'description',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getInstituteInfo',
    outputs: [
      {
        name: '',
        type: 'string',
      },
      {
        name: '',
        type: 'string',
      },
      {
        name: '',
        type: 'int256',
      },
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getRoot',
    outputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'institute',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'logoURL',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'MTRoot',
    outputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'proof',
        type: 'bytes32[]',
      },
      {
        name: 'root',
        type: 'bytes32',
      },
      {
        name: 'leaf',
        type: 'bytes32',
      },
    ],
    name: 'verify',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'pure',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_studentID',
        type: 'string',
      },
    ],
    name: 'verifyWithRevocationList',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'yearOfGraduation',
    outputs: [
      {
        name: '',
        type: 'int256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

export const rootAbi: any = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "_contractAddress",
        "type": "address"
      }
    ],
    "name": "setContractAddress",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "contractAddress",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getContractAddressList",
    "outputs": [
      {
        "name": "",
        "type": "address[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

export const Mnemoic =
  'myth like bonus scare over problem client lizard pioneer submit female collect';

export const COLOR = {
  blue: '#1890ff',
  yellow: '#F4B400',
};
export const bytecode =
  '0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555061034c806100606000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80638b5ee87a14610046578063cb34f74b14610074578063d658d2e9146100a2575b600080fd5b6100726004803603602081101561005c57600080fd5b81019080803590602001909291905050506100f2565b005b6100a06004803603602081101561008a57600080fd5b81019080803590602001909291905050506101ee565b005b6100ce600480360360208110156100b857600080fd5b81019080803590602001909291905050506102eb565b604051808260028111156100de57fe5b60ff16815260200191505060405180910390f35b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146101b4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601d8152602001807f6f6e6c7920636f6e7472616374206f776e65722063616e20697373756500000081525060200191505060405180910390fd5b600180600083815260200190815260200160002060000160006101000a81548160ff021916908360028111156101e657fe5b021790555050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146102b0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601d8152602001807f6f6e6c7920636f6e7472616374206f776e65722063616e20697373756500000081525060200191505060405180910390fd5b60026001600083815260200190815260200160002060000160006101000a81548160ff021916908360028111156102e357fe5b021790555050565b60016020528060005260406000206000915090508060000160009054906101000a900460ff1690508156fea2646970667358221220e4352c4660296f032e7a91f830dac86a2003d79b7fb42a3b4f4c3dc3be45259b64736f6c634300060a0033'