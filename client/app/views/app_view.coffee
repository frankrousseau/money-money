BaseView = require '../lib/base_view'
request = require '../lib/request'

sum = (data) ->
    i = 0
    total = 0
    for amount in data
        total += amount.value
        i++
    total



average = (data) ->
    i = 0
    total = 0
    for amount in data
        total += amount.value
        i++
    (total / i).toFixed(2)

averageDay = (data) ->
    i = 0
    total = 0
    for day, amount of data
        total += amount
        i++
    (total / i).toFixed(2)

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
            income = sum data
            request.get 'loss/month', (err, data) ->
                $("#average-loss-month").html average data
                expense = sum data

                console.log income
                console.log expense
                printDonut(income, -1 * expense)


        request.get 'gain/day', (err, data) ->
            $("#average-gain-day").html averageDay data

        request.get 'tasks', (err, data2) ->
            $("#average-task-day").html averageDay data2
            totalTasks = 0
            for day, amount of data2
                totalTasks += amount
            data2 = _.map data2, (num) -> return (num * 10)
            request.get 'loss/day', (err, data) ->
                $("#average-loss-day").html averageDay data
                data = _.map data, (num) -> return (num * -1)
                printGraph "graph-loss", data, data2

                totalLoss = 0
                for day, amount of data
                    totalLoss += amount
                $("#average-task-cost").html (totalLoss/totalTasks).toFixed(2)


printDonut = (income, expense) ->
    doughnutData = [
        {
            value: income,
            color:"#F7464A"
        },
        {
            value : expense,
            color : "#46BFBD"
        },
        {
            value : 200866,
            color : "#FDB45C"
        },
    ]
    chart = new Chart(document.getElementById("donut").getContext("2d"))
    myDoughnut = chart.Doughnut(doughnutData)

    $("#compare-select").on 'change', (event) ->
        data = doughnutData
        data[2].value = $("#compare-select").val()
        console.log $("#compare-select").val()
        myDoughnut = chart.Doughnut(data)


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
                strokeColor: "#46BFBD"
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
