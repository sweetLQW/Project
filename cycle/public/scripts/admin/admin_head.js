console.log(window.localStorage);
if(window.localStorage.admin){
    //显示用户手机号信息
    $(".admin").text(window.localStorage.admin);
    //点击显示侧边栏
    $(document).on("tap",".menu",function(){
        $(".side").css("display","block");
    });
    //滑动左侧边显示侧边栏
    $(".container-bar").swipeRight(function(){
        $(".side").css("display","block");
    });
    //左滑关闭菜单栏
    $(".side").swipeLeft(function(){
        $(".side").css("display","none");
    });
    $(document).on("tap",".side-side",function(){
        $(".side").css("display","none");
    });
    //点击退出登录
    $(document).on("tap",".exit",function () {
        window.localStorage.clear(); //清除所有的变量和值
        location.href = "login.html";
    });
    //点击li进入内容
    var child = document.getElementsByClassName("child-title");
    for(var idx = 0;idx < $(".child-title").length;idx++){
        console.log(child);
        child[idx].onclick = (function(i){
            return function(){
                $(".side").css("display","none");
                $(".nav").eq(i).css("display","block").siblings().css("display","none");
            }
        })(idx)
    }
    //用户信息模块
    refresh();
    function refresh(){
        $("table tbody").empty();
        $.ajax({
            "type":"get",
            "url":"/findallusers",
            async:"false",
            success:function(data){
                console.log(data[0][1]);
                for(var i = 0;i<data.length;i++){
                    var $tr = $("<tr></tr>");
                    if(data[i].lockstatus != "lock"){
                        for(var j in data[i]){
                            if(j == "idcard" || j == "name" || j == "school" || j == "number"){
                                var $td = $("<td></td>");
                                $td.text(data[i][j]);
                                $tr.append($td);
                            }else if(j == "lockstatus"){
                                var $td = $("<td class='surelock'></td>");
                                $td.text("封停");
                                $tr.append($td);
                            }
                        }
                        $(".usersinfo tbody").append($tr);
                    }else{
                        console.log("lock");
                        for(var j in data[i]){
                            if(j == "idcard" || j == "name" || j == "school" || j == "number"){
                                var $td = $("<td></td>");
                                $td.text(data[i][j]);
                                $tr.append($td);
                            }else if(j == "lockstatus"){
                                var $td = $("<td class='cancellock'></td>");
                                $td.text("解锁");
                                $tr.append($td);
                            }
                        }
                        $(".lock tbody").append($tr);
                    }
                }
            }
        });
        $.ajax({
            type: "get",
            url: "/showquestion",
            async:"false",
            success: function (data) {
                console.log(data);
                for(var i = 0;i<data.length;i++){
                    var $tr = $("<tr></tr>");
                        for(var j in data[i]){
                            if(j == "number"){
                                var $td = $("<td></td>");
                                $td.text(data[i][j]);
                                $tr.append($td);
                            }else if(j == "question"){
                                console.log();
                                var arr = data[i][j].split("");
                                var a = '', b = '', c = '', d = '', e = '', f = '',g = '';
                                for(var k = 0;k<arr.length;k++){
                                    switch (Number(arr[k]))
                                    {
                                        case 0:
                                            a=".问题0";
                                            break;
                                        case 1:
                                            b=".问题1";
                                            break;
                                        case 2:
                                            c=".问题2";
                                            break;
                                        case 3:
                                            d=".问题3";
                                            break;
                                        case 4:
                                            e=".问题4";
                                            break;
                                        case 5:
                                            f=".问题5";
                                            break;
                                        case 6:
                                            g=".问题6";
                                            break;
                                    }
                                }
                                var str = a+b+c+d+e+f+g;
                                var nav = str.split("undefined").join("").split(".").join(",");
                                var $td = $("<td class=''></td>");
                                $td.text(nav);
                                $tr.append($td);
                            }
                        }
                        var $td = $("<td class='questionend'></td>");
                        $td.text("点击修理完成");
                        $tr.append($td);
                        $(".showquestion tbody").append($tr);
                    }
            },
            err:function(){
                $(".showquestion tbody").text("加载失败……");
            }
        });
        $.ajax({
            type:"get",
            url:"/showmoney",
            success:function(data){
                console.log(data);
                var money=0;
                for(var i in data){
                    money = money+data[i].money;
                }
                $(".totalmoney").text(money+'元');
            }
        });
        $.ajax({
            type:"get",
            url:"/showcycleby",
            success:function(data){
                console.log(data);
                $(".cycleby").text(data.length+'次');
            }
        });
        $.ajax({
            type:"get",
            url:"/showcycle",
            success:function(data){
                console.log(data);
                for(var i = 0;i<data.length;i++){
                    var $tr = $("<tr></tr>");
                    for(var j in data[i]){
                        if(j == "number" || j == "password"){
                            var $td = $("<td></td>");
                            $td.text(data[i][j]);
                            $tr.append($td);
                        }
                    }
                    var $td1 = $("<td class='update'></td>");
                    $td1.text("修改");
                    $tr.append($td1);
                    var $td2 = $("<td class='delete'></td>");
                    $td2.text("删除");
                    $tr.append($td2);
                    $(".cyclehandle tbody").append($tr);
                }
            }
        });
    }
    //点击解除封停
    $(document).on("tap",".cancellock",function(){
        var number = $(this).parent().find("td:nth-child(1)").text();
        console.log(number);
        $.ajax({
            type: "post",
            url: "/cancellock",
            async:"false",
            data:{"number": number},
            success: function (data) {
                alert("解除成功！");
                refresh();
            },
            err:function(){
                alert("解除失败！");
            }
        });
    });
    //点击封停
    $(document).on("tap",".surelock",function(){
        var number = $(this).parent().find("td:nth-child(1)").text();
        console.log(number);
        $.ajax({
            type: "post",
            url: "/surelock",
            async:"false",
            data:{"number": number},
            success: function (data) {
                alert("封停成功！");
                refresh();
            },
            err:function(){
                alert("封停失败！");
            }
        });
    });
    //点击修复完成
    $(document).on("tap",".questionend",function(){
        var cyclenumber = $(this).parent().find("td:nth-child(1)").text();
        $.ajax({
            type: "post",
            url: "/questionend",
            async:"false",
            data:{"number": cyclenumber},
            success: function (data) {
                alert("成功！");
                refresh();
            },
            err:function(){
                alert("失败！");
            }
        });
    });
    //点击添加车辆
    $(document).on("tap",".addcycle",function(){
        $(".cycle-number").val("");
        $(".cycle-password").val("");
        $(".use-modal").fadeIn();
        $(".subupdate").css("display","none");
        $(".subadd").css("display","block");
    });
    $(document).on("tap",".subadd",function(){
        $.ajax({
            type: "post",
            url: "/addcycle",
            async:"false",
            data:{
                "number": $(".cycle-number").val(),
                "password":$(".cycle-password").val()
            },
            success: function (data) {
                refresh();
            },
            err:function(){
                alert("失败！");
            }
        });
        $(".cycle-number").val("");
        $(".cycle-password").val("");
        $(".hint").text("");
        $(".use-modal").css("display","none");
    });
    //点击修改车辆密码
    $(document).on("tap",".update",function(){
        $(".use-modal").fadeIn();
        $(".subadd").css("display","none");
        $(".subupdate").css("display","block");
        var number = $(this).parent().find("td:nth-child(1)").text();
        var password = $(this).parent().find("td:nth-child(2)").text();
        $(".cycle-number").val(number);
        $(".cycle-number").attr("readonly","readonly");
        $(".cycle-password").val(password);
    });
    $(document).on("tap",".subupdate",function(){
        $.ajax({
            type: "post",
            url: "/updatecycle",
            async:"false",
            data:{
                "number": $(".cycle-number").val(),
                "password":$(".cycle-password").val()
            },
            success: function (data) {
                refresh();
            },
            err:function(){
                alert("失败！");
            }
        });
        $(".use-modal").css("display","none");
    });
    //点击删除车辆
    $(document).on("tap",".delete",function(){
        var cyclenumber = $(this).parent().find("td:nth-child(1)").text();
        $.ajax({
            type: "post",
            url: "/deletecycle",
            async:"false",
            data:{"number": cyclenumber},
            success: function (data) {
                alert("成功！");
                refresh();
            },
            err:function(){
                alert("失败！");
            }
        });
    });
    $(document).on("tap",".close",function(){
        $(".cycle-number").val("");
        $(".hint").text("");
        $(".use-modal").fadeOut();
    });
    //点击查车辆
    $(document).on("tap",".subsearch",function(){
        var cyclenumber = $(".search").val();
        $.ajax({
            type: "post",
            url: "/searchcycle",
            async:"false",
            data:{"number": cyclenumber},
            success: function (data) {
                $(".cyclehandle tbody").empty();
                for(var i = 0;i<data.length;i++){
                    var $tr = $("<tr></tr>");
                    for(var j in data[i]){
                        if(j == "number" || j == "password"){
                            var $td = $("<td></td>");
                            $td.text(data[i][j]);
                            $tr.append($td);
                        }
                    }
                    var $td1 = $("<td class='update'></td>");
                    $td1.text("修改");
                    $tr.append($td1);
                    var $td2 = $("<td class='delete'></td>");
                    $td2.text("删除");
                    $tr.append($td2);
                    $(".cyclehandle tbody").append($tr);
                }
            },
            err:function(){
                alert("失败！");
            }
        });
    });

}else{
    location.href = "login.html";
}
