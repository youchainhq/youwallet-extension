import extensionizer from 'extensionizer';

const backgroundScript = {
  run(){
    this.bindListener();
    this.bindInstalled();
  },

  _save(data){
    extensionizer.storage.local.set({
      param:JSON.stringify(data)
    });
  },

  bindListener(){
    extensionizer.runtime.onConnect.addListener(port => {
      port.onMessage.addListener(msg => {
        if(msg.dst === "background"){
          if (msg.src === 'popup'){
            switch (msg.method) {
              case "redirect":
                window.open(msg.params.url);
                break;
            }
          }
          else if(msg.src === "contentScript"){
            switch (msg.method) {
              case "you_sendTransaction":
                this._save({
                  route:"deploy",
                  data:msg.params
                });
                break;
              case "you_requestAccounts":
                this._save({
                  method:msg.method,
                  data:msg.params
                });
                break;
              default:
                this._save({
                  method:msg.method,
                  data:msg.params
                });
                break;
            }
          }
        }

        return true;
      });
    });
  },

  bindInstalled(){
    //details.reason === 'install' || details.reason === 'update'
    extensionizer.runtime.onInstalled.addListener(function (details) {
      if (details.reason === 'install' || details.reason === 'update') {
        console.log("installed");
      }
    });
  }
};

backgroundScript.run();
