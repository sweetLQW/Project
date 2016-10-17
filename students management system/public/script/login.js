var str = /^[0-9a-zA-Z\_]{5,10}\@qq\.com$/;
var str = /^[0-9a-zA-Z\.]{6,10}$/
$(".email").blur(function(){
    var email = $(this).val();
    var result = str.test(email);
    if(result == false){
        $("h6").text("请输入正确的邮箱！")
    }else{
        $("h6").text("")
    }
})
$(".password").blur(function(){
    var password = $(this).val();
    var result = str.test(password);
    if(result == false){
        $("h6").text("请输入6-18位密码！")
    }else{
        $("h6").text("")
    }
})