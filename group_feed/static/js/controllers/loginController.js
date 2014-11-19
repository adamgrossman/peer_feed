function loginController($scope, $location, AuthService) {
    $scope.login = function () {
        var username = $scope.loginUsername;
        var password = $scope.loginPassword;

        if (username && password) {
            AuthService.login(username, password)
                .then(function () {
                    $location.path('/');
                }, function () {
                    console.log('failed');
                });
        }
    };
}
