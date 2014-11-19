/**
 * Created by Adam on 11/18/14.
 */
//angular.module('merge')
//.filter('sortMethod', function () {
//        return function (posts, method) {
//            if (!method) {
//                return posts;
//            }
//            if (method === 'top') {
//                return posts.sort(function (a, b) {
//                    return a.score > b.score;
//                });
//            } else if (method === 'recent') {
//                return posts.sort(function (a, b) {
//                    return a.created_at < b.created_at;
//                });
//            } else {
//                throw new Error('invalid sort method');
//            }
//        }
//    })



angular.module('merge')
.filter('sortMethod', function () {
    return function (posts, method) {
        if (!method || method === 'top') {
            return posts.sort(function (a, b) {
                return a.score < b.score;
            });
        } else if (method === 'recent') {
            return posts.sort(function (a, b) {
                return a.created_at < b.created_at;
            });
        } else {
            throw new Error('invalid sort method');
        }
    }
});
