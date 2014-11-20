function linkController($scope, $sce, $routeParams, $window, UserFactory, $http) {
    var linkID = $routeParams.id;
    $scope.writeComment = true;
    $scope.currentUserInfo = [];
    $scope.postedUserInfo = [];
    $scope.linkInfo = [];
    $scope.linkComments = [];

    $scope.showNewReply = function () {
        $scope.writeComment = $scope.writeComment != true;
        $scope.aboutPoster = $scope.aboutPoster != true;
//        $scope.aboutPoster = true;
    };


//  CHECK IF A USER IS LOGGED IN
    if (typeof ($window.localStorage.username) === "undefined") {
        $scope.loginShow = false;
    }

    else {
        $scope.loggedInUser = $window.localStorage.username;
        $scope.loginShow = true;

        UserFactory.getCurrentUser($scope.loggedInUser, function (response) {
            $scope.currentUserInfo = response;
        });
    }

    $scope.getSubmitterUser = function (user) {
        UserFactory.getCurrentUser(user, function (response) {
            $scope.postedUserInfo = response;
        });
    };

    $scope.getUserInfo = function (comment) {
        var submitter = comment.author;

        UserFactory.getCurrentUser(submitter, function (response) {
            console.log(response);
            $scope.postedUserInfo = response;
        });
    };

//  SHOW LINK INFO
    $http.get('/links/' + linkID + '/.json')
        .success(function (response) {
            var submitter = response.submitter;
            $scope.getSubmitterUser(submitter);
            $scope.linkComments = response.comments;
            $scope.currentLinkUrl = $sce.trustAsResourceUrl(response.url);
            $scope.linkInfo.push(response);
        });


    $scope.makeComment = function () {
        console.log(linkID);

        var user = $window.localStorage.user_id;

        var data = {
            "body": $scope.newCommentBody,
            "author": user,
            "link": parseInt(linkID)
        };

        console.log(data);

        $http.post('/comments/', data)
            .success(function (response) {
                console.log(response);
                response.author = $window.localStorage.username;
                $scope.linkComments.unshift(response);
                console.log('weeeeee');
                console.log(response);
            })
            .error(function (err) {
                console.log('aww');
                console.log(err);
            });

        $scope.newCommentBody = "";

    };


    $scope.makeChildComment = function (comment) {
        console.log(linkID);

        var user = $window.localStorage.user_id;

        var data = {
            "body": 'this is great!',
            "author": user,
            "link": parseInt(linkID),
            "parent": comment.id
        };

        console.log(data);

        $http.post('/comments/', data)
            .success(function (response) {
                console.log('weeeeee');
                console.log(response);
            })
            .error(function (err) {
                console.log('aww');
                console.log(err);
            })
    };

}


//
//
//    $scope.favorite = function (link) {
//        $http.post('/links/' + link.id + '/favorite/', {})
//            .success(function(response) {
//                console.log(response);
//                $scope.links();
//            })
//            .error(function (err) {
//                console.log(err);
//            })
//    };
//

