if(window.localStorage.number){
    showusersnumber();
    showusersinfo();
    $(document).on("tap",".direct",function(){
        $(".hint").text("");
        $(".text").val("");
        name = $(this).attr("id");
        var kk = $(this).attr("data-value");
        $(".p-name span").text(kk);
        $(".push").css("display","block");
        $(".n-top .page1").css("display","block").siblings().css("display","none");
        $(".text").val($($(this).children(".right"))[0].innerText);
    });
    //点击选择性别
    $(document).on("tap","#sex",function(){
        console.log(window.localStorage.sex);
        if(window.localStorage.sex == "女"){
            $(".push .page2 .female").attr("checked","checked");
        }else{
            $(".push .page2 .male").attr("checked","checked");
        }
        name = $(this).attr("id");
        $(".n-top .page2").css("display","block").siblings().css("display","none");
        $(".push").css("display","block");
    });
    //点击选择出生日期
    $(document).on("click",".md_ok",function(){
        showusersbirth()
    });
    $(document).on("click",".md_datearea li",function(){
        showusersbirth()
    });
    $("#birth .right").mdater();
    $(document).on("tap",".sure",function(){
        if($(".page1").css("display") == "block"){
            var text = $(".text").val();
        }else if($(".page2").css("display") == "block"){
            $(".page2 input").each(function(){
                if($(this).is(":checked")){
                    text =  $(this).attr("value");
                }
            })
        }
        var pushdata = {
            "number":window.localStorage.number,
            "name":name,
            "text":text
        };
        console.log(pushdata);
        $.ajax({
            type:"post",
            url:"/updatedata",
            data:pushdata,
            async:"false",
            success:function(data){
                if(data == "null"){
                    $(".hint").text("此身份证不存在或与所登录手机号不符，请重新输入！");
                }else{
                    $(".push").css("display","none");
                    name = null;
                    showusersinfo();
                }
            }
        })
    });
    $(document).on("tap",".cancel",function(){
        $(".push").css("display","none");
        name = null;
    });
}else{
    location.href = "login.html";
}
function showusersinfo(){
    $.ajax({
        type:"post",
        url:"/head",
        async:"false",
        data:{"number":window.localStorage.number,"money":true},
        success:function(data){
            console.log(data);
            $("#name .right").text(data.name);
            $("#sex .right").text(data.sex);
            window.localStorage.sex = data.sex;
            if(data.birth){
                $("#birth .right").val(data.birth);
            }else{
                $("#birth .right").val("未填写");
            }
            $("#school .right").text(data.school);
            if(data.idcard =="未认证"){
                $("#idcard .right").text(data.idcard);
            }else{
                $("#idcard .right").text("已认证");
                $("#idcard .right").css("readonly","readonly");
                $("#idcard .sign").empty();
                $("#idcard").removeClass("direct");
            }
            $("#authentication .right").text(data.authentication);
        }
    })
}
function showusersbirth(){
    var pushdata = {
        "number":window.localStorage.number,
        "name":"birth",
        "text":$("#birth .right").val()
    };
    console.log(pushdata);
    $.ajax({
        type:"post",
        url:"/updatedata",
        data:pushdata,
        async:"false",
        success:function(){
            showusersinfo();
        }
    })
}
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};