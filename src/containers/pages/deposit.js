/**
 * Created by sean@ihuanqu.com on 2019/3/20.
 */
import React, {PureComponent} from 'react';

import Nav from "../../components/common/nav";

import You from "../../components/app/deposit/you";

export default class Deposit extends PureComponent {
  constructor(props) {
    super(props);

    this.onBack = this.onBack.bind(this);
  }

  onBack(){
    const {onRoute} = this.props;

    onRoute("dashboard");
  }

  render() {
    const {state,locale} = this.props;

    return (
      <section className="page-deposit">
        <Nav
          title={locale.deposit_title}
          onBack={this.onBack}
        />
        <You
          locale={locale}
          state={state}
        />
      </section>
    );
  }
}