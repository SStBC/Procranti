function optionsController($scope) {
  var bg = chrome.extension.getBackgroundPage();
  $scope.obj = bg.obj;

  $scope.add = function() {
    if ($scope.host && $scope.curfew) {
      $scope.obj.entries.push({host: $scope.host, curfew: parseInt($scope.curfew, 10)}); // TODO: Handle parse errors
      $scope.host = null;
      $scope.curfew = null;
    }
  };

  $scope.setUserName = function() {
    chrome.storage.sync.set({'userName': $scope.userName}, function() {
      chrome.extension.sendMessage({do: 'reload'});
    });
  };

  $scope.save = function() {
    $('#btnSave').hide(); // TODO: Disable instead
    chrome.extension.sendMessage({do: 'save'});
  };

  $scope.remove = function(index) {
    $scope.obj.entries.splice(index, 1);
  };

  $scope.respond = function(request, sender, sendReponse) {
    if (request.do === 'saveCompleted') {
      $('#btnSave').show();
    } else if (request.do === 'reloadOptions') {
      $scope.obj = bg.obj;
      $scope.$apply();
    }
  };

  chrome.extension.onMessage.addListener($scope.respond);
};
