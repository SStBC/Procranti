chrome.extension.sendMessage({do: 'check', data: {location: window.location}}, function(response) {
  console.log('Reponse: ', response);
  if (response.block) {
    cancelLoad();
  }
});

function cancelLoad() { // TODO
  window.stop();
  document.write("<body style=\"background: -webkit-gradient(linear, left top, right bottom, color-stop(0%,#b5bdc8), color-stop(36%,#828c95), color-stop(100%,#28343b));\"><div style=\"font-family: serif; font-size: 250px; text-shadow: 8px 7px 10px #445; color: whitesmoke; font-variant: small-caps; letter-spacing: -4px; margin-left: 60px;\">Procranti</div></body>");
}
