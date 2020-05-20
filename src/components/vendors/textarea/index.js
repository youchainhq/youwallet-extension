import "./style.less";
import React,{PureComponent} from 'react';
import classnames from 'classnames';

export default class TextArea extends PureComponent{
  constructor(props){
    super(props);

    this.state = {
      focus: false,
      error: false,
      warning: false,
      success: false,
      msg: ""
    };

    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onFocus(e) {
    e.preventDefault();
    this.setState({
      focus: true
    });
  }

  onBlur() {
    this.setState({
      focus: false
    });

    const { onBlur, onValidate } = this.props;

    if (onBlur) {
      onBlur();
    }

    if (onValidate) {
      let validate = onValidate();

      if (validate.ret) {
        this.setState({
          error: false,
          success: true
        });
      } else {
        this.setState({
          error: true,
          success: false,
          msg: validate.msg
        });
      }
    }
  }

  render(){
    const {
      title,
      rows,
      maxLength,
      placeholder,
      value,
      disabled,
      onChange
    } = this.props;

    const className = classnames({
      "form-textarea":true
    });

    return (
      <div className="form-group">
        {
          title ? <div className="form-title">{title}</div>:null
        }
        <textarea
          maxLength={maxLength}
          rows={rows || 1}
          disabled={!!disabled}
          className={className}
          placeholder={placeholder}
          value={value}
          onChange={onChange ? onChange : null}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          readOnly={onChange ? false : true}
        />
        {
          (this.state.error || this.state.warning) && this.state.msg ?
            <div className="form-help">{this.state.msg}</div>: null
        }
      </div>
    )
  }
}