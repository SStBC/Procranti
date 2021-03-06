var userName = ''; 
var uniqueAppId = '3a51d153-ad33-45db-bc2d-31844bdfa262';
var key = function() { return uniqueAppId + userName; };
var obj = {};

function initialize() {
  chrome.storage.sync.get('userName', function(data) {
    obj = {};
    obj.entries = [];
    console.log('Got user name', data);
    userName = data.userName;
    loadSettings();
  });
}

function saveSettings() { // TODO: Openkeyval isn't necesary, use chrome.storage
  $.ajax({
    url: "https://secure.openkeyval.org/store/",
    data: key() + '=' + JSON.stringify(obj),
    dataType: "jsonp",
    success: function(data){
      console.log("Saved ", data);
      chrome.extension.sendMessage({do: 'saveCompleted'});
    }
  });
}

function loadSettings() {
  $.ajax({
    url: 'https://secure.openkeyval.org/' + key(),
    dataType: "jsonp",
    success: function(data){
      var parsed = JSON.parse(data);
      console.log('Got settings', parsed);
      if (parsed !== null) {
        obj = parsed;
      }
      chrome.extension.sendMessage({do: 'reloadOptions'});
    }
  });
};

// TODO: Change curfew unit to minutes
//var obj = { // Initializer values
//  entries: [
//    {host: 'news.ycombinator.com', curfew: 30*60000},
//    {host: 'www.reddit.com', curfew: 30*60000}
//  ]
//};

function respond(request, sender, sendResponse) {
  if (request.do === 'save') {
    saveSettings();
    sendResponse(true); // TODO
  }
  else if (request.do === 'check') {
    sendResponse(isVisitAllowed(request.data.location, sendResponse));
  }
  else if (request.do === 'reload') {
    initialize();
    sendResponse(true); // TODO
  }
};


function isVisitAllowed(location, sendResponse) {
  var shouldBlock = false;
  for (var i = 0; i < obj.entries.length; i++) {
    var entry = obj.entries[i];
    if (entry.host == location.href) {
      if (entry.lastVisit == null) {
        entry.lastVisit = new Date().getTime();
      } else {
        if (new Date(entry.lastVisit + entry.curfew) > new Date().getTime()) {
          shouldBlock = true;
        } else {
          entry.lastVisit = new Date().getTime();
        }
      }
    }
  }
  console.log('Sending', shouldBlock);
  return {block: shouldBlock};
};

chrome.extension.onMessage.addListener(respond);
chrome.browserAction.onClicked.addListener(function(tab) {chrome.tabs.create({url: "options.html"});});

initialize();
