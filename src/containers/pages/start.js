/**
 * Created by sean@ihuanqu.com on 2019/3/14.
 */
import React, {PureComponent} from 'react';
import configs from "../../common/configs";

import {Button} from "../../components/vendors";

export default class Start extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {locale,onRoute} = this.props;

    return (
      <section className="page-start">
        <img src={`${configs.imgPre}logo-lg.png?t=20191111`} className="logo"/>
        <article>
          <h1>{locale.welcome}</h1>
          <div>{locale.welcome_desc}</div>
        </article>
        <div className="action-wrapper">
          <Button
            type="default"
            text={locale.create_wallet}
            block={true}
            onClick={()=>{
              onRoute("password");
            }}
          />
          <a onClick={()=>{
            onRoute("reset",{
              from:"start"
            });
          }}>{locale.reset_wallet}</a>
        </div>
      </section>
    );
  }
}