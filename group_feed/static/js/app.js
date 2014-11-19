var group_feed = angular.module('merge', ['ngRoute', 'ngCookies', 'ui.bootstrap']).run(function ($http, $cookies) {
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
});

group_feed.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/static/js/views/home.html',
            controller: homeController
        })
        .when('/profile', {
            templateUrl: '/static/js/views/profile.html',
            controller: profileController
        })
        .when('/link/:id', {
            templateUrl: '/static/js/views/link.html',
            controller: linkController
        })
        .when('/login', {
            templateUrl: '/static/js/views/login.html',
            controller: loginController
        })
        .when('/register', {
            templateUrl: '/static/js/views/register.html',
            controller: registerController
        })
}]);
