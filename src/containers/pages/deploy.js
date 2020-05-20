
import _ from "lodash";
import React, {PureComponent} from 'react';
import {toLu,toHex,isHex} from "youchain-utils";
import extensionizer from 'extensionizer';
import TransactionController from "../../controllers/transaction";
import TokenController from "../../controllers/token";
import popup from "../../popup";
import configs from "../../common/configs";

import Loading from "../../components/vendors/loading";
import Nav from "../../components/common/nav";
import Result from "../../components/app/deploy/result";
import Gas from "../../components/app/turnOut/form/gas";

export default class Deploy extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data:null,
      gasModal:false,
      loading:false
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    const {params} = this.props;
    // const params = {
    //   from:"0xA0Dbe96C27b56103aee3520164228Cc867F1D4e7",
    //   to:"0x2e428880fb605a3672d0c5432e1cf4aaa4c8fd65",
    //   method:"(fallback)",
    //   gasLimit:3000000,
    //   data:'0x06fdde03',
    //   value:"0.1"
    // };
    const {app:{network},account,token} = this.props.state;

    const baseToken = _.find(token.list,(item)=>{
      return item.network === network.key && item.base && account.current === item.accountAddress
    });

    if(params.to && params.method){
      const contractToken = _.find(token.list,(item)=>{
        return item.network === network.key && item.address === params.to
      });

      if(contractToken){
        this.props.actions.switchToken(contractToken.tokenId);
      }
      else{
        const address = params.to;

        TokenController.search(address).then((tokenData)=>{
          const {address,symbol,decimal} = tokenData;
          if(address && symbol && decimal){
            if(TokenController.exists({
              address:address
            })){
              this.props.onShowMsg(this.props.locale.token_exist,"error");
              return;
            }

            this.props.actions.createToken(
              TokenController.format(tokenData),
              {
                address:address
              }
            );
          }
        }).catch((error)=>{

        });
      }
    }
    else{
      if(baseToken && baseToken.tokenId !== token.current){
        this.props.actions.switchToken(baseToken.tokenId);
      }
    }

    if(params && params.from && params.gasLimit){
      TransactionController.getGasPrice().then((gasPrice)=>{

        this.setState({
          data:{
            ...params,
            ...{
              gasPrice
            }
          }
        });

        TransactionController.estimateGas({
          data:params.data
        }).then((estimateGas)=>{
          let gasLimit = estimateGas + Math.floor(_.random(30000,40000));

          this.setState({
            data:{
              ...params,
              ...{
                gasPrice,
                gasLimit
              }
            }
          });
        }).catch((error)=>{
          // this.sendMsg({
          //   "error":error.message
          // },true);
        });
      });
    }
  }

  sendMsg(data,triggerClose = false){
    if(extensionizer.storage){
      _.delay(()=>{
        popup.messageToContent({
          method:"you_sendTransaction",
          params:data
        });

        if(triggerClose){
          _.delay(()=>{
            popup.messageToContent({
              method:"close"
            });
          },500);
        }
      },500);
    }
  }

  onSubmit(){
    if(this.state.data){
      this.setState({
        loading:true
      });

      const {app:{network},account,token} = this.props.state;
      const {from,to,gasLimit,gasPrice,data,method,value} = this.state.data;
      const currentAccount = account.list[from];
      const currentToken = _.find(token.list,["tokenId",token.current]);

      TransactionController.getTransactionCount(currentAccount.address).then((nonce)=>{
        let tx = {
          nonce:nonce,
          from:currentAccount.address,
          gas:gasLimit,
          gasPrice:gasPrice,
          data:data
        };

        if(to){
          tx.to = to;
        }

        if(value && Math.abs(value) > 0){
          tx.value = toHex(toLu(value.toString(),"you"));
        }

        let transactionData = {};

        TransactionController.sign(tx,currentAccount.privateKey).then(async ({rawTransaction}) => {
          TransactionController.send(rawTransaction)
            .on('transactionHash', (hash) => {
              transactionData = {
                network:network.key,
                tokenId:currentToken.tokenId,
                accountAddress:currentAccount.address,
                contractAddress:currentToken.address,
                transactionHash:hash,
                from:currentAccount.address,
                to:to || "New Contract",
                gas:gasLimit,
                gasPrice:gasPrice,
                value:tx.value || 0,
                createdAt:Date.now(),
                status:configs.txStatus.Pending
              };

              if(method){
                transactionData.method = method;
              }

              this.props.actions.sendTransaction(transactionData,{from:"deploy"});

              this.sendMsg({
                "transactionHash":hash
              });
            })
            .on('receipt', (receipt) => {
              let receiptData = {
                transactionHash:receipt.transactionHash,
                blockHash:receipt.blockHash,
                blockNumber:receipt.blockNumber,
                cumulativeGasUsed:receipt.cumulativeGasUsed,
                gasUsed:receipt.gasUsed,
                transactionIndex:receipt.transactionIndex
              };

              if(parseInt(receipt.status)){
                receiptData.status = configs.txStatus.Success;
              }
              else{
                receiptData.status = configs.txStatus.Failed;
              }

              const sendData = {
                ...transactionData,
                ...receiptData
              };

              this.props.actions.receiptTransaction(sendData);

              if(currentToken.base){
                this.props.actions.getBalance({
                  accountAddress:currentAccount.address,
                  tokenId:token.current
                });
              }
              else{
                this.props.actions.getTokenBalance({
                  accountAddress:currentAccount.address,
                  tokenAddress:currentToken.address,
                  tokenId:token.current
                });
              }

              this.sendMsg({
                "receipt":JSON.stringify(receipt)
              },true);

              // this.sendMsg({
              //   "receipt":JSON.stringify({
              //       ...receipt,
              //       ...sendData
              //   })
              // },true);
            })
            .on('confirmation', (blockNumber, receipt) => {
              if(blockNumber === 1){
                this.props.actions.confirmTransaction({
                  transactionHash:receipt.transactionHash,
                  status:configs.txStatus.Confirmation
                });
              }

              this.sendMsg({
                "confirmation":`blockNumber ${blockNumber}`
              });
            })
            .on('error', (error) => {
              // this.sendMsg({
              //   "error":error.message
              // },true);
            })
            .catch((error)=>{
              if(transactionData.transactionHash){
                this.props.actions.failTransaction({
                  ...transactionData,
                  ...{
                    status:configs.txStatus.Failed,
                    reason:error.toString()
                  }
                });
              }

              this.sendMsg({
                "error":error.message
              },true);
            });
        }).catch((error)=>{
          this.sendMsg({
            "error":error.message
          },true);
        });
      });
    }
  }

  render() {
    const {params,state,locale,onRoute,actions,onShowMsg} = this.props;
    const {app:{usd},token} = this.props.state;
    const currentToken = _.find(token.list,["tokenId",token.current]);

    return (
      <section className="page-token">
        <Nav
          title={params && params.method ? params.method.toLocaleUpperCase() : locale.deploy_title}
        />
        {
          this.state.data ?
            <Result
              ref="result"
              state={state}
              locale={locale}
              onRoute={onRoute}
              actions={actions}
              data={this.state.data}
              onShowMsg={onShowMsg}
              onSubmit={this.onSubmit}
              onShowGas={()=>{
                this.setState({
                  gasModal:true
                });
              }}
            /> : null
        }
        {
          this.state.gasModal ?
            <Gas
              locale={locale}
              hideNum={true}
              usd={usd}
              gasLimit={currentToken.base ? configs.gasLimit.base : configs.gasLimit.token}
              token={currentToken}
              onDismiss={()=>{
                this.setState({
                  gasModal:false
                });
              }}
              onSave={(gas)=>{
                let newData = {...this.state.data};
                newData.gasPrice = toHex(toLu(gas.price.toString(),"glu"));
                newData.gasLimit = gas.limit;
                this.setState({
                  data:newData,
                  gasModal:false
                });
              }}
            /> : null
        }
        {
          this.state.loading ? <Loading/> : null
        }
      </section>
    );
  }
}