if(window.localStorage.number){
    $.ajax({
        type:"post",
        url:"/getschedule",
        data:{"number":window.localStorage.number},
        success:function(data){
            data.reverse();
            console.log(data);
            for(var i = 0;i < data.length;i++){
                var $nav = $("<div class='nav'></div>");
                var $top = $("<div class='top clearFix'><span class='time'></span></div>");
                var $bottom = $("<div class='bottom clearFix'><span class='money-out'>行程消费：<span class='money'></span>&nbsp;元</span><span class='cycnumber-out'>车牌号：<span class='cyclenumber'></span></span></div>");
                $nav.append($top);
                $nav.append($bottom);
                $(".container").append($nav);
                $(".time").eq(i).text(data[i].starttime);
                $(".money").eq(i).text(data[i].spend);
                $(".cyclenumber").eq(i).text(data[i].cyclenumber);
            }
        }
    });
}else{
    location.href = "login.html";
}
