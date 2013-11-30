BaseView = require '../lib/base_view'
request = require '../lib/request'


average = (data) ->
    i = 0
    total = 0
    for amount in data
        total += amount.value
        i++
    total / i

averageDay = (data) ->
    i = 0
    total = 0
    for day, amount of data
        total += amount
        i++
    total / i

getDayGraphLabels = (data) ->
    result = []
    for day, amount of data
        result.push "d"
    result

getDayGraphData = (data) ->
    result = []
    for day, amount of data
        result.push amount
    result

module.exports = class AppView extends BaseView

    el: 'body.application'
    template: require('./templates/home')

    afterRender: ->
        request.get 'gain/month', (err, data) ->
            $("#average-gain-month").html average data
        request.get 'gain/day', (err, data) ->
            $("#average-gain-day").html averageDay data
        request.get 'loss/month', (err, data) ->
            $("#average-loss-month").html average data

        request.get 'tasks', (err, data2) ->
            $("#average-task-day").html averageDay data2
            data2 = _.map data2, (num) -> return (num * 10)
            request.get 'loss/day', (err, data) ->
                $("#average-loss-day").html averageDay data
                data = _.map data, (num) -> return (num * -1)
                printGraph "graph-loss", data, data2



printGraph = (graphId, data1, data2) ->
    ctx = $("##{graphId}").get(0).getContext("2d")
    graphData = getDayGraphData data1
    graphLabels = getDayGraphLabels data1
    graphData2 = getDayGraphData data2

    points = {
        labels: graphLabels,
        datasets : [
            {
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                data: graphData
            },
            {
                fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                data: graphLabels
            },
            {
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(187,151,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                data: graphData2
            }
        ]
    }
    chartLoss = new Chart(ctx).Line(points)
