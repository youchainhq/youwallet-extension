/**
 * Created by sean@ihuanqu.com on 2019/3/15.
 */
import "./style.less";
import React,{PureComponent} from 'react';

export default class Tab extends PureComponent{
  constructor(props){
    super(props);

    this.state = {
      idx:props.defaultIdx || 0
    };

    this.onTab = this.onTab.bind(this);
  }

  onTab(idx){
    this.setState({
      idx
    });

    const {onChange} = this.props;

    onChange && onChange(idx);
  }

  render(){
    const {data} = this.props;

    return (
      <ul className="tab-wrapper">
        {
          data.map((item,key)=>{
            return (
              <li key={key} className={key === this.state.idx ? "active" : ""}>
                <a onClick={()=>{
                  this.onTab(key);
                }}>{item.title}</a>
              </li>
            )
          })
        }
      </ul>
    )
  }
}