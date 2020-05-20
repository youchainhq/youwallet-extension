import extensionizer from 'extensionizer';

let popupScript;

try{
  popupScript = {
    port: extensionizer.runtime.connect({name: "popup"}),

    init(){
      this.bindListener();
    },

    bindListener() {
      // this.port.onMessage.addListener(msg => {
      //   return true;
      // });

      // this.port.onDisconnect.addListener(function(message) {
      //   console.log("Port disconnected: " + JSON.stringify(message));
      // });

      // document.addEventListener("DOMContentLoaded", function() {
      //   console.log("popup page loaded...")
      // });
    },

    messageToBackground(method,params){
      this.port.postMessage({
        src: "popup",
        dst:"background",
        method:method,
        params:params
      });
    },

    messageToContent(message, callback){
      extensionizer.tabs.query({active: true, currentWindow: true}, function(tabs){
        extensionizer.tabs.sendMessage(tabs[0].id, message, function(response){
          if(callback) callback(response);
        });
      });
    }
  };

  // popupScript.init();
}
catch (e) {

}

export default popupScript;