/**
 * Created by sean@ihuanqu.com on 2019/3/5.
 */
import React, {PureComponent} from 'react';

import Header from "../../components/app/dashboard/header";
import Account from "../../components/app/dashboard/account";
import Transaction from "../../components/app/dashboard/transaction";

export default class Dashboard extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {state,locale,actions,onRoute,onShowMsg} = this.props;
    const {account:{current}} = this.props.state;

    if(!current){
      return null;
    }

    return (
      <section className="page-dashboard">
        <Header
          state={state}
          locale={locale}
          actions={actions}
          onRoute={onRoute}
          onShowMsg={onShowMsg}
        />
        <Account
          state={state}
          locale={locale}
          onRoute={onRoute}
          actions={actions}
          onShowMsg={onShowMsg}
        />
        <Transaction
          state={state}
          locale={locale}
          onRoute={onRoute}
        />
      </section>
    );
  }
}