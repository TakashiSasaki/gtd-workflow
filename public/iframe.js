var iframe = document.getElementsByTagName("iframe")[0];
var contentWindow = iframe.contentWindow;
setTimeout(function(){
  contentWindow.postMessage("hello", "https://gtd-workflow.glitch.me/");
}, 200);