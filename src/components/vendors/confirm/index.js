import "./style.less";
import React,{PureComponent} from 'react';

import Button from "../button";

export default class Confirm extends PureComponent{
  constructor(props){
    super(props);
  }

  render(){
    const {
      title,
      onCancel,
      onConfirm,
      cancelText,
      confirmText,
    } = this.props;

    return (
      <div className="confirm">
        <div className="mask"/>
        <div className="dialog">
          <div className="body">
            {
              title &&  <div className="title">{title}</div>
            }
            {
              <div className="footer">
                {
                  onCancel ?
                    <Button
                      text={cancelText || "取消"}
                      type="default"
                      onClick={onCancel}
                    /> : null
                }
                {
                  onConfirm ?
                    <Button
                      text={confirmText || "确认"}
                      onClick={onConfirm}
                    /> : null
                }
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}