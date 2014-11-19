function linkController($scope, $sce, $routeParams, $window, UserFactory, $http) {
    console.log('link');
    var linkID = $routeParams.id;

    $scope.currentUserInfo = [];
    $scope.linkInfo = [];
    $scope.linkComments = [];

//  CHECK IF A USER IS LOGGED IN
    if (typeof ($window.localStorage.username) === "undefined") {
        console.log('not logged in');
        $scope.loginShow = false;
    }

    else {
        $scope.loggedInUser = $window.localStorage.username;
        console.log('logged in');
        $scope.loginShow = true;

        UserFactory.getCurrentUser($scope.loggedInUser, function(response) {
            console.log('factory worked');
            console.log(response);
            $scope.currentUserInfo = response;
        });
    }

//  SHOW LINK INFO
    $http.get('/links/' + linkID + '/.json')
        .success(function (response) {
            console.log(response.comments);
            $scope.linkComments = response.comments;
            $scope.currentLinkUrl = $sce.trustAsResourceUrl(response.url);
            $scope.linkInfo.push(response);
        });

}
