var originalSetItem = localStorage.setItem;
localStorage.setItem = function(k,v) {
  //console.log("setItem called");
  var event = new Event('setItem');
  event.key = k;
  event.oldValue = localStorage.getItem(k);
  event.newValue = v;
  window.dispatchEvent(event);
  originalSetItem.apply(this, arguments);
}
