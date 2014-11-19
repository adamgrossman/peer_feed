group_feed.factory('UserFactory', function ($http) {
    return {

        currentMember: [],

        //    Get User
        getCurrentUser: function (user, callback) {
            return $http.get('/members/?username=' + user)
                .success(function(response) {
                    callback(response);
                })
                .error(function (err) {
                console.log(err);
            });
//        },

//        viewUser: function (userName, callback) {
//            return $http.get('/members/?username=' + userName)
//                .success(function(response) {
//                    console.log(response);
//                    callback(response);
//                })
//                .error(function (err) {
//                console.log(err);
//            });
        }
    }
});

