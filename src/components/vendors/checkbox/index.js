import "./style.less";
import React,{PureComponent} from 'react';

export default class Checkbox extends PureComponent{
  constructor(props){
    super(props);
  }

  render(){
    const {children,checked,onChange} = this.props;

    return (
      <div className="checkbox">
        <label>
          <input type="checkbox" checked={checked} onChange={()=>{
            onChange && onChange();
          }}/>
          <i className="input-helper"/>
          {children}
        </label>
      </div>
    )
  }
}