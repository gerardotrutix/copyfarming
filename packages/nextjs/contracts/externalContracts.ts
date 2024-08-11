const externalContracts = {
  84532: [
    {
      chainId: "84532",
      name: "Base Sepolia",
      contracts: {
        CopyFarming: {
          address: "0x5C96c04768a5BeA3D2509342A2ac5a78bAe4143C",
          abi: [
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "vaultId",
                  "type": "uint256"
                }
              ],
              "name": "claimFeesInVault",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "vaultId",
                  "type": "uint256"
                }
              ],
              "name": "closeVault",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "traderWallet",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "nickname",
                  "type": "string"
                }
              ],
              "name": "createTrader",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "startDate",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "expectedAPR",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "minimumInvestment",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "strategy",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "vaultFee",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "traderWallet",
                  "type": "address"
                }
              ],
              "name": "createVault",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "vaultId",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "investmentAmount",
                  "type": "uint256"
                }
              ],
              "name": "invest",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "initialOwner",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "_investmentTokenAddress",
                  "type": "address"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "constructor"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                }
              ],
              "name": "OwnableInvalidOwner",
              "type": "error"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
                }
              ],
              "name": "OwnableUnauthorizedAccount",
              "type": "error"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "previousOwner",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "newOwner",
                  "type": "address"
                }
              ],
              "name": "OwnershipTransferred",
              "type": "event"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "vaultId",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "fees",
                  "type": "uint256"
                }
              ],
              "name": "payVaultFees",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "renounceOwnership",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "newOwner",
                  "type": "address"
                }
              ],
              "name": "transferOwnership",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "user",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "vaultId",
                  "type": "uint256"
                }
              ],
              "name": "getAllUserInvestmentsInVault",
              "outputs": [
                {
                  "components": [
                    {
                      "internalType": "uint256",
                      "name": "investmentId",
                      "type": "uint256"
                    },
                    {
                      "internalType": "address",
                      "name": "investor",
                      "type": "address"
                    },
                    {
                      "internalType": "uint256",
                      "name": "moneyInvested",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "vaultId",
                      "type": "uint256"
                    }
                  ],
                  "internalType": "struct CopyFarming.Investement[]",
                  "name": "",
                  "type": "tuple[]"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "user",
                  "type": "address"
                }
              ],
              "name": "getUserInvestements",
              "outputs": [
                {
                  "components": [
                    {
                      "internalType": "uint256",
                      "name": "investmentId",
                      "type": "uint256"
                    },
                    {
                      "internalType": "address",
                      "name": "investor",
                      "type": "address"
                    },
                    {
                      "internalType": "uint256",
                      "name": "moneyInvested",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "vaultId",
                      "type": "uint256"
                    }
                  ],
                  "internalType": "struct CopyFarming.Investement[]",
                  "name": "",
                  "type": "tuple[]"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "user",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "vaultId",
                  "type": "uint256"
                }
              ],
              "name": "getUserInvestmentInfoInVault",
              "outputs": [
                {
                  "components": [
                    {
                      "internalType": "address",
                      "name": "userWallet",
                      "type": "address"
                    },
                    {
                      "internalType": "uint256",
                      "name": "moneyInvested",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "moneyEarned",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "moneyClaimed",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "contribution",
                      "type": "uint256"
                    }
                  ],
                  "internalType": "struct CopyFarming.Investor",
                  "name": "",
                  "type": "tuple"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "vaultId",
                  "type": "uint256"
                }
              ],
              "name": "getVaultInvestements",
              "outputs": [
                {
                  "components": [
                    {
                      "internalType": "uint256",
                      "name": "investmentId",
                      "type": "uint256"
                    },
                    {
                      "internalType": "address",
                      "name": "investor",
                      "type": "address"
                    },
                    {
                      "internalType": "uint256",
                      "name": "moneyInvested",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "vaultId",
                      "type": "uint256"
                    }
                  ],
                  "internalType": "struct CopyFarming.Investement[]",
                  "name": "",
                  "type": "tuple[]"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "getVaultsList",
              "outputs": [
                {
                  "components": [
                    {
                      "internalType": "uint256",
                      "name": "vaultId",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "startDate",
                      "type": "uint256"
                    },
                    {
                      "internalType": "enum CopyFarming.VaultState",
                      "name": "state",
                      "type": "uint8"
                    },
                    {
                      "internalType": "uint256",
                      "name": "moneyAdded",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "expectedAPR",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "minimumInvestment",
                      "type": "uint256"
                    },
                    {
                      "internalType": "string",
                      "name": "strategy",
                      "type": "string"
                    },
                    {
                      "internalType": "uint256",
                      "name": "vaultFee",
                      "type": "uint256"
                    },
                    {
                      "components": [
                        {
                          "internalType": "address",
                          "name": "traderWallet",
                          "type": "address"
                        },
                        {
                          "internalType": "string",
                          "name": "nickname",
                          "type": "string"
                        }
                      ],
                      "internalType": "struct CopyFarming.Trader",
                      "name": "trader",
                      "type": "tuple"
                    },
                    {
                      "internalType": "uint256",
                      "name": "investors",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "moneyEarned",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "moneyClaimed",
                      "type": "uint256"
                    }
                  ],
                  "internalType": "struct CopyFarming.Vault[]",
                  "name": "",
                  "type": "tuple[]"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "investmentToken",
              "outputs": [
                {
                  "internalType": "contract IERC20",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "investmentTokenAddress",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "name": "nicknames",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "owner",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "traders",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "traderWallet",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "nickname",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "name": "userInvestments",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "investmentId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "investor",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "moneyInvested",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "vaultId",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "name": "vaultInvestements",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "investmentId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "investor",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "moneyInvested",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "vaultId",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "name": "vaultInvestors",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "userWallet",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "moneyInvested",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "moneyEarned",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "moneyClaimed",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "contribution",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "name": "vaultsList",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "vaultId",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "startDate",
                  "type": "uint256"
                },
                {
                  "internalType": "enum CopyFarming.VaultState",
                  "name": "state",
                  "type": "uint8"
                },
                {
                  "internalType": "uint256",
                  "name": "moneyAdded",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "expectedAPR",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "minimumInvestment",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "strategy",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "vaultFee",
                  "type": "uint256"
                },
                {
                  "components": [
                    {
                      "internalType": "address",
                      "name": "traderWallet",
                      "type": "address"
                    },
                    {
                      "internalType": "string",
                      "name": "nickname",
                      "type": "string"
                    }
                  ],
                  "internalType": "struct CopyFarming.Trader",
                  "name": "trader",
                  "type": "tuple"
                },
                {
                  "internalType": "uint256",
                  "name": "investors",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "moneyEarned",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "moneyClaimed",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "name": "vaultsMap",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "vaultId",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "startDate",
                  "type": "uint256"
                },
                {
                  "internalType": "enum CopyFarming.VaultState",
                  "name": "state",
                  "type": "uint8"
                },
                {
                  "internalType": "uint256",
                  "name": "moneyAdded",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "expectedAPR",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "minimumInvestment",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "strategy",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "vaultFee",
                  "type": "uint256"
                },
                {
                  "components": [
                    {
                      "internalType": "address",
                      "name": "traderWallet",
                      "type": "address"
                    },
                    {
                      "internalType": "string",
                      "name": "nickname",
                      "type": "string"
                    }
                  ],
                  "internalType": "struct CopyFarming.Trader",
                  "name": "trader",
                  "type": "tuple"
                },
                {
                  "internalType": "uint256",
                  "name": "investors",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "moneyEarned",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "moneyClaimed",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            }
          ]
          ,
        },
        USDT: {
          address: "0x7de9a0c146Cc6A92F2592C5E4e2331B263De88B1",
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "spender",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "value",
                  type: "uint256",
                },
              ],
              name: "approve",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "spender",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "allowance",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "needed",
                  type: "uint256",
                },
              ],
              name: "ERC20InsufficientAllowance",
              type: "error",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "sender",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "balance",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "needed",
                  type: "uint256",
                },
              ],
              name: "ERC20InsufficientBalance",
              type: "error",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "approver",
                  type: "address",
                },
              ],
              name: "ERC20InvalidApprover",
              type: "error",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "receiver",
                  type: "address",
                },
              ],
              name: "ERC20InvalidReceiver",
              type: "error",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "sender",
                  type: "address",
                },
              ],
              name: "ERC20InvalidSender",
              type: "error",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "spender",
                  type: "address",
                },
              ],
              name: "ERC20InvalidSpender",
              type: "error",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "spender",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "value",
                  type: "uint256",
                },
              ],
              name: "Approval",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "value",
                  type: "uint256",
                },
              ],
              name: "transfer",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "from",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "value",
                  type: "uint256",
                },
              ],
              name: "Transfer",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "from",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "value",
                  type: "uint256",
                },
              ],
              name: "transferFrom",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "spender",
                  type: "address",
                },
              ],
              name: "allowance",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
              ],
              name: "balanceOf",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "decimals",
              outputs: [
                {
                  internalType: "uint8",
                  name: "",
                  type: "uint8",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "name",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "symbol",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "totalSupply",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
          ],
        },
      },
    },
  ],
} as const;

export default externalContracts;