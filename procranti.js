chrome.extension.sendMessage({do: 'check', data: {location: window.location}}, function(response) {
  console.log('Reponse: ', response);
  if (response.block) {
    cancelLoad();
  }
});

function cancelLoad() { // TODO
  window.stop();
  document.write("<div style=\"font-family: 'Open sans',sans-serif; font-size: 170px;\">Procranti</div>");
}
