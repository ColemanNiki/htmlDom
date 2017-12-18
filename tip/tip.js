var content_url = 'https://trends.google.com/trends/hottrends/visualize/internal/data';
var content = [];
var color = ['rgb(250,187,5)','rgb(66,133,244)','rgb(234,67,53)','rgb(52,168,82)'];
var color_count;
var dom_list = [];

function getRandColor(){
    return color[Math.floor(Math.random()*4)];
}

function getContent(){
    $.ajax({
        url:'http://query.yahooapis.com/v1/public/yql',
        type:'GET',
        dataType:'JSONP',
        data:{
            q:'select * from json where url=\"'+content_url+'\"',
            format:'json',
        },
        success:function(data){
            data = data.query.results.json;
            for(var t in data){
                content.push(data[t]);
            }
            console.log(content);
        }
    })
}

window.onload = function(){
    color_count = color.length;
    getContent();
};

