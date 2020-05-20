
const injectScript = {
  init(){
    this._callbacks = {};

    document.addEventListener("keydown",(event)=>{
      if(event.keyCode === 27) {
        this._send("close");
      }
    });

    this.bindListener();
  },

  bindListener(){
    window.addEventListener("message", (event)=> {
      const msg = event.data;
      if(msg && msg.src === "contentScript" && msg.dst === "inject"){
        if(this._callbacks[msg.method]){
          this._callbacks[msg.method](msg.params);
        }

        if(msg.method === "switch_network"){
          const host = window.location.host;
          if(host === "ide.iyouchain.com"){
            const protocol = msg.params.provider && /^(https:\/\/?(.*))$/.test(msg.params.provider) ? "https:":"http:";
            window.location.href = `${protocol}//${host}`;
          }
        }
      }
    });
  },

  _send(method,params){
    return new Promise(()=>{
      if(params && params.callback){
        this._callbacks[method] = params.callback;
      }

      let data = {
        src:"inject",
        dst:"contentScript",
        method:method
      };

      if(params){
        delete params["callback"];
        data.params = params;
      }

      window.postMessage(data);
    })
  },

  async send(method, params) {
    if(method){
      return this._send(method,params);
    }
    // switch (method) {
    //   case "open":
    //   case "close":
    //   case "you_requestAccounts":
    //   case "you_sendTransaction":
    //     return this._send(method,params);
    //   default:
    //     return this._send(method,params);
    // }
  }
};

injectScript.init();

window.youchain = injectScript;
window.youchain.isYOUWallet = true;