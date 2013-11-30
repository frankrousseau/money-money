BankOperation = require '../models/bankoperation'
Task = require '../models/task'

normalizer = require '../lib/normalizer'

module.exports.main = (req, res) ->
    res.send 'hello'

module.exports.gainMonth = (req, res) ->
    BankOperation.rawRequest 'amountGainByMonth', group: true, (err, stats) ->
        if err
            next err
        else
            res.send stats

module.exports.gainDay = (req, res) ->
    BankOperation.rawRequest 'amountGainByDay', group: true, (err, stats) ->
        if err
            next err
        else
            res.send normalizer stats

module.exports.lossMonth = (req, res) ->
    BankOperation.rawRequest 'amountLossByMonth', group: true, (err, stats) ->
        if err
            next err
        else
            res.send stats

module.exports.lossDay = (req, res) ->
    BankOperation.rawRequest 'amountLossByDay', group: true, (err, stats) ->
        if err
            next err
        else
            res.send normalizer stats

module.exports.tasks = (req, res) ->
    Task.rawRequest 'nbByDay', group: true, (err, taskStats) ->
        if err
            next err
        else
            res.send normalizer taskStats
