const {
    ipcRenderer,
    remote
} = require('electron')

mainProcess = remote.require('./tri_demo.js')
const TriMap = require('./src/triMap.js')

const mapDisplay = document.querySelector('#map')
const videoPlayer = document.querySelector('#video-player')
const videoCanvas = document.querySelector('#video-canvas')
const videoController = document.querySelector('#video-controller')
// select the canvas composition modes
const cModeSelector = 'source-over'

let triMapper = null
let current_data = null
let current_shape_points_array = null
let current_segment_info = null

let c_mode = 'source-over'
let context = null
// flag variable for text masking on the video frame
let framed = true
let frame = $('#video-player img:first-of-type')[0]

let fixedInterval = 60
let lastCheckedRealtimeLen = 0

// define the global csv file vars
let csvHeader = []
let realtimeInfo = []

// infrastructure result
let infras_seg = []

// add click event listener for Toggle Fixed Interval
$("#toggleFixedInterval").click(() => {
    if (fixedInterval == -1)
        fixedInterval = 60
    else
        fixedInterval = -1
    drawChart(lastCheckedRealtimeLen)
})

// add click event listener for checkboxes
$(":checkbox").click(function() {
    drawChart(lastCheckedRealtimeLen)
})

// update the link section highlight
const updateLinkPlot = (map, shape_points) => {
    let directionsDisplay = new google.maps.DirectionsRender
    let directionsService = new google.maps.DirectionsService

    directionDisplay.setMap(map)
}

// Listen to the init signal
ipcRenderer.on('init', (event) => {
    let isl_lati = 42.31995
    let isl_longi = -83.233371

    triMapper = new TriMap(isl_lati, isl_longi, mapDisplay)
})

// Listen to the update-gps signal
ipcRenderer.on('update-gps', (event, currentLat, currentLng) => {
    console.log("event: update-gps")
    triMapper.updateGPSplot(currentLat, currentLng)
})

// Listen to the update-link signal
ipcRenderer.on('update-link', (event, shape_points_array, data) => {
    console.log("event: update-link")
    triMapper.renderPolyline(shape_points_array, data)
    // triMapper.updateLinkPlot(shape_points_array, data)
    current_shape_points_array = shape_points_array
    current_data = data
})

google.charts.load('current', {
    'packages': ['line']
})
// google.charts.setOnLoadCallback(drawChart);

function drawChart(data_index) {
    var data1 = new google.visualization.DataTable()
    var data2 = new google.visualization.DataTable()
    let rows1 = [], rows2 = []

    let dataset1 = [], dataset2 = []
    checkboxes = ["hr", "hrv", "br", "posture", "activity", "peakaccel", "gsr", "scl", "scr", "driver_workload", "expert_workload", "traffic_load", "event", "time_s", "speed_mph", "GPS_long_degs", "GPS_lat_degs", "GPS_heading_degs", "long_accel_g", "lat_accel_g", "vector_accel_g", "vert_accel_g"]
    for (let i = 0; i < checkboxes.length; i++) {
        let id1 = checkboxes[i] + "1"
        if (document.getElementById(id1).checked)
            dataset1.push(i + 2)
        let id2 = checkboxes[i] + "2"
        if (document.getElementById(id2).checked)
            dataset2.push(i + 2)
    }

    // add time column for x-axis
    data1.addColumn('number', csvHeader[0] + "/s")
    data2.addColumn('number', csvHeader[0] + "/s")

    // add headers
    for (let i = 0; i < dataset1.length; i++) {
        let idx = dataset1[i]
        data1.addColumn('number', csvHeader[idx])
    }

    for (let i = 0; i < dataset2.length; i++) {
        let idx = dataset2[i]
        data2.addColumn('number', csvHeader[idx])
    }

    let startIdx = 0
    let endIdx = data_index
    if (fixedInterval > 0 && endIdx >= fixedInterval) {
        startIdx = endIdx - fixedInterval
    } else {
        startIdx = 0
    }

    let realtimeInfoMax = [], realtimeInfoMin = []
    for (let i = startIdx; i <= endIdx; i++) {
        for (let j = 2; j < realtimeInfo[i].length; j++) {
            if (j in realtimeInfoMax)
                realtimeInfoMax[j] = Math.max(realtimeInfoMax[j], Math.max(parseFloat(realtimeInfo[i][j])))
            else
                realtimeInfoMax[j] = parseFloat(realtimeInfo[i][j])
            if (j in realtimeInfoMin)
                realtimeInfoMin[j] = Math.min(realtimeInfoMin[j], Math.min(parseFloat(realtimeInfo[i][j])))
            else
                realtimeInfoMin[j] = parseFloat(realtimeInfo[i][j])
        }
    }

    for (let i = startIdx; i <= endIdx; i++) {
        let row1 = [], row2 = []
        row1.push(parseFloat(realtimeInfo[i][0]))
        row2.push(parseFloat(realtimeInfo[i][0]))
        for (let j = 0; j < dataset1.length; j++) {
            let idx = dataset1[j]
            let d1 = parseFloat(realtimeInfo[i][idx])
            let diff = realtimeInfoMax[idx]-realtimeInfoMin[idx]
            if (diff == 0) {
                diff = Math.max(Math.abs(realtimeInfoMax[idx]), Math.abs(realtimeInfoMin[idx]))
                if (diff == 0) diff = 1
            }
            let normalizedData = (d1 - realtimeInfoMin[idx])/diff*100
            row1.push(normalizedData)
        }
        for (let j = 0; j < dataset2.length; j++) {
            let idx = dataset2[j]
            row2.push(parseFloat(realtimeInfo[i][idx]))
        }
        rows1.push(row1)
        rows2.push(row2)
    }

    data1.addRows(rows1)
    data2.addRows(rows2)

    let linechart_width = $("#linechart_1").width()
    let linechart_height = $("#linechart_1").height()
    let options1 = {
        chart: {
            title: 'Normalized Data Visualization',
            subtitle: 'The normalized data is ranged from [0, 100]'
        },
        hAxis: {
            viewWindow: {
                min: startIdx,
                max: endIdx
            }
        },
        vAxis: {
            format: "decimal"
        },
        width: linechart_width,
        height: linechart_height
    }
    let options2 = {
        chart: {
            title: 'Original Data Visualization',
            subtitle: 'This chart displays the original data'
        },
        hAxis: {
            viewWindow: {
                min: startIdx,
                max: endIdx
            }
        },
        vAxis: {
            format: "decimal"
        },
        width: linechart_width,
        height: linechart_height
    };
    var chart1 = new google.charts.Line(document.getElementById('linechart_1'));
    var chart2 = new google.charts.Line(document.getElementById('linechart_2'));
    chart1.draw(data1, google.charts.Line.convertOptions(options1));
    chart2.draw(data2, google.charts.Line.convertOptions(options2));

    google.visualization.events.addListener(chart1, 'select',trackSelectedTime1)
    google.visualization.events.addListener(chart2, 'select',trackSelectedTime2)

    function trackSelectedTime1() {
        let item = chart1.getSelection()
        item = item[0]
        if (item != null && item.row != null) {
            var time = data1.getFormattedValue(item.row, 0);
            videoPlayer.currentTime = parseInt(time)
        }
    }

    function trackSelectedTime2() {
        let item = chart2.getSelection()
        item = item[0]
        if (item != null && item.row != null) {
            var time = data2.getFormattedValue(item.row, 0);
            videoPlayer.currentTime = parseInt(time)
        }
    }
}

ipcRenderer.on('update-info', (event, data_index) => {
    console.log("event: update-info")
    // text info //////////////////////////////////////////////////////////////
    // $("#info2").empty()
    // for (let i = 0; i < csvHeader.length; i++) {
    //     $("#info2").append("<li><b>" + csvHeader[i] + "</b>: " + realtimeInfo[i] + "<li>")
    // }

    drawChart(data_index)
    lastCheckedRealtimeLen = data_index
})

ipcRenderer.on('opened-csv', (event, header, rinfo) => {
    console.log("event: opened-csv")

    csvHeader = header
    realtimeInfo = rinfo
})

// grab each frame
const drawFrame = () => {
    if (videoPlayer.paused || videoPlayer.ended) return false
    // update segmentation information
    let map_width = $("#map").width()
    $("#video-canvas").attr("width", map_width)
    $("#video-canvas").attr("height", map_width * 0.667)
    let canvas_width = $("#video-canvas").width()
    let canvas_height = $("#video-canvas").height()

    let font_size = Math.round(map_width / 20)
    context.clearRect(0, 0, canvas_width, canvas_height)
    context.globalCompositeOperation = c_mode
    context.drawImage(videoPlayer, 0, 0, videoPlayer.videoWidth, videoPlayer.videoHeight, 0, 0, canvas_width, canvas_height)
    if (framed && null !== current_segment_info) {
        // draw some text
        context.font = "bold " + font_size + "px arial"
        context.fillStyle = "#ffffff"

        // set the absolute position of the info 
        var x = 0.27 * canvas_width
        var y = 0.72 * canvas_height
        var lineheight = font_size;
        var linkArrText = ""
        for (var i in current_segment_info.link_array)
            linkArrText += current_segment_info.link_array[i].linkID + "\n"

        let text = "Road infras level: " + current_segment_info.infras_type.toString() +
            "\nStart time: " + current_segment_info.start_time +
            "\nEnd time: " + current_segment_info.end_time
        // "\nLink array:\n" + linkArrText

        var lines = text.split('\n');
        for (var i = 0; i < lines.length; i++)
            context.fillText(lines[i], x, y + (i * lineheight));
    }
    requestAnimationFrame(drawFrame) // recursive call this function
    return true
}

ipcRenderer.on('opened-infras_segment_result', (event, infras_seg_result) => {
    console.log("event: opened-infras_segment_result")
    infras_seg = infras_seg_result
    infras_select = $('#infras_select')
    infras_select.append($('<option>', { 
        value: -1,
        text : ""
    }))
    $.each(infras_seg, function (i, infras_seg) {
        infras_select.append($('<option>', { 
            value: i,
            text : infras_seg.start_time + " - " + infras_seg.end_time + " : " + infras_seg.infras_type
        }))
    })
    infras_select.change(() => {
        let idx = infras_select.val()
        if (idx >= 0) {
            videoPlayer.currentTime = infras_seg[idx].start_time
            videoPlayer.play()
        }
    })

    let infras_interval = setInterval(checkInfrasSegEnd, 1000);
    function checkInfrasSegEnd(){
        let idx = infras_select.val()
        // idx >= 0 means segmentation is selected
        if (idx >= 0) {
            let curSegStartTime = infras_seg[idx].start_time
            let curSegEndTime = infras_seg[idx].end_time
            if(curSegStartTime != null && Math.ceil(videoPlayer.currentTime) < curSegStartTime){
                videoPlayer.currentTime = curSegStartTime + 1
                alert("Infrastructure Segmentation Start Reached!")
                videoPlayer.currentTime = curSegStartTime + 1            
                setTimeout(videoPlayer.pause(), 100)
            }
            if(curSegEndTime != null && Math.floor(videoPlayer.currentTime) > curSegEndTime){
                videoPlayer.currentTime = curSegEndTime - 1
                alert("Infrastructure Segmentation End Reached!")
                videoPlayer.currentTime = curSegEndTime - 1
                setTimeout(videoPlayer.pause(), 100)
            }
        }
    }
})

ipcRenderer.on('opened-video', (event, videoFile) => {
    console.log("event: opened-video")
    videoPlayer.src = videoFile
    $("#videoPath").text(videoFile.toString()) // use jQuery to show video name
    context = videoCanvas.getContext('2d')
    videoPlayer.addEventListener('play', drawFrame) // bind the video paly event to the frame drawing function
    videoPlayer.play()
})

videoPlayer.addEventListener('timeupdate', () => {
    console.log("event: video-player -> ontimeupdate\n" + "currentTime: " + videoPlayer.currentTime)
    $("#currentTime").text(videoPlayer.currentTime)
    // update map information
    mainProcess.updateMap(videoPlayer.currentTime)
    // send request for querying information of current road segment
    mainProcess.updateSegInfo(videoPlayer.currentTime)
})

ipcRenderer.on('draw_seg_info', (event, currentSegInfo) => {
    current_segment_info = currentSegInfo // need deep copy?
})

// helper function
const log_state = (event) => {
    console.log(event.type)
    console.log('networkState: ' + event.target.networkState)
    console.log('readyState: ' + event.target.readyState)
}

// bind all four events to the log_state function.
videoPlayer.addEventListener('loadedmetadata', log_state)
videoPlayer.addEventListener('loadeddata', log_state)
videoPlayer.addEventListener('canplay', log_state)
videoPlayer.addEventListener('canplaythrough', log_state)

videoController.addEventListener('click', (event) => {
    let action = $(event.target).text().trim()
    switch (action) {
        case '|<':
            videoPlayer.currentTime = 0
            break
        case '<<':
            if (videoPlayer.playbackRate > 0.25)
                videoPlayer.playbackRate = videoPlayer.playbackRate / 2.0
            break
        case '||':
            videoPlayer.pause()
            break
        case '>':
            videoPlayer.playbackRate = 1.0
            videoPlayer.play()
            break
        case '>>':
            if (videoPlayer.playbackRate < 16)
                videoPlayer.playbackRate = videoPlayer.playbackRate * 2.0
            break
        case 'Framed':
            framed = false
            $(event.target).text('Frame')
            break
        case 'Frame':
            framed = true
            $(event.target).text('Framed')
            break
    }
    return false
})
