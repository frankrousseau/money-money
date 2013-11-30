BankOperation = require '../models/bankoperation'
Task = require '../models/task'

normalizer = require '../lib/normalizer'


module.exports.main = (req, res) ->
    BankOperation.request 'all', (err, operations) ->
        if err
            next err
        else
            monthStats = {}
            dayStats = {}
            monthGain = {}
            dayGain = {}
            for operation in operations
                year = operation.date.getYear()
                month = operation.date.getMonth()
                day = operation.date.getDay()

                if 0 > operation.amount
                    monthKey = year + "-" + month
                    dayKey = year + "-" + month + '-' + day
                    unless monthStats[monthKey]?
                        monthStats[monthKey] = 0
                    monthStats[monthKey] += operation.amount

                    unless dayStats[dayKey]?
                        dayStats[dayKey] = 0
                    dayStats[dayKey] += operation.amount

                if operation.amount > 0
                    monthKey = year + "-" + month
                    dayKey = year + "-" + month + '-' + day
                    unless monthGain[monthKey]?
                        monthGain[monthKey] = 0
                    monthGain[monthKey] += operation.amount

                    unless dayGain[dayKey]?
                        dayGain[dayKey] = 0
                    dayGain[dayKey] += operation.amount

            res.send 200, [
                monthStats,
                dayStats,
                monthGain,
                dayGain
            ]


module.exports.tasks = (req, res) ->
    Task.rawRequest 'nbByDay', group: true, (err, taskStats) ->
        if err
            next err
        else
            res.send normalizer taskStats
