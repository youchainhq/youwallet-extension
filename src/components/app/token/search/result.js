/**
 * Created by sean@ihuanqu.com on 2019/3/19.
 */
import "./result.less";
import React,{PureComponent} from 'react';

import {Button} from "../../../../components/vendors"

export default class Result extends PureComponent{
  constructor(props){
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(){
    const {onRoute} = this.props;

    onRoute("dashboard");
  }

  render(){
    const {locale,data} = this.props;

    return (
      <div className="content-common-wrapper search-result-wrapper">
        <section>
          <section>
            <div>TOKEN</div>
            <div>{locale.balance}</div>
          </section>
          <section>
            {
              data.map((item,key)=>{
                return (
                  <div key={key}>
                    <section>
                      <img src={`https://uchainstatic.oss-cn-hangzhou.aliyuncs.com/dapps/images/income/${item.type.toLocaleLowerCase()}.png`}/>
                      <span>{item.name}</span>
                    </section>
                    <section>
                      0 {item.type}
                    </section>
                  </div>
                )
              })
            }
          </section>
        </section>
        <section>
          <Button
            text={locale.token_submit}
            block={true}
            onClick={this.onSubmit}
          />
        </section>
      </div>
    )
  }
}