angular.module('starter.services', [])

    .factory('$localstorage', function($window) {
        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        };
    })

    .factory('Profile', function($localstorage) {

        var config = {
            hasAF                       : $localstorage.get('hasAF', false) === "true",
            hasEPS                      : $localstorage.get('hasEPS', false) === "true",
            insuranceContributionRate   : Number($localstorage.get('insuranceContributionRate', 9)),
            EPSAmount                   : 0
        };

        return {
            getData : function() {
                config.EPSAmount = Number($localstorage.get('EPSAmount', 0));

                if(config.hasEPS)
                    config.insuranceContributionRate = 6.75;
                else
                    config.EPSAmount = 0;

                $localstorage.set('hasAF', config.hasAF);
                $localstorage.set('hasEPS', config.hasEPS);
                $localstorage.set('insuranceContributionRate', config.insuranceContributionRate);

                return config;
            }
        };
    })

    .factory('Retentions', function($localstorage, Profile) {
        var retentions = [
            {
                id          : "0",
                name        : "< 5 UIT",
                uit         : 5,
                discount    : 8,
                retained    : 0,
                affected    : 0,
            },
            {
                id          : "1",
                name        : "5 UIT > < 20 UIT",
                uit         : 20,
                discount    : 14,
                retained    : 0,
                affected    : 0,
            },
            {
                id          : "2",
                name        : "20 UIT > < 35 UIT",
                uit         : 35,
                discount    : 17,
                retained    : 0,
                affected    : 0,
            },
            {
                id          : "3",
                name        : "35 UIT > < 45 UIT",
                uit         : 45,
                discount    : 20,
                retained    : 0,
                affected    : 0,
            },
            {
                id          : "4",
                name        : "45 UIT >",
                uit         : 0,
                discount    : 30,
                retained    : 0,
                affected    : 0,
            }
        ];

        var totalRetentionAmount = $localstorage.get('totalRetentionAmount', 0);

        return {
            getData : function (anualGrossAmount, UITAmount) {
                var retentionUITAmount  = 0,
                    discountAmount  = 0,
                    affectedAmount  = 0;

                anualGrossAmount -= UITAmount * 7;
                anualGrossAmount = anualGrossAmount > 0 ? anualGrossAmount : 0;

                totalRetentionAmount = 0;

                for(var i = 0; i < retentions.length; i++) {
                    retentionUITAmount = retentions[i].uit * UITAmount;

                    if(anualGrossAmount > 0) {
                        affectedAmount = (anualGrossAmount < retentionUITAmount || retentionUITAmount === 0) ? anualGrossAmount : retentionUITAmount;
                    } else {
                        affectedAmount = 0;
                    }

                    discountAmount = affectedAmount / 100 * retentions[i].discount;

                    anualGrossAmount -= affectedAmount;
                    totalRetentionAmount += discountAmount;

                    retentions[i].retained = discountAmount / 12;
                    retentions[i].affected = affectedAmount;
                }

                Profile.getData().hasRetention = totalRetentionAmount > 0;

                $localstorage.set('totalRetentionAmount', totalRetentionAmount);

                return {
                    all : retentions,
                    discount : totalRetentionAmount
                };
            }
        };
    })

    .factory('Amounts', function($localstorage, Profile, Retentions, Pensions) {
        var amounts = {
            UITAmount       : Number($localstorage.get('UITAmount', 3950)),
            RMVAmount       : Number($localstorage.get('RMVAmount', 750)),

            baseAmount      : Number($localstorage.get('baseAmount', 0)),
            AFAmount        : 0,
            grossAmount     : 0,
            gratiAmount     : 0,
            gratiBaseAmount : 0,
            extraBonusAmount: 0,
            pensionAmount   : 0,
            EPSAmount       : 0,
            discountAmount  : 0,
            netAmount       : 0,
        };

        return {
            getData : function() {
                amounts.AFAmount                = Profile.getData().hasAF ? amounts.RMVAmount / 100 * 10 : 0;
                amounts.grossAmount             = amounts.baseAmount + amounts.AFAmount;
                amounts.extraBonusAmount        = amounts.grossAmount / 100 * Profile.getData().insuranceContributionRate;
                amounts.gratiBaseAmount         = amounts.grossAmount;
                amounts.gratiAmount             = amounts.gratiBaseAmount + amounts.extraBonusAmount;
                amounts.anualGrossAmount        = amounts.grossAmount * 12 + amounts.gratiAmount * 2;
                amounts.anualRetentionAmount    = Retentions.getData(amounts.anualGrossAmount, amounts.UITAmount).discount;
                amounts.retentionAmount         = amounts.anualRetentionAmount / 12;
                amounts.pensionAmount           = amounts.grossAmount / 100 * Pensions.getData().selected.value;
                amounts.discountAmount          = amounts.retentionAmount + amounts.pensionAmount + amounts.EPSAmount;
                amounts.netAmount               = amounts.grossAmount - amounts.discountAmount;

                amounts.netAmount               = amounts.netAmount < 0 ? 0 : amounts.netAmount;

                $localstorage.set('UITAmount', amounts.UITAmount);
                $localstorage.set('RMVAmount', amounts.RMVAmount);
                $localstorage.set('baseAmount', amounts.baseAmount);

                console.log(Profile.getData().hasEPS, Profile.getData().EPSAmount);

                if(Profile.getData().hasEPS) {
                  if(amounts.EPSAmount === 0 || isNaN(amounts.EPSAmount)) {
                    if(Profile.getData().EPSAmount !== 0 && !isNaN(Profile.getData().EPSAmount)) {
                      amounts.EPSAmount = Profile.getData().EPSAmount;
                      $localstorage.set('EPSAmount', amounts.EPSAmount);
                    } else {
                      amounts.EPSAmount = 0;
                    }
                  } else {
                    console.log("no EPS isn't 0");
                    $localstorage.set('EPSAmount', amounts.EPSAmount);
                  }
                } else {
                  amounts.EPSAmount = 0;
                }

                return amounts;
            }
        };
    })

    .factory('Pensions', function($localstorage) {
        var pensions = {
            all : [
                {
                    id      : "0",
                    name    : "AFP Habitad 12.80%",
                    value   : 12.80,
                },
                {
                    id      : "1",
                    name    : "Profuturo AFP 13.02%",
                    value   : 13.02,
                },
                {
                    id      : "2",
                    name    : "Prima AFP 12.93%",
                    value   : 12.93,
                },
                {
                    id      : "3",
                    name    : "AFP Integra 12.88%",
                    value   : 12.88,
                },
                {
                    id      : "4",
                    name    : "ONP 13%",
                    value   : 13,
                }
            ]
        };

        pensions.selected = pensions.all[Number($localstorage.get('selectedPensionIndex', 0))];

        return {
            getData : function () {
                $localstorage.set('selectedPensionIndex', pensions.selected.id);

                return pensions;
            }
        };
    });
