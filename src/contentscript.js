import extensionizer from 'extensionizer';

const contentScript = {
  port:extensionizer.runtime.connect({name: "contentScript"}),

  init(){
    this.bindListener();
    this.inject();
  },

  bindListener(){
    //收消息
    extensionizer.runtime.onMessage.addListener(msg => {
      if(msg.method === "close"){
        this.close();
      }
      else{
        window.postMessage({
          src:"contentScript",
          dst:"inject",
          method:msg.method,
          params:msg.params
        });
      }

      return true;
    });

    window.addEventListener("message", (event)=> {
      const msg = event.data;
      if(msg && msg.dst === "contentScript"){
        switch (msg.method) {
          case "open":
            this.open();
            break;
          case "close":
            this.close();
            break;
          default:
            this.open(()=>{
              this.port.postMessage(
                {
                  src:"contentScript",
                  dst:"background",
                  method:msg.method,
                  params:msg.params || null
                }
              );
            });
            break;
        }
      }
    });
  },

  open(callback){
    const container = (document.body || document.documentElement);

    if(container.querySelector("iframe.you-extension-iframe")){
      container.querySelector("iframe.you-extension-iframe").remove();
    }
    else{
      const iframe = document.createElement('iframe');
      iframe.src = extensionizer.extension.getURL('index.html');
      iframe.className = "you-extension-iframe";

      iframe.onload = ()=>{
        callback && callback();
      };

      container.appendChild(iframe);
    }
  },

  close(){
    const container = (document.body || document.documentElement);

    if(container.querySelector("iframe.you-extension-iframe")){
      container.querySelector("iframe.you-extension-iframe").remove();
    }
  },

  inject(){
    const script = document.createElement('script');
    script.src = extensionizer.extension.getURL('scripts/inject.js');

    const style = document.createElement('link');
    style.rel = "stylesheet";
    style.href = extensionizer.extension.getURL('styles/inject.css');

    script.onload = function() {
      this.parentNode.removeChild(this);
    };

    (document.head || document.documentElement).appendChild(style);
    (document.head || document.documentElement).appendChild(script);
  }
};

contentScript.init();
