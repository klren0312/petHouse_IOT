//fetch异步请求函数
function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

function json(response) {
    return response.json();
}
//页面刷新函数
// function freshWeb(){
// 	window.location.reload();
// }
var myform = document.getElementById('myform');

function datapush() {
    var timedata = document.getElementById('time').value;
    var test = "{\"times\": \"" + timedata + "\"}";
    console.log(test);
    fetch("http://119.29.201.31:3000/times", {
            method: 'post',
            body: test
        })
        .then(status)
        .then(json)
        .then(function(data) {
            // myform.submit();
            // console.log('request successed with JSON',data);
        })

}
//请求数据函数
function getData() {
    //请求风扇是否打开
    fetch("http://119.29.201.31:3000/feng")
        .then(status)
        .then(json)
        .then(function(data) {
            var div = document.getElementById('fengshan');
            var feng1 = document.getElementById('feng1');
            var feng0 = document.getElementById('feng0');
            if (data[data.length - 1] == 0) {
                feng1.style.display = "block";
                feng0.style.display = "none";
            } else {
                feng1.style.display = "none";
                feng0.style.display = "block";
            }
        })
        //请求宠物是否在屋内
    fetch("http://119.29.201.31:3000/indoor")
        .then(status)
        .then(json)
        .then(function(data) {

            var div = document.getElementById('indoor');
            var image1 = document.getElementById('image1');
            var image0 = document.getElementById('image0');

            if (data[data.length - 1] == 1) {
                image0.style.display = "none";
                image1.style.display = "block";
            } else {
                image1.style.display = "none";
                image0.style.display = "block";
            }
        })
        .catch(function(err) {
            console.log("Fetch错误:" + err);
        });
    //请求时间
    fetch("http://119.29.201.31:3000/time")
        .then(status)
        .then(json)
        .then(function(data) {
            // 折线图湿度
            myChart.setOption({
                xAxis: {
                    data: data
                }
            });
        })
        .catch(function(err) {
            console.log("Fetch错误:" + err);
        });
    //请求温度数据
    fetch("http://119.29.201.31:3000/tem")
        .then(status)
        .then(json)
        .then(function(data) {
            //折线图温度
            myChart.setOption({

                series: [{
                    // 根据名字对应到相应的系列
                    name: '温度',
                    data: data
                }]
            });
            //仪表盘温度
            temChart.setOption({

                series: [{
                    // 根据名字对应到相应的系列
                    data: [{ value: data[data.length - 1], name: '温度' }]
                }]
            });
        })
        .catch(function(err) {
            console.log("Fetch错误:" + err);
        });
    //请求湿度数据
    fetch("http://119.29.201.31:3000/hum")
        .then(status)
        .then(json)
        .then(function(data) {
            // 折线图湿度
            myChart.setOption({
                series: [{
                    // 根据名字对应到相应的系列
                    name: '湿度',
                    data: data
                }]
            });
            //湿度仪表盘
            humChart.setOption({
                series: [{
                    // 根据名字对应到相应的系列
                    data: [{ value: data[data.length - 1], name: '湿度' }]
                }]
            });
        })
        .catch(function(err) {
            console.log("Fetch错误:" + err);
        });
}
//更新ECharts数据
setInterval('getData()', 10);

//初始化echarts
var myChart = echarts.init(document.getElementById('main'));
var temChart = echarts.init(document.getElementById('tem'));
var humChart = echarts.init(document.getElementById('hum'));

//配置温湿度折线图
var colors = ['#5793f3', '#d14a61', '#675bba'];
var option = {
    color: colors,
    tooltip: {
        trigger: 'none',
        axisPointer: {
            type: 'cross'
        }
    }, //提示框
    grid: {
        x: 35,
        x2: 10,
        y: 50,
        y2: 25
    },
    legend: { //图例组件
        data: ['温度', '湿度']
    },

    xAxis: [{
            type: 'category',
            axisTick: {
                alignWithLabel: true
            },
            axisLine: {
                onZero: false,
                lineStyle: {
                    color: colors[0]
                }
            },
            axisPointer: {
                label: {
                    formatter: function(params) {
                        return '温度  ' + params.value + '：' + params.seriesData[0].data;
                    }
                }
            },
            data: ["wait1", "wait2", "wait3", "wait4", "wait5"]
        },
        {
            type: 'category',
            axisTick: {
                alignWithLabel: true
            },
            axisLine: {
                onZero: false,
                lineStyle: {
                    color: colors[1]
                }
            },
            axisPointer: {
                label: {
                    formatter: function(params) {
                        return '湿度  ' + params.value + '：' + params.seriesData[0].data;
                    }
                }
            },
            data: ["1", "2", "3", "4", "最新"]
        }
    ],
    yAxis: {

    },
    series: [{
        name: '温度',
        type: 'line',
        data: []
    }, {
        name: "湿度",
        type: 'line',
        data: []
    }]
};

//配置温度实时仪表盘
var temOption = {
    backgroundColor: '#293C55',
    tooltip: {
        formatter: "{a} <br/> {c} {b}"
    },
    toolbox: {
        show: true,
        feature: {
            mark: { show: true },
            restore: { show: true },
            saveAsImage: { show: true }
        }
    },
    series: [{
        name: '温度',
        type: 'gauge',
        min: -20,
        max: 50,
        splitNumber: 10,
        radius: '60%',
        axisLine: {
            lineStyle: {
                color: [
                    [0.09, 'lime'],
                    [0.82, '#1e90ff'],
                    [1, '#ff4500']
                ],
                width: 3,
                shadowColor: '#fff', //默认透明
                shadowBlur: 10
            }
        },
        axisLabel: { //坐标小标记
            textStyle: {
                fontWeight: 'bolder',
                color: '#fff',
                shadowColor: '#fff', //默认透明
                shadowBlur: 10
            }
        },
        axisTick: { //坐标小标记
            length: 15,
            lineStyle: {
                color: 'auto',
                shadowColor: '#fff', //默认透明
                shadowBlur: 10
            }
        },
        splitLine: { //分割线
            length: 25, //属性length控制线长
            lineStyle: {
                width: 3,
                color: '#fff',
                shadowColor: '#fff', //默认透明
                shadowBlur: 10
            }
        },
        pointer: { //分割线
            shadowColor: '#fff', //默认透明
            shadowBlur: 5
        },
        title: {
            textStyle: {
                fontWeight: 'bolder',
                fontSize: 20,
                fontStyle: 'italic',
                color: '#fff',
                shadowColor: '#fff', //默认透明
                shadowBlur: 10
            }
        },
        detail: {
            backgroundColor: 'rgba(30,144,255,0.8)',
            borderWidth: 1,
            borderColor: '#fff',
            shadowColor: '#fff', //默认透明
            offsetCenter: [0, '50%'],
            textStyle: {
                fontWeight: 'bolder',
                color: '#fff'
            }
        },
        data: []
    }]
}

//配置湿度实时仪表盘
var humOption = {
    backgroundColor: '#293C55',
    tooltip: {
        formatter: "{a} <br/> {c} {b}"
    },
    toolbox: {
        show: true,
        feature: {
            mark: { show: true },
            restore: { show: true },
            saveAsImage: { show: true }
        }
    },
    series: [{
        name: '湿度',
        type: 'gauge',
        min: 20,
        max: 100,
        splitNumber: 10,
        radius: '60%',
        axisLine: {
            lineStyle: {
                color: [
                    [0.09, 'lime'],
                    [0.82, '#1e90ff'],
                    [1, '#ff4500']
                ],
                width: 3,
                shadowColor: '#fff', //默认透明
                shadowBlur: 10
            }
        },
        axisLabel: { //坐标小标记
            textStyle: {
                fontWeight: 'bolder',
                color: '#fff',
                shadowColor: '#fff', //默认透明
                shadowBlur: 10
            }
        },
        axisTick: { //坐标小标记
            length: 15,
            lineStyle: {
                color: 'auto',
                shadowColor: '#fff', //默认透明
                shadowBlur: 10
            }
        },
        splitLine: { //分割线
            length: 25, //属性length控制线长
            lineStyle: {
                width: 3,
                color: '#fff',
                shadowColor: '#fff', //默认透明
                shadowBlur: 10
            }
        },
        pointer: { //分割线
            shadowColor: '#fff', //默认透明
            shadowBlur: 5
        },
        title: {
            textStyle: {
                fontWeight: 'bolder',
                fontSize: 20,
                fontStyle: 'italic',
                color: '#fff',
                shadowColor: '#fff', //默认透明
                shadowBlur: 10
            }
        },
        detail: {
            backgroundColor: 'rgba(30,144,255,0.8)',
            borderWidth: 1,
            borderColor: '#fff',
            shadowColor: '#fff', //默认透明
            offsetCenter: [0, '50%'],
            textStyle: {
                fontWeight: 'bolder',
                color: '#fff'
            }
        },
        data: []
    }]
}


//使用温湿度折线图配置来画图
myChart.setOption(option);
temChart.setOption(temOption);
humChart.setOption(humOption);