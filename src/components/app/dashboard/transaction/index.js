/**
 * Created by sean@ihuanqu.com on 2019/3/15.
 */
import "./style.less";
import _ from "lodash";
import React,{PureComponent} from 'react';
import Storage from "../../../../common/storage";
import Empty from "../../../../components/common/empty";
import Item from "./item";

export default class Transaction extends PureComponent{
  constructor(props){
    super(props);
  }

  filterList(data){
    const {account,token} = this.props.state;
    const currentAccount = account.list[account.current];
    const currentToken = _.find(token.list,["tokenId",token.current]);

    if(data){
      return _.filter(data,(item)=>{
        return item.tokenId === currentToken.tokenId && currentAccount && item.accountAddress === currentAccount.address
      });
    }

    return [];
  }

  render(){
    const {locale} = this.props;
    const {app:{network,usd},token,transaction:{list,pending}} = this.props.state;
    const currentToken = _.find(token.list,["tokenId",token.current]);

    let data = [
      ...this.filterList(list),
      ...this.filterList(pending)
    ];

    return (
      <div className="dashboard-transaction-wrapper">
        <section className="title">
          {_.isEmpty(data) ? locale.transactions : `${locale.transactions_queue}(${data.length})`}
        </section>
        <section className="body">
          {
            _.isEmpty(data) ?
              <Empty>{locale.transactions_empty}</Empty> :
              _.orderBy(data,["createdAt"],["desc"]).map((item,key)=>{
                return (
                  <Item
                    key={key}
                    usd={usd}
                    network={network}
                    token={currentToken}
                    data={item}
                    locale={locale}
                  />
                )})
          }
        </section>
      </div>
    )
  }
}