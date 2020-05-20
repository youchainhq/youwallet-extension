import "./style.less";
import React,{PureComponent} from 'react';
import classnames from 'classnames';

export default class Input extends PureComponent{
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
      icon,
      type,
      accept,
      title,
      placeholder,
      value,
      textRight,
      disabled,
      onChange,
      onKeyUp
    } = this.props;

    const formClass = classnames({
      "form-group":true,
      "has-title":!!title,
      "has-icon":!!icon
    });

    const inputClass = classnames({
      "form-input":true,
      "text-right":!!textRight
    });

    let inputType = "text";
    if(type && type !== "file"){
      inputType = type;
    }

    return (
      <div className={formClass}>
        {
          title ? <div className="form-title">{title}</div>:null
        }
        {
          icon ? <i className={`fa icon-${icon}`}/> : null
        }
        <input
          type={inputType}
          disabled={!!disabled}
          className={inputClass}
          placeholder={placeholder}
          value={value}
          onChange={onChange && type !== "file" ? onChange : null}
          onKeyUp={onKeyUp ? onKeyUp : null}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          readOnly={onChange ? false : true}
        />
        {
          type === "file" ?
            <input
              type="file"
              className="file-input"
              onChange={onChange}
              accept={accept}
            /> : null
        }

        {
          (this.state.error || this.state.warning) && this.state.msg ?
            <div className="form-help">{this.state.msg}</div>: null
        }
      </div>
    )
  }
}