//サービスワーカー sw.js を登録する
//index.html において script タグでこのファイル pwa.js を読み込みむ。
//ChromeでF12キーを押下して開く Chrome Dev Tools などで確認する。
//navigator.serviceWorker.register('/sw.js').then(function() {
//  console.log('サービスワーカー登録成功');
//}).catch(function(err) {
//  console.log('サービスワーカー登録失敗', err);
//});

window.addEventListener('load', function() {
  if ('serviceWorker' in navigator) {
    console.log("registering service worker /sw.js .");
    navigator.serviceWorker.register("/sw.js");
    console.log("service worker has been registered.");
    
    
    // for push notification via GCM
    navigator.serviceWorker.ready.then(function(registration){
      if(localStorage.getItem("unsubscribe") === "yes") {
        registration.pushManager.getSubscription().then(function(subscription){
          if(subscription) {
            return subscription.unsubscribe();
          }
        }).then(function(){
          localStorage.removeItem("unsubscribe");          
        }).catch(function(){
          localStorage.removeItem("unsubscribe");
        });
      }; // unsubscribe existing subscription
      
      console.log('getting subscription ... ');
      return registration.pushManager.subscribe({
        userVisibleOnly: true
      });
    }).then(function(subscription){
      localStorage.setItem("subscription.endpoint", subscription.endpoint);
      console.log("subscription.endpoint : " + subscription.endpoint);
      var auth = btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth'))));
      localStorage.setItem("subscription.auth", auth);
      console.log("subscription.auth : " + auth);
      var p256dh = btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh'))));
      localStorage.setItem("subscription.p256dh", p256dh);
      console.log("subscription.p256dh : " + p256dh);
    }).catch(function(e){
      console.log(e.message);
      localStorage.setItem("unsubscribe", "yes");
    });
  } else {
    console.log("This browser does not support service worker.");
    return;
  }
  
});//addEventListener
