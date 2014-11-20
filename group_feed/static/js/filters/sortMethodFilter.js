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
        } else if (method === 'hot') {
            return sorted.sort(function (a, b) {
                if (score(a) < score(b))
                    return -1;
                if (score(b) > score(b))
                    return 1;
                return 0;
            });
        } else {
            throw new Error('invalid sort method');
        }
    };
    function score(link) {
        var gravity = 1.8;
        var timebase = 120;
        var points = Math.pow(link.score, 0.8);
        var now = new Date();
        var created = new Date(link.created_at);
        var diff = now.getTime() - created.getTime();
        var age = diff / 60;
        return points / Math.pow((age + timebase), gravity)
    }
});
