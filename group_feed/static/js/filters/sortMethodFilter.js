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



group_feed.filter('sortMethod', function () {
    return function (posts, method) {
        var sorted = posts.slice(0);
        if (!method || method === 'top') {
            return sorted.sort(function (a,b) {
                if (a.score > b.score)
                    return -1;
                if (a.score < b.score)
                    return 1;
                return 0;
            });
        } else if (method === 'recent') {
            return sorted.sort(function (a,b) {
                if (a.created_at > b.created_at)
                    return -1;
                if (a.created_at < b.created_at)
                    return 1;
                return 0;
            });
        } else {
            throw new Error('invalid sort method');
        }
    }
});
