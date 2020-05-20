
const configs = {
  imgPre:"https://static.iyouchain.com/extension/images/",
  passwordTimer:100,
  languages:[
    {
      key:"zh",
      label:"中文(简体)"
    },
    {
      key:"en",
      label:"English"
    }
  ],
  networks:{
    main:{
      key:"main",
      name:"有链主网络",
      explorer:"https://explorer.iyouchain.com",
      provider:"https://mainnet-http.iyouchain.com"
    },
    test:{
      key:"test",
      name:"有链测试网络",
      explorer:"https://test-explorer.iyouchain.com",
      provider:"https://test-node.iyouchain.com"
    },
    localhost:{
      key:"localhost",
      name:"Localhost",
      provider:"http://localhost:8283"
    },
    custom:{
      key:"custom",
      name:"自定义 RPC"
    }
  },
  baseToken:{
    address:"0x0",
    symbol:"YOU",
    decimal:18,
    icon:"https://static.iyouchain.com/extension/images/icon/you.png"
  },
  gasOptions: [
    {
      key:"slow",
      label:"",
      value:4//gasPrice glu，
    },
    {
      key:"normal",
      label:"",
      value:10
    },
    {
      key:"fast",
      label:"",
      value:20
    }
  ],
  gasLimit:{
    base:21000,
    token:100000
  },
  txStatus:{
    "Failed":0,
    "Pending":1,
    "Confirmation":2,
    "Success":3
  },
  regular:{
    email:/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    mobile:/^0?(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])[0-9]{8}$/,
    url:/[a-zA-z]+:\/\/[^\s]*/,
    password:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    ID:/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  },
  ACCOUNT_TYPE:{
    MNEMONIC: 0,
    PRIVATE_KEY: 1,
    KEY_STORE:2
  },
  abi:`[
	{
		"constant": true,
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"name": "balance",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_to",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
    },
    {
		"constant": true,
		"inputs": [],
		"name": "PRIVATE_ADDRESS",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]`
};

export default configs;
