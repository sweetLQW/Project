test();
var stoplogjudge = setInterval("logjudge()",2000);
function test(){
    if(window.localStorage.number){
        if(document.URL != "http://123.207.144.242:2000/timing.html"){
            $.ajax({
                type: "post",
                url: "/gettime",
                async:"false",
                data: {
                    "number": window.localStorage.number
                },
                success:function(data){
                    console.log(data);
                    if(data != "null"){
                        window.localStorage.hours = true;
                        location.href = "timing.html";
                    }
                }
            });
        }
    }
}
function showusersnumber(){
    var a = window.localStorage.number;
    $(".hidenumber").text(a);
    var start = a.substring(0,3);
    var end = a.substring(7,11);
    var showdata = start + '****' + end;
    console.log(showdata);
    $(".number").text(showdata);
}
function logjudge(){
    console.log("logjudge");
    $.ajax({
        type:"post",
        url:"/logjudge",
        async:"false",
        data:{
            "number":window.localStorage.number,
            "cip":window.localStorage.cip
        },
        success:function(data){
            if(data.cip != window.localStorage.cip){
                var $quit = $("<div class='quit'><div class='nav'><p>您好，由于您的账号已在另一设备登录，您已被迫下线,，如非本人操作，请及时更改密码。</p><input type='button' value='确定'></div></div>");
                $("body").append($quit);
                window.localStorage.clear();
                clearInterval(stoplogjudge);
            }
        }
    })
}
$(document).on("tap",".quit input",function(){
    location.href = "login.html";
});