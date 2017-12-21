var content_url = 'https://trends.google.com/trends/hottrends/visualize/internal/data';
var content = [];
var color = ['rgb(250,187,5)', 'rgb(66,133,244)', 'rgb(234,67,53)', 'rgb(52,168,82)'];
var to_style = ['left', 'right', 'bottom', 'top'];
var color_count;
var dom_list = [];
var time_ctrl = [];
var content_count = 0;

function getRandomColor() {
    return color[Math.floor(Math.random() * 4)];
}

function getRandomTitel() {
    var item = content[Math.floor(Math.random() * content_count)];
    return item[Math.floor(Math.random() * item.length)];
}

function getRandomStyle() {
    return to_style[Math.floor(Math.random() * 4)];
}
function getContent() {
    $.ajax({
        url: 'http://query.yahooapis.com/v1/public/yql',
        type: 'GET',
        dataType: 'JSONP',
        async: false,
        data: {
            q: 'select * from json where url=\"' + content_url + '\"',
            format: 'json',
        },
        success: function (data) {
            data = data.query.results.json;
            for (var t in data) {
                content.push(data[t]);
            }
            content_count = content.length;
            initCell();
        }
    })
}

function valChange(i, j) {
    if (time_ctrl[i][j]) {
        clearTimeout(time_ctrl);
        time_ctrl[i][j] = null;
    }
    var item = dom_list[i][j];

    if (item.dom.first().hasClass('finish')) {
        if(i == 1 && j == 1){
            console.log(1);
        }
        item.dom.first().removeClass('finish').removeClass('current').addClass(getRandomStyle() + ' moving');
        time_ctrl[i][j] == setTimeout("valChange(" + i + "," + j + ")", 1500);
        return;
    }

    if (item.dom.first().hasClass('moving')) {
       
        var newColor = getRandomColor();
        
        item.dom.last().addClass('current').removeClass('wait').after('<div class="card"><span class="table"><span class="table-cell"></span></span></div>');
        item.dom.first().remove(); 

        var id = '#' + i + '-' + j;
        var dom = $(id).children('.card');
        dom_list[i][j].dom = dom;
        dom.first().addClass('current');
        dom.last().addClass('wait').css('background-color', getRandomColor());
        time_ctrl[i][j] = setTimeout("valChange(" + i + "," + j + ")", 200);
        dom_list[i][j].title = getRandomTitel();
        return;
    }

    if (item.dom.first().hasClass('current')) {
        var nowDom = item.dom.first().children('span').children('span');
        var nv = nowDom.text();
        if (nv != item.title) {
            if(!item.title){
                console.log(item.title);
            }
            nv += item.title[nv.length];
            nowDom.text(nv);
            var time = Math.floor(Math.random() * 400 + 100);
            time_ctrl[i][j] = setTimeout("valChange(" + i + "," + j + ")", time);
        }
        else {
            item.dom.first().addClass('finish');
            var time = Math.floor(Math.random() * 200 + 1000);
            time_ctrl[i][j] = setTimeout("valChange(" + i + "," + j + ")", time);
        }
        return;
    }
}

function initCell() {
    for (var i = 0; i < 5; i++) {
        dom_list[i] = [];
        time_ctrl[i] = [];
        for (var j = 0; j < 5; j++) {
            dom_list[i][j] = {};
            var id = '#' + i + '-' + j;
            var dom = $(id).children('.card');
            dom_list[i][j].dom = dom;
            dom.first().addClass('current').css('background-color', getRandomColor());
            dom.last().addClass('wait').css('background-color', getRandomColor());
            dom_list[i][j].title = getRandomTitel();
            time_ctrl[i][j] = null;
            valChange(i, j,300);
        }
    }
}

window.onload = function () {
    color_count = color.length;
    getContent();
};

