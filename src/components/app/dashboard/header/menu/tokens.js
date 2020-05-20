/**
 * Created by sean@ihuanqu.com on 2019/3/18.
 */
import "./tokens.less";
import _ from "lodash";
import React,{PureComponent} from 'react';
import Storage from "../../../../../common/storage";

import Token from "./token";

export default class Tokens extends PureComponent{
  constructor(props){
    super(props);
  }

  render(){
    const {locale,onRoute,actions,onDismiss} = this.props;
    const {app:{network,usd},token:{list},account} = this.props.state;
    const currentAccount = account.list[account.current];

    const data = _.filter(list,(item)=>{
      return item.network === network.key && currentAccount && item.accountAddress === currentAccount.address;
    });

    return (
      <section className="menu-tokens-wrapper">
        <ul>
          {
            data.map((item,key)=>{
              return <Token
                key={key}
                locale={locale}
                onRoute={onRoute}
                actions={actions}
                data={item}
                network={network}
                account={account}
                usd={usd}
                onDismiss={onDismiss}
              />
            })
          }
        </ul>
      </section>
    )
  }
}