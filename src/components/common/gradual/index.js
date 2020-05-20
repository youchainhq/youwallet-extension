import "./style.less";
import React,{PureComponent} from 'react';

export default class Gradual extends PureComponent{
  constructor(props){
    super(props);
  }

  render(){
    const {onUp,onDown} = this.props;

    return (
      <div className="gradual-wrapper">
        <a onClick={onUp}><i className="fa icon-arrow-up-o"/></a>
        <a onClick={onDown}><i className="fa icon-arrow-down-o"/></a>
      </div>
    )
  }
}