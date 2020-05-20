import "./style.less";
import React,{PureComponent} from 'react';
import classnames from 'classnames';

export default class Button extends PureComponent{
  constructor(props){
    super(props);
  }

  render(){
    const {
      type,
      text,
      block,
      disabled,
      onClick
    } = this.props;

    const container = classnames({
      'btn-wrapper':true,
    });

    const className = classnames({
      'btn': true,
      'btn-block': block,
      'btn-default':type === "default",
      'disabled':!!disabled
    });

    return (
      <div className={container}>
        <button
          type="button"
          className={className}
          disabled={disabled || false}
          onClick={onClick}
        >
          {text}
        </button>
      </div>
    )
  }
}