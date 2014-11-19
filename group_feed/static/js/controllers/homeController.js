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
    $scope.sortBy = 'top';
//    $scope.featuredLink = [];

//    $scope.newLinkDesc = '(Link Description)';

    $scope.linkSubmit = function () {
        if($scope.createNewLink == true){
            $scope.createNewLink = false;
//            $scope.userAbout = true;
        }
        else {
            $scope.createNewLink = true;
//            $scope.userAbout = false;
        }
    };

    $scope.showGroupSearch = function () {
        if($scope.groupSearch == true){
            $scope.groupSearch = false;
//            $scope.userAbout = true;
        }
        else {
            $scope.groupSearch = true;
//            $scope.userAbout = false;
        }
    };

//    $scope.aboutMe = function () {
//        if($scope.createNewLink == false){
//            $scope.createNewLink = true;
//        }
//
//        if($scope.userAbout == true){
//            $scope.userAbout = false;
//            $scope.createNewLink = true;
//        }
//        else {
//            $scope.userAbout = true;
//            $scope.createNewLink = true;
//        }
//    };


    $scope.previewLink = function () {
        if($scope.linkPreview == true){
            $scope.linkPreview = false;
        }
        else {
            $scope.linkPreview = true;
        }
    };

    $scope.showCreateNewGroup = function () {
        if($scope.createNewGroup == true){
            $scope.createNewGroup = false;
        }
        else {
            $scope.createNewGroup = true;
        }
    };

    $scope.aboutMe = function () {
        if($scope.userAbout == true){
            $scope.userAbout= false;
        }
        else {
            $scope.userAbout = true;
        }
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

//  USER PHOTO
//    var host = 'http://127.0.0.1:8000/';

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

//    $scope.getGroupLinks = function(group) {
//        var groupId = group.id;
//        $scope.showAllLinks = true;
//        $scope.showGroupLinks = true;
//        $http.get('/groups/' + groupId + '/.json')
//            .success(function (response) {
//            $scope.groupLinks = response.links;
//        });
//    };

    $scope.setActiveGroup = function (group) {
        $scope.activeGroup = group.title;
        console.log($scope.activeGroup.title);
//        $scope.allGroups.isShown = null;
//        $scope.group.isShown = true;
    };

    $scope.setActiveUser = function (user) {
        console.log(user.submitter);
        var submitter = user.submitter;

        UserFactory.getCurrentUser(submitter, function (response) {
            console.log('factory worked');
            console.log(response);
            $scope.currentUserInfo = response;

//        });

        });

//        if(this.selectedGroup == true){
//            this.selectedGroup = false;
//            this.groupDescription = false;
//        }
//        else {
//            this.selectedGroup = true;
//            this.groupDescription = true;
//        }
    };


//    $scope.setActiveView = function (group) {
//        $scope.activeGroup = group.title;
//        console.log($scope.activeGroup.title);
//    };

//
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
