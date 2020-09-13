const chartStore = {
    pie: null,
    bar: null,
}

const optionForPie = function(data) {
    let option = {
        title: {
            text: '小说阅读网月销榜 完结情况占比',
            x: 'center',
            top:20,
            textStyle:{
                color:'#93b7e3',
                fontSize:25,
            },
        },

        series: [
            {
                name: '完结情况占比',
                type: 'pie',
                data: data,
            }
        ],
        itemStyle: {
            normal:{
                color:function(params){
                    let colorList=[
                        '#93b7e3', '#8fd3e8',
                    ];
                    return colorList[params.dataIndex]
                },
            },
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: ({d}%)',
        },
    }

    return option
}

const optionForFinish = function(finish) {
    let data = _.map(finish, (v, k) => {
        let o = {
            name: k,
            value: v.length,
        }
        return o
    })
    let option = optionForPie(data)
    return option
}

const optionForBar = function(data) {
    let option = {
        title: {
            text: '小说阅读网月销榜 按类型划分',
            textStyle:{
                color:'#9b8bba',
                fontSize:25,
            },
        },

        grid:{
            top:'15%'
        },

        xAxis: {
            data: data.axis,
            name: '小说类型',
            axisLabel: {
                textStyle: {
                    color: '#a68bbe',
                    fontSize:13,
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: "#a68bbe",
                }
            },
            z: 10,
            },
        yAxis: {
            name: '小说数量',
            axisLine: {
                show: false,
                lineStyle: {
                    color: "#a68bbe",
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#a68bbe'
                }
            }
        },
        series: [
            {
                type: 'bar',
                itemStyle: {
                    normal: {color: 'rgba(0,0,0,0.05)'}
                },
                barGap:'-100%',
                barCategoryGap:'40%',
                animation: false
            },
            {
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#9b8bba'},
                                {offset: 1, color: '#8fd3e8'}
                            ]
                        )
                    },
                    emphasis: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#e098c7'},
                                {offset: 1, color: '#7cb4cc'}
                            ]
                        )
                    }
                },
                data: data.data
            }
        ]
    }
    return option
}

const optionForType = function(type) {
    let data = {
        axis: [],
        data: [],
    }
    _.each(type, (v, k) => {
        data.axis.push(k)
        data.data.push(v.length)
    })
    let option = optionForBar(data)
    log('option',option)
    return option
}

const renderChart = function(d) {
    let data = d

    let finish = _.groupBy(data, 'finish')
    let finishOption = optionForFinish(finish)
    let pie = chartStore.pie
    pie.setOption(finishOption)

    let type = _.groupBy(data, 'type')
    let typeOption = optionForType(type)
    let bar = chartStore.bar
    bar.setOption(typeOption)
}

const fetchBooks = function() {
    api.fetchBooks(function (d) {
        d = JSON.parse(d)
        renderChart(d)
    })
}

const initedChart = function() {
    _.each(chartStore, (v, k) => {
        let selector = '#' + k
        let element = document.querySelector(selector)
        let chart = echarts.init(element)
        chartStore[k] = chart
    })
}

const __main = function() {
    initedChart()
    fetchBooks()
}

$(document).ready(function() {
    __main()
})
