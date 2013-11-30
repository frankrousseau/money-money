# See documentation on https://github.com/frankrousseau/americano#routes

index = require './index'

module.exports =
    'stats':
        get: index.main
    'tasks':
        get: index.tasks
    'gain/month':
        get: index.gainMonth
    'gain/day':
        get: index.gainDay
    'loss/month':
        get: index.lossMonth
    'loss/day':
        get: index.lossDay
