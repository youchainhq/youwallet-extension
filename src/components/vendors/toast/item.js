import './style.less';

import React,{PureComponent} from 'react';
import classnames from 'classnames';

export default class ToastItem extends PureComponent{
    constructor(props){
        super(props);

        this.state = {
            show:true,
            remove:false
        }
    }

    componentDidMount(){
        const {toast,remove,id} = this.props;

        const delay = toast.delay || 2500;
        const time = delay + 500;

        setTimeout(()=>{
            this.setState({
                show:false
            });
        },delay);

        setTimeout(()=>{
            this.setState({
                remove:true
            });

            remove(id);
        },time);
    }

    render(){
        const {toast} = this.props;

        const cns = ['toast-item','animated',{
            'fadeIn':this.state.show,
            'fadeOut':!this.state.show
        }];

        const className = classnames(cns,toast.type);

        return (
            this.state.remove ? null :
            <div className={className}>
                <i className={`fa icon-${toast.type}`}/>
                {toast.msg && <div>{toast.msg}</div>}
            </div>
        )
    }
}
