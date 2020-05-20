/**
 * Created by sean@ihuanqu.com on 2019/3/19.
 */
import React, {PureComponent} from 'react';

import Nav from "../../components/common/nav";
import Tab from "../../components/common/tab";

import Create from "../../components/app/account/create";
import Import from "../../components/app/account/import";

export default class Account extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      idx:0
    };

    this.onBack = this.onBack.bind(this);
    this.onChangeTab = this.onChangeTab.bind(this);
  }

  componentWillMount(){
    const {params} = this.props;

    if(params && params.idx){
      this.setState({
        idx:params.idx
      });
    }
  }

  onBack(){
    const {onRoute} = this.props;

    onRoute("dashboard");
  }

  onChangeTab(idx){
    this.setState({
      idx
    });
  }

  render() {
    const {state,locale,onRoute,actions,onShowMsg} = this.props;
    const {idx} = this.state;

    const tabs = [
      {
        title:locale.create
      },
      {
        title:locale.import
      }
    ];

    return (
      <section className="page-account">
        <Nav
          title={locale.account_new}
          onBack={this.onBack}
        />
        <Tab
          data={tabs}
          onChange={this.onChangeTab}
          defaultIdx={idx}
        />
        {
          idx === 0 ?
            <Create
              state={state}
              locale={locale}
              onRoute={onRoute}
              actions={actions}
              onShowMsg={onShowMsg}
            /> :
            <Import
              state={state}
              locale={locale}
              onRoute={onRoute}
              actions={actions}
              onShowMsg={onShowMsg}
            />
        }
      </section>
    );
  }
}