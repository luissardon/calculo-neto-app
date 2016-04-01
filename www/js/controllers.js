angular.module('starter.controllers', [])

    .controller('ProfileCtrl', function($scope, $window, Profile, Amounts, Pensions) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        // $scope.$on('$ionicView.enter', function(e) {
        // });
        //

        this.getPensions = Pensions.getData;
        this.getProfile = Profile.getData;
        this.getAmounts = Amounts.getData;

        this.open = function (url) {
            $window.location.href = url;
        };
    })

    .controller('SalaryCtrl', function($scope, $window, Profile, Amounts, Pensions, Retentions) {
        var that = this;

        this.showDetail = false;
        this.retentions = [];

        this.getPensions = Pensions.getData;
        this.getProfile = Profile.getData;
        this.getAmounts = Amounts.getData;
        this.getRetentions = Retentions.getData;

        this.open = function (url) {
            $window.location.href = url;
        };

        this.toggleDetail = function () {
            that.showDetail = !that.showDetail;
        };

        $scope.$on('$ionicView.enter', function(e) {
            that.retentions = Retentions.getData().all;
        });
    })

    .controller('ConfigCtrl', function($scope, $window, Amounts) {
        this.getAmounts = Amounts.getData;

        this.open = function (url) {
            $window.location.href = url;
        };
    });
