americano = require 'americano'

module.exports = BankOperation = americano.getModel 'bankoperation',
    bankAccount: String
    title: String
    date: Date
    amount: Number
    raw: String

BankOperation.all = (callback) ->
    BankOperation.request "all", callback
