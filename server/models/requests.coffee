americano = require 'americano'


getBalance =
    map: (doc) ->
        emit doc.bankAccount, doc.amount
    reduce: (keys, values, rereduce) ->
        sum values

module.exports =
    bankoperation:
        all: americano.defaultRequests.all
        allByDate: (doc) -> emit doc.date, doc
        getBalance: (doc) ->
            map: (doc) ->
                emit doc.id, doc.amount
            reduce: (keys, values, rereduce) ->
                sum values

        amountGainByDay:
            map: (doc) ->
                if doc.date? and doc.amount > 0
                    date = new Date doc.completionDate
                    yyyy = date.getFullYear().toString()
                    mm = (date.getMonth() + 1).toString()
                    mm = "0" + mm if mm.length is 1
                    dd = date.getDate().toString()
                    dd = "0" + dd if dd.length is 1
                    dateString = yyyy + '-' + mm + '-' + dd
                    emit dateString, doc.amount

            reduce: (key, values, rereduce) ->
                sum values

        amountGainByMonth:
            map: (doc) ->
                if doc.date? and doc.amount > 0
                    date = new Date doc.completionDate
                    yyyy = date.getFullYear().toString()
                    mm = (date.getMonth() + 1).toString()
                    mm = "0" + mm if mm.length is 1
                    dateString = yyyy + '-' + mm
                    emit dateString, doc.amount

            reduce: (key, values, rereduce) ->
                sum values

        amountLossByDay:
            map: (doc) ->
                if doc.date? and doc.amount > 0
                    date = new Date doc.date
                    yyyy = date.getFullYear().toString()
                    mm = (date.getMonth() + 1).toString()
                    mm = "0" + mm if mm.length is 1
                    dd = date.getDate().toString()
                    dd = "0" + dd if dd.length is 1
                    dateString = yyyy + '-' + mm + '-' + dd
                    emit dateString, doc.amount

            reduce: (key, values, rereduce) ->
                sum values

        amountLossByMonth:
            map: (doc) ->
                if doc.date? and doc.amount > 0
                    date = new Date doc.date
                    yyyy = date.getFullYear().toString()
                    mm = (date.getMonth() + 1).toString()
                    mm = "0" + mm if mm.length is 1
                    dateString = yyyy + '-' + mm
                    emit dateString, doc.amount

            reduce: (key, values, rereduce) ->
                sum values

    task:
        nbByDay:
            map: (doc) ->
                if doc.completionDate? and doc.done
                    date = new Date doc.completionDate
                    yyyy = date.getFullYear().toString()
                    mm = (date.getMonth() + 1).toString()
                    mm = "0" + mm if mm.length is 1
                    dd = date.getDate().toString()
                    dd = "0" + dd if dd.length is 1
                    dateString = yyyy + '-' + mm + '-' + dd
                    emit dateString, 1

            reduce: (key, values, rereduce) ->
                sum values
