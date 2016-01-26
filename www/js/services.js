angular.module('starter.services', [])

    .factory('Profile', function() {
        var config = {
            hasAF                       : false,
            hasEPS                      : false,
            hasAFP                      : false,
            insuranceContributionRate   : 9,
        };

        return {
            getData : function() {
                if(config.hasEPS)
                    config.insuranceContributionRate = 6.75;

                return config;
            }
        };
    })

    .factory('Retentions', function(Profile) {
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

        var totalRetentionAmount = 0;

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

                return {
                    all : retentions,
                    discount : totalRetentionAmount
                }
            }
        };
    })

    .factory('Amounts', function(Profile, Retentions, Pensions) {
        var amounts = {
            UITAmount       : 3950,
            RMVAmount       : 750,

            baseAmount      : 0,
            AFAmount        : 0,
            grossAmount     : 0,
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
                amounts.anualGrossAmount        = amounts.grossAmount * 14 + amounts.extraBonusAmount * 2;
                amounts.anualRetentionAmount    = Retentions.getData(amounts.anualGrossAmount, amounts.UITAmount).discount;
                amounts.retentionAmount         = amounts.anualRetentionAmount / 12;
                amounts.pensionAmount           = amounts.grossAmount / 100 * Pensions.current.value;
                amounts.EPSAmount               = Profile.getData().hasEPS ? amounts.EPSAmount : 0;
                amounts.discountAmount          = amounts.retentionAmount + amounts.pensionAmount + amounts.EPSAmount;
                amounts.netAmount               = amounts.grossAmount - amounts.discountAmount;

                amounts.netAmount               = amounts.netAmount < 0 ? 0 : amounts.netAmount;

                return amounts;
            }
        };
    })

    .factory('Pensions', function() {
        var pensions = [
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
                id      : "2",
                name    : "ONP 13%",
                value   : 13,
            }
        ]

        var selectedPension = pensions[0]

        return {
            all : pensions,
            current : selectedPension
        }
    })

