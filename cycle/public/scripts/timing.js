//判断手机号是否存在，是则判断hours是否存在,hours存在跳转timing页面，hours不存在则判断val受否存在

if(window.localStorage.number){
    map = new BMap.Map("map");
    map.addControl(new BMap.NavigationControl());//添加地图平移插件
    var point = new BMap.Point(116.331398,39.897445);
    map.centerAndZoom(point,12);
    var geolocation = new BMap.Geolocation();
    if(window.localStorage.hours){
        //行程还在继续
        $(".time").css("display","block").siblings().css("display","none");
        setInterval("timer()",1000);
    }else{
        //未开始行程
        $.ajax({
            //获取车牌对应密码
            type:"get",
            url:"/timing",
            async:"false",
            success:function(data){
                $("h3").text(data.password);
            }
        });
        //行程倒计时
        var time = Number($(".minute").text());
        showTime();
        var e = setInterval("showTime()",1000);
        function showTime(){
            if(window.localStorage.cycleNumber){
                time--;
                $(".minute").text(time);
                if(time === 0){
                    $.ajax({
                        type:"post",
                        url:"/insertschedule",
                        async:"false",
                        data:{
                            "number":window.localStorage.number,
                            "cyclenumber":window.localStorage.cycleNumber
                        }
                    });
                    clearInterval(e);
                    $(".time").css("display","block").siblings().css("display","none");
                }
            }else{
                location.href = "head.html";
            }
        }
    }
    //开始计算行程
    var start = 0;
    timer();
    var stopTimer = setInterval("timer()",1000);
    function timer(){
        if($(".time").css("display") == "block"){
            $.ajax({
                type: "post",
                url: "/gettime",
                async:"false",
                data: {
                    "number": window.localStorage.number
                },
                success: function (data) {
                    if(data != "null"){
                        var nowtime = new Date(data.nowtime.replace(/-/g,"/"));
                        var starttime = new Date(data.starttime.replace(/-/g,"/"));
                        start = nowtime.getTime() - starttime.getTime();
                        var hours = parseInt(start/(3600*1000));
                        var minutesResult = start%(3600*1000);
                        var minutes = parseInt(minutesResult/(60*1000));
                        var secondsResult = minutesResult%(60*1000);
                        var seconds = secondsResult/1000;
                        if(hours.toString().length === 1){
                            $(".hours").text("0" + hours);
                        }else{
                            $(".hours").text(hours);
                        }
                        if(minutes.toString().length === 1){
                            $(".minutes").text("0" + minutes);
                        }else{
                            $(".minutes").text(minutes);
                        }
                        if(seconds.toString().length === 1){
                            $(".seconds").text("0" + seconds);
                        }else{
                            $(".seconds").text(seconds);
                        }
                        window.localStorage.hours = $(".hours").text();
                        window.localStorage.minutes = $(".minutes").text();
                        window.localStorage.seconds = $(".seconds").text();
                    }
                }
            });
        }
    }
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            var mk = new BMap.Marker(r.point);
            map.addOverlay(mk);
            map.panTo(r.point);
            var removePoint = {"lng":r.point.lng,"lat":r.point.lat};
            $.ajax({
                type:"post",
                url:"/removepoint",
                async:"false",
                data:{
                    "lng":r.point.lng,
                    "lat":r.point.lat,
                    "cyclenumber":window.localStorage.cycleNumber
                }
            })
        }
    },{enableHighAccuracy: true});
    //点击结束行程时跳转主页
    $(document).on("tap",".end",function(){
        geolocation.getCurrentPosition(function(r){
            if(this.getStatus() == BMAP_STATUS_SUCCESS){
                var mk = new BMap.Marker(r.point);
                map.addOverlay(mk);
                map.panTo(r.point);
                //alert('您的位置：'+r.point.lng+','+r.point.lat);
                var nowPoint = {"lng":r.point.lng,"lat":r.point.lat};
                $.ajax({
                    type:"post",
                    url:"/updatepoint",
                    async:"false",
                    data:{
                        "lng":r.point.lng,
                        "lat":r.point.lat,
                        "cyclenumber":window.localStorage.cycleNumber
                    }
                })
            } else {
                alert('failed'+this.getStatus());
            }
        },{enableHighAccuracy: true});
        clearInterval(stopTimer);
        var money = parseInt($(".hours").text())*0.6 + parseInt($(".minutes").text())*0.01;
        window.localStorage.spend = money;
        var time = window.localStorage.hours+':'+window.localStorage.minutes+':'+window.localStorage.seconds;
        $.ajax({
            type:"post",
            url:"/updateschedule",
            async:"false",
            data:{
                "number":window.localStorage.number,
                "cyclenumber":window.localStorage.cycleNumber,
                "spend":window.localStorage.spend,
                "time":time
            }
        });
        delete window.localStorage.hours;
        delete window.localStorage.minutes;
        delete  window.localStorage.seconds;
        delete window.localStorage.spend;
        $(".pay").css("display","block").siblings().css("display","none");
        $(".spend").text(money);
        $.ajax({
            type:"post",
            url:"/money",
            async:"false",
            data:{"number":window.localStorage.number,"money":money}
        });
        stopSecond3 = setInterval("sec()",1000);
    });
    //行程结束后三秒倒计时
    var val = Number($(".pay .returnS").text());
    function sec(){
        val--;
        //window.localStorage.val = val;
        $(".returnS").text(val);
        console.log(val);
        if(val == 0){
            clearInterval(stopSecond3);
            //delete window.localStorage.val;
            location.href = "head.html";
        }
    }
}else{
    location.href = "login.html";
}
//定义日期格式
//Date.prototype.Format = function (fmt) { //author: meizz
//    var o = {
//        "M+": this.getMonth() + 1, //月份
//        "d+": this.getDate(), //日
//        "h+": this.getHours(), //小时
//        "m+": this.getMinutes(), //分
//        "s+": this.getSeconds(), //秒
//        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
//        "S": this.getMilliseconds() //毫秒
//    };
//    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
//    for (var k in o)
//        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
//    return fmt;
//};