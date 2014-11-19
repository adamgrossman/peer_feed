function profileController($scope, UserFactory, $http) {

    $scope.currentUserInfo = [];
    $scope.allLinks = [];
    $scope.groupLinks = [];
    $scope.allGroups = [];

//  SHOW ALL LINKS
    $http.get('/links')
        .success(function (response) {
            console.log(response);
            $scope.allLinks = response;
        });

//  SHOW ALL GROUPS
    $scope.getAllLinks = function () {
        $scope.showAllLinks = false;
        $scope.showGroupLinks = false;
        $http.get('/groups')
            .success(function (response) {
                $scope.allGroups = response;
            });
    };

    $scope.getAllLinks();

    $scope.getGroupLinks = function(group) {
        var groupId = group.id;
        $scope.showAllLinks = true;
        $scope.showGroupLinks = true;
        $http.get('/groups/' + groupId + '/.json')
            .success(function (response) {
            $scope.groupLinks = response.links;
        });
    };

}



