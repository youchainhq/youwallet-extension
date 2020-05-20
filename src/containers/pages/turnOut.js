
import _ from "lodash";
import React, {PureComponent} from 'react';
import {toLu,toHex} from "youchain-utils";
import configs from "../../common/configs";
import TransactionController from "../../controllers/transaction";
import TokenController from "../../controllers/token";

import Nav from "../../components/common/nav";
import Tip from "../../components/common/tip";

import Form from "../../components/app/turnOut/form";
import Result from "../../components/app/turnOut/result";
import Gas from "../../components/app/turnOut/form/gas";

export default class TurnOut extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data:null,
      gasModal:false,
      num:0,
      gas:null
    };

    this.onBack = this.onBack.bind(this);
    this.onSetResult = this.onSetResult.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    const {params} = this.props;

    if(params && params.to && params.num && params.gasPrice && params.gasLimit){
      this.onSetResult(params);
    }
  }

  onBack(){
    const {onRoute} = this.props;
    const {data} = this.state;

    if(data){
      this.setState({
        data:null
      });
    }
    else{
      onRoute("dashboard");
    }
  }

  onSetResult(data){
    this.setState({
      data
    });
  }

  onSubmit(){
    if(this.state.data){
      const {app:{network},account,token} = this.props.state;
      const {to,num,gasPrice,gasLimit} = this.state.data;
      const currentAccount = account.list[account.current];
      const currentToken = _.find(token.list,["tokenId",token.current]);

      let data = {
        gasPrice:toHex(toLu(gasPrice.toString(),"glu")),
        gas:gasLimit,
        from:currentAccount.address,
        to:to,
        value:toHex(toLu(num.toString(),"you"))
      };

      let tx = {};

      if(currentToken.base){
        tx = {
          gas:data.gas,
          gasPrice:data.gasPrice,
          to:data.to,
          value:data.value
        }
      }
      else{
        tx = {
          from:data.from,
          to:currentToken.address,
          gas:data.gas,
          gasPrice:data.gasPrice,
          value:'0x00',
          data: TokenController.getContractData({
            address:currentToken.address,
            decimal:parseInt(currentToken.decimal),
            toAddress:data.to,
            value:num
          })
        }
      }

      let transactionData = {};

      // console.log('transaction data ###',tx);

      TransactionController.sign(tx,currentAccount.privateKey).then(async ({rawTransaction}) => {
        TransactionController.send(rawTransaction)
          .on('transactionHash', (hash) => {
            // console.log('transactionHash', hash);
            transactionData = {
              network:network.key,
              tokenId:currentToken.tokenId,
              accountAddress:currentAccount.address,
              contractAddress:currentToken.address,
              transactionHash:hash,
              from:data.from,
              to:data.to,
              gas:data.gas,
              gasPrice:data.gasPrice,
              value:data.value,
              createdAt:Date.now(),
              status:configs.txStatus.Pending
            };

            this.props.actions.sendTransaction(transactionData);
          })
          .on('receipt', (receipt) => {
            // console.log('receipt', receipt);

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

            this.props.actions.receiptTransaction({
              ...transactionData,
              ...receiptData
            });

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
          })
          .on('confirmation', (blockNumber, receipt) => {
            // console.log('blockNumber', blockNumber);

            if(blockNumber === 1){
              this.props.actions.confirmTransaction({
                transactionHash:receipt.transactionHash,
                status:configs.txStatus.Confirmation
              });
            }
          })
          .on('error', (error) => {
            console.log('error', error);
          })
          .catch((error)=>{
            console.log('error',error);
            if(transactionData.transactionHash){
              this.props.actions.failTransaction({
                ...transactionData,
                ...{
                  status:configs.txStatus.Failed,
                  reason:error.toString()
                }
              });
            }
          });
      }).catch((error)=>{
        console.log('error',error);
      });
    }
  }

  render() {
    const {state,locale,language,onRoute,actions,onShowMsg} = this.props;
    const {app:{usd},token} = this.props.state;
    const currentToken = _.find(token.list,["tokenId",token.current]);

    return (
      <section className="page-token">
        <Nav
          title={`${locale.turnOut_title} ${currentToken.symbol}`}
          onBack={this.onBack}
        />
        {
          this.state.data ? null : <Tip
            text={locale.turnOut_tip({'value':currentToken.symbol})}
          />
        }

        {
          this.state.data ?
            <Result
              state={state}
              locale={locale}
              onRoute={onRoute}
              actions={actions}
              data={this.state.data}
              onShowMsg={onShowMsg}
              onSubmit={this.onSubmit}
            /> :
            <Form
              ref="form"
              state={state}
              locale={locale}
              language={language}
              onRoute={onRoute}
              actions={actions}
              onShowMsg={onShowMsg}
              onSubmit={this.onSetResult}
              onShowGas={(num)=>{
                this.setState({
                  gasModal:true,
                  num:num
                });
              }}
            />
        }
        {
          this.state.gasModal ?
            <Gas
              locale={locale}
              num={this.state.num}
              usd={usd}
              gasLimit={currentToken.base ? configs.gasLimit.base : configs.gasLimit.token}
              token={currentToken}
              onDismiss={()=>{
                this.setState({
                  gasModal:false
                });
              }}
              onSave={(data)=>{
                this.refs.form.setData(data);
                this.setState({
                  gasModal:false
                });
              }}
            /> : null
        }
      </section>
    );
  }
}