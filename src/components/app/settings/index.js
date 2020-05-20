/**
 * Created by sean@ihuanqu.com on 2019/3/21.
 */
import "./style.less";
import React,{PureComponent} from 'react';

import Tab from "../../../components/common/tab";
import SetUp from "./setup";
import Info from "./info";

export default class Settings extends PureComponent{
  constructor(props){
    super(props);

    this.state = {
      idx:0
    };

    this.onChangeTab = this.onChangeTab.bind(this);
  }

  onChangeTab(idx){
    this.setState({
      idx
    });
  }

  render(){
    const {locale,onRoute,actions,defaultLanguage,onDismiss,onShowMsg,setLanguage} = this.props;
    const {account} = this.props.state;
    const currentAccount = account.list[account.current];

    const {idx} = this.state;

    const tabs = [
      {
        title:locale.setting
      },
      {
        title:locale.info
      }
    ];

    return (
      <section className="page-settings">
        <div className="header">
          <Tab
            data={tabs}
            onChange={this.onChangeTab}
          />
          <a onClick={()=>{
            onDismiss && onDismiss();
          }}><i className="fa icon-close"/></a>
        </div>
        <div className="body">
          {
            idx === 0 ?
              <SetUp
                data={currentAccount}
                defaultLanguage={defaultLanguage}
                locale={locale}
                actions= {actions}
                onRoute={onRoute}
                onShowMsg={onShowMsg}
                setLanguage={setLanguage}
              /> :
              <Info
                locale={locale}
                onRoute={onRoute}
              />
          }
        </div>
      </section>
    )
  }
}