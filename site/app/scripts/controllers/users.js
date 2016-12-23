'use strict';
angular.module('siteSeedApp')
.controller('ListUserCtrl', function($scope, $stateParams, Users) {
    var page = $stateParams.page ? parseInt($stateParams.page) : 1,
        limit = $stateParams.limit ? parseInt($stateParams.limit) : 10;

    $scope.limit = limit;
    Users.list(page, limit).then(function(data){
        $scope.users = data.rows;
        $scope.count = data.count;
    });

    $scope.pageChanged = function() {
        Users.list($scope.current_page, limit).then(function(response){
            $scope.users = response.rows;
        });
    };

    $scope.forUnitTest = true;
})
.controller('HomeIndexCtrl', function($scope, Feeds, Files, Posts) {
    Feeds.list().then(function(res) {
        $scope.feeds = res.rows;
    });

    $scope.uploadData = Files.uploadData;
    $scope.uploadFiles = Files.uploadFilesOnce;

    $scope.createPost = function() {
        if ($scope.post) {
            var data = {
                postType: 'POST',
                content: $scope.post
            };
            if ($scope.uploadData.result) {
                data.fileId = $scope.uploadData.result.files[0].fileId;
                data.albumId = $scope.uploadData.result.albumId;
            }
            Posts.create(data).then(function() {
                $scope.post = null;
            });
        }
    };

})
.controller('HomeFollowerCtrl', function($scope, Followers) {
    Followers.list(1,10).then(function(res) {
        $scope.followers = res.rows;
    });
    $scope.follow = function(idx, userId) {
        Followers.create({followingId: userId}).then(function() {
            $scope.followers[idx].isFollowed = true;
        });
    };
    $scope.unfollow = function(idx, userId) {
        Followers.delete(userId).then(function() {
            $scope.followers[idx].isFollowed = false;
        });
    };
})
.controller('HomeFollowingCtrl', function($scope, Followers) {
    Followers.listFollowing(1,10).then(function(res) {
        $scope.followers = res.rows;
    });
})
.controller('HomeFindYourFriendCtrl', function($scope, Followers, Users) {
    Users.peopleYouMayKnow(1, 10).then(function(res) {
        $scope.friends = res.hits;
    });
    $scope.follow = function(idx, userId) {
        Followers.create({followingId: userId}).then(function() {
            $scope.friends[idx]._source.isFollowed = true;
        });
    };
    $scope.unfollow = function(idx, userId) {
        Followers.delete(userId).then(function() {
            $scope.friends[idx]._source.isFollowed = false;
        });
    };
})
.controller('UserDetailCtrl', function($scope, Users, $stateParams, Followers) {
    Users.getById($stateParams.userId).then(function(res) {
        $scope.user = res;
        $scope.follow = function() {
            Followers.create({followingId: $scope.user._id}).then(function() {
                $scope.user.isFollowed = true;
            });
        };
        $scope.unfollow = function() {
            Followers.delete($scope.user._id).then(function() {
                $scope.user.isFollowed = false;
            });
        };
    });
})
.controller('UserProfileCtrl', function($scope, Users, $cookies, $log) {
    var userInfo = $cookies.get('userInfo') || '{}';

    Users.getById(JSON.parse(userInfo).userId).then(function(res) {
        $scope.user = res;
    });

    $scope.updateProfile = function(){
        var userData = {
            firstname: $scope.user.firstname,
            lastname: $scope.user.lastname,
            username: $scope.user.username
        };
        Users.update($scope.user._id, userData).then(function(){
            $log.info('Update successfully!');
        });
    };
});
