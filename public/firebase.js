// Firebaseへの接続に必要なAPIキーその他の情報は
// Firebaseコンソールから取得する
// Androidアプリケーションでは google-services.json に相当する
// apiKeyが露出しているのは仕方ない。
// いわゆるクライアントシークレットが露出しているわけではない。
// ".read":true, ".write":true みたいな設定しちゃだめ。

var config = {
  apiKey: "AIzaSyA3HkRw5Sd8QexcQKea1fMCKE8pDxcS514",
  authDomain: "dashboard-52fd5.firebaseapp.com",
  databaseURL: "https://dashboard-52fd5.firebaseio.com",
  projectId: "dashboard-52fd5",
  storageBucket: "dashboard-52fd5.appspot.com",
  messagingSenderId: "920406529480"
};

firebase.initializeApp(config);

function onFirebaseHtmlLoaded(){
  
  firebase.auth().onAuthStateChanged(function(user){
    console.log("onAuthStateChanged");
    if(user){
      document.getElementById("firebase-user-email-verified").value = user.emailVerified;
      document.getElementById("firebase-user-is-anonymous").value = user.isAnonymous;
      document.getElementById("firebase-user-photo-url").setAttribute("src", user.photoURL);
      document.getElementById("firebase-user-email").value = user.email
      localStorage.setItem("firebase-user-email", user.email);
      document.getElementById("firebase-user-uid").value = user.uid
      localStorage.setItem("firebase-user-uid", user.uid);
      console.log(JSON.stringify(user.providerData));
      document.getElementById("firebase-user-display-name").value = user.displayName;
      document.getElementById("firebase-userdata-uid-path").innerText = "/userdata/" + user.uid + "/clipboard";
    } else {
      document.getElementById("firebase-user-email-verified").value = "";
      document.getElementById("firebase-user-is-anonymous").value = "";
      document.getElementById("firebase-user-photo-url").setAttribute("src", "");
      document.getElementById("firebase-user-email").value = "";
      document.getElementById("firebase-user-uid").value = "";
      document.getElementById("firebase-user-display-name").value = "";
    }
  });

  
  if(typeof google === "object") {
    google.script.run.withSuccessHandler(function(x){
      document.getElementById("firebase-service-account-access-type").value = x.access_type;
      document.getElementById("firebase-service-account-email").value = x.email;
      document.getElementById("firebase-service-account-scope").value = x.scope;
      document.getElementById("firebase-service-account-expires-in").value = x.expires_in;
    }).initServiceAccount();
  }//google
  
  var clipboard_path = "/userdata/" + localStorage.getItem("firebase-user-uid") + "/clipboard";
  var clipboard_ref = firebase.database().ref(clipboard_path);
  var clipboard_textarea = document.getElementById("firebase-database").nextElementSibling.nextElementSibling.getElementsByTagName("textarea")[0];
  var clipboard_input = clipboard_textarea.nextElementSibling;
  clipboard_ref.on("value", function(data_snapshot){
    var now = new Date();
    clipboard_input.value = now;
    clipboard_textarea.value = data_snapshot.val();
  });
  
  document.getElementById("sign-in-by-google").addEventListener("click", function(){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      console.log(result.credential.accessToken);
      document.getElementById("firebase-auth-log").value = JSON.stringify(result.user);
    }).catch(function(error) {
      document.getElementById("firebase-auth-log").value = JSON.stringify(error);
    });
  });
  
  document.getElementById("buttonFirebaseDatabaseWriteByUserAccount").addEventListener("click", function(){
    var x = clipboard_ref.set(clipboard_textarea.value);
    console.log(x);
  });
  
  document.getElementById("buttonFirebaseDatabaseWriteByServiceAccount").addEventListener("click", function(){
    if(typeof google === "object") {
      google.script.run.onFirebaseDatabaseWriteByServiceAccount(clipboard_path, clipboard_textarea.value);
    }
  });
  
  document.getElementById("buttonCreateUser").addEventListener("click", function(){
    var email = document.getElementById("firebase-user-email").value;
    console.log(email);
    var password = document.getElementById("firebase-user-password").value;
    console.log(password);
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function(x){
        document.getElementById("firebase-auth-log").value = x;
      }).catch(function(error) {
        document.getElementById("firebase-auth-log").value = error;
      });  
  });

  document.getElementById("buttonLogin").addEventListener("click", function(){
    var email = document.getElementById("firebase-user-email").value;
    var password = document.getElementById("firebase-user-password").value;
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(x){
      document.getElementById("firebase-auth-log").value = x;      
    }).catch(function(error) {
      document.getElementById("firebase-auth-log").value = error;
    });
  });  

  document.getElementById("buttonLogout").addEventListener("click", function(){
    firebase.auth().signOut().then(function(x){
      console.log(x);
      document.getElementById("firebase-auth-log").value = x;
    }).catch(function(error){
      console.log(error);
      document.getElementById("firebase-auth-log").value = error;
    });
  });

}//onFirebaseHtmlLoaded
