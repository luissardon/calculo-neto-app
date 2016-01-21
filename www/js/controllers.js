angular.module('starter.controllers', [])

    .controller('ProfileCtrl', function($scope, Profile, Amounts, Pensions) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        // $scope.$on('$ionicView.enter', function(e) {
        // });
        //

        this.profile = Profile;
        this.getAmount = Amounts.getAmount;
        this.pensions = Pensions;
    })

    .controller('SalaryCtrl', function($scope, Profile, Amounts, Pensions) {
        this.profile = Profile;
        this.getAmount = Amounts.getAmount;
        this.pensions = Pensions;
    })

    .controller('ConfigCtrl', function($scope, Amounts) {
        this.getAmount = Amounts.getAmount;
    });
