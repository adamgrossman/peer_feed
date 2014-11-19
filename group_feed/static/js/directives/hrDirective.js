group_feed.directive('divider', function () {
    return {
        restrict: 'E',
        compile: function(element) {
            element.addClass('hr-divider');
        }
    }
});
