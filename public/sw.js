//サービスワーカーを記述するファイル sw.js

//キャッシュにはキャッシュ名が付けられる。
//あるキャッシュ名でキャッシュされた情報はブラウザ側に存在する限り二度と読み込まれない。
//キャッシュする情報が変わるたびに CACHE_NAME も変える。
//バージョン番号をつけて管理するのも良い方法の一つである。
var CACHE_NAME = 'gtd-workflow-0.1.2';

var urlsToCache = [
  //'/',
  '/manifest.json',
  //'/index.html',
  //'/firebase.html',
  '/firebase-config.js',
  //'/pwa.js',
  'sw.js',
  //'/style.css',
  //'https://www.gstatic.com/firebasejs/5.8.0/firebase.js',
  "/firebase-5.8.0.js",
  "https://unpkg.com/hammerjs@2.0.8/hammer.min.js",
  "https://unpkg.com/muuri@0.7.1/dist/muuri.min.js",
  "https://unpkg.com/bootstrap@4.3.1/dist/css/bootstrap-reboot.css"
];

self.addEventListener('install', function(event) {
  console.log("'install' event is fired.");
  event.waitUntil(self.skipWaiting());
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    }).catch(function(e){
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log("'activate' event is fired.");
  event.waitUntil(
    //現在キャッシュされているもののキャッシュ名の一覧を得て古いものは破棄
    caches.keys().then(function(cacheNames) {
      return Promise.all(cacheNames.map(function(cacheName) {
        if ([CACHE_NAME].indexOf(cacheName) === -1) {
          return caches.delete(cacheName);
        }
      }));
    }).catch(function(e){console.log(e);})
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    //リクエストされたものがキャッシュの中にあればレスポンス返す
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    ).catch(function(e){
        console.log(e);
    })
  );
});

self.addEventListener("push", function(event) {
  console.log(event.data.text());
  event.waitUntil(
    self.registration.pushManager.getSubscription()
      .then(function(subscription) {
        if (subscription) {
          return subscription.endpoint;
        } else {
          throw new Error('user has not subscribed')
        }
    })
    .then(function(res) {
      return fetch('/notification.json')
    })
    .then(function(res) {
      if (res.status === 200) {
        return res.json()
      }
      throw new Error('notification api response error')
    })
    .then(function(res) {
      return self.registration.showNotification(res.title, {
        icon: res.icon,
        body: event.data.text()
      })
    })
  )
})

// firebaseのトークンを取得して resolve する Promise
// 例外が発生した時は reject が呼ばれる
const getIdToken = ()=> {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user)=> {
      unsubscribe();
      if(user) {
        // サインイン済み
        user.getIdToken().then((idToken) => {
          // サインイン済みでトークンが取れた
          resolve(idToken);
        }, (error)=>{
          // サインイン済みだけどトークンが取れなかった
          resolve(null);
        });
      } else {
        // サインインしていない状態
        resolve(null);
      }
    });
  });
};
