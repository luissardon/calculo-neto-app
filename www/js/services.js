angular.module('starter.services', [])

    .factory('Profile', function() {
        var config = {
            hasAF           : true,
            hasEPS          : true
        };

        return config;
    })

    .factory('Amounts', function(Profile, Pensions) {
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
            getAmount : function() {
                amounts.AFAmount        = Profile.hasAF ? amounts.RMVAmount / 100 * 10 : 0;
                amounts.grossAmount     = parseFloat(amounts.baseAmount) + parseFloat(amounts.AFAmount);
                amounts.pensionAmount   = parseFloat(amounts.grossAmount) / 100 * parseFloat(Pensions.current.value);
                amounts.EPSAmount       = Profile.hasEPS ? parseFloat(amounts.EPSAmount) : 0;
                amounts.discountAmount  = amounts.pensionAmount + amounts.EPSAmount;
                amounts.netAmount       = amounts.grossAmount - amounts.discountAmount;
                amounts.netAmount       = amounts.netAmount < 0 ? 0 : amounts.netAmount;
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
            current : selectedPension,
        };
    })

