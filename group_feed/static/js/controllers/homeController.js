function homeController($scope, $window, UserFactory, $http, AuthService) {
    $scope.linkPreview = true;
    $scope.createNewGroup = true;
    $scope.groupDescription = true;
    $scope.createNewLink = true;
    $scope.groupSearch = true;
    $scope.selectedGroup = true;
    $scope.currentUserInfo = [];
//    $scope.viewUserInfo = [];
    $scope.allLinks = [];
    $scope.groupLinks = [];
    $scope.allGroups = [];
    $scope.oneAtATime = true;
    $scope.sortBy = 'hot';
//    $scope.featuredLink = [];

//    $scope.newLinkDesc = '(Link Description)';

    $scope.linkSubmit = function () {
        // can just do $scope.createNewLink = !$scope.createNewLink to toggle inbetween
        // can also just do this inline in your angular view
        $scope.createNewLink = $scope.createNewLink != true;
    };

    $scope.showGroupSearch = function () {
        $scope.groupSearch = $scope.groupSearch != true;
    };

    $scope.previewLink = function () {
        $scope.linkPreview = $scope.linkPreview != true;
    };

    $scope.showCreateNewGroup = function () {
        $scope.createNewGroup = $scope.createNewGroup != true;
    };

    $scope.aboutMe = function () {
        $scope.userAbout = $scope.userAbout != true;
    };

//  CHECK IF A USER IS LOGGED IN
    if (typeof ($window.localStorage.username) === "undefined") {
        $scope.loginShow = false;
    }

    else {
        $scope.loggedInUser = $window.localStorage.username;
        $scope.loginShow = true;

        UserFactory.getCurrentUser($scope.loggedInUser, function(response) {
            $scope.currentUserInfo = response;
        });
    }

//  LOG IN AND SHOW USER INFO
    $scope.login = function () {
    var username = $scope.loginUsername;
    var password = $scope.loginPassword;

        if (username && password) {
            AuthService.login(username, password)
                .then(function () {
                    console.log('passed');
                    $scope.loggedInUser = $window.localStorage.username;
                    $scope.loginShow = true;

                    UserFactory.getCurrentUser($scope.loggedInUser, function(response) {
                        $scope.currentUserInfo = response;
                    });

                    $scope.getAllLinks();

                }, function () {
                    console.log('failed');
                });
        }
    };


//  SHOW ALL LINKS
    $scope.links = function () {
        $http.get('/links')
            .success(function (response) {
                $scope.allLinks = response;
            });
    };

    $scope.links();

//  ADD LINK
    $scope.newLink = function () {

        var data = {
            "title": $scope.newLinkTitle,
            "url": $scope.newLinkURL,
            "description": $scope.newLinkDesc,
            "group": $scope.newGroupChoice.id
        };

        console.log(data);

        $http.post('/links/', data)
            .success(function (newLink) {
                $scope.allLinks.unshift(newLink);
                console.log(newLink);
            });

        $scope.newLinkTitle = "";
        $scope.newLinkURL = "";
        $scope.newLinkDesc = "";
        $scope.newGroupChoice = "";
        $scope.linkPreview = true;
        $scope.createNewLink = true;

    };

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

    $scope.setActiveGroup = function (group) {
        $scope.activeGroup = group.title;
        console.log($scope.activeGroup.title);
    };

    $scope.setActiveUser = function (user) {
        console.log(user.submitter);
        var submitter = user.submitter;

        UserFactory.getCurrentUser(submitter, function (response) {
            console.log('factory worked');
            console.log(response);
            $scope.currentUserInfo = response;
        });
    };

    $scope.clearFilter = function () {
        $scope.activeGroup = "";
        $scope.getAllLinks();
    };

//  ADD GROUP
    $scope.newGroup = function () {

        var data = {
            "title": $scope.newGroupTitle,
            "description": $scope.newGroupDesc
        };

        console.log(data);

        $http.post('/groups/', data)
            .success(function (newGroup) {
                $scope.allGroups.push(newGroup);
            });

        $scope.newGroupTitle = "";
        $scope.newGroupDesc = "";
        $scope.createNewGroup = true;
    };

    // These API calls could be abstracted to be reusable
    // Only difference mostly is the ending part of the API call
    $scope.upVote = function (link) {
        $http.post('/links/' + link.id + '/upvote/', {})
            .success(function (response) {
                console.log('yay');
                console.log(response);
                $scope.links();
            })
            .error(function (err) {
                console.log(err)
            });
    };

    $scope.downVote = function (link) {
        $http.post('/links/' + link.id + '/downvote/', {})
            .success(function (response) {
                console.log('yay');
                console.log(response);
                $scope.links();
            })
            .error(function (err) {
                console.log(err)
            });
    };

    $scope.favorite = function (link) {
        $http.post('/links/' + link.id + '/favorite/', {})
            .success(function(response) {
                console.log(response);
                $scope.links();
            })
            .error(function (err) {
                console.log(err);
            })
    }

}
