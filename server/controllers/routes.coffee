# See documentation on https://github.com/frankrousseau/americano#routes

index = require './index'

module.exports =
    'stats':
        get: index.main
    'tasks':
        get: index.tasks
