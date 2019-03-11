// https://qiita.com/OMOIKANESAN/items/3fa9c84b6d388b06e02e
// by @OMOIKANESAN

'use strict';
const fs = require("fs");
const env = fs.readFileSync("./.env",'utf8');
const lines = env.split("\n");

var SUBSCRIPTION_ENDPOINT;
var SUBSCRIPTION_AUTH;
var SUBSCRIPTION_P256DH;
var GCM_SERVER_KEY;

for(var i=0; i<lines.length; ++i){
  var text = lines[i];
  console.log("text : " + text);
  var x = text.match("SUBSCRIPTION_ENDPOINT=(.*)");
  if(x) SUBSCRIPTION_ENDPOINT = x[1];
  var x = text.match("SUBSCRIPTION_AUTH=(.*)");
  if(x) SUBSCRIPTION_AUTH = x[1];
  var x = text.match("SUBSCRIPTION_P256DH=(.*)");
  if(x) SUBSCRIPTION_P256DH = x[1];
  var x = text.match("GCM_SERVER_KEY=(.*)");
  if(x) GCM_SERVER_KEY = x[1];
};

console.log("SUBSCRIPTION_ENDPOINT : " + SUBSCRIPTION_ENDPOINT);
console.log("SUBSCRIPTION_AUTH : " + SUBSCRIPTION_AUTH);
console.log("SUBSCRIPTION_P256DH : " + SUBSCRIPTION_P256DH);
console.log("GCM_SERVER_KEY : " + GCM_SERVER_KEY);

const push = require('web-push');

const GCM_API_KEY = GCM_SERVER_KEY;
push.setGCMAPIKey(GCM_API_KEY);

const data = {
    'endpoint': SUBSCRIPTION_ENDPOINT,
    'userAuth': SUBSCRIPTION_AUTH,
    'userPublicKey': SUBSCRIPTION_P256DH
};

const pushSubscription = {
    endpoint: data.endpoint,
    keys: {
        auth: data.userAuth,
        p256dh: data.userPublicKey
    }
}

push.sendNotification(pushSubscription,'Hi! How are you?')
    .then(function(result) {
    console.log("success!");
        console.log(result);
    })
    .catch(function(err) {
    console.log("fail!");    
        console.error(err);
    });
