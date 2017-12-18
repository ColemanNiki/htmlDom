var content_url = 'https://trends.google.com/trends/hottrends/visualize/internal/data';
var content = [];
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

getContent();