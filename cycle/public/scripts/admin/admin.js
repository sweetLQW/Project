if(window.localStorage.admin) {
    console.log("管理员信息存在本地");
    location.href = "admin_head.html";
}else{
    console.log("用户信息不存在本地");
    var str1 = /^[0-9a-zA-Z]{6}$/;
    $("#checkPassword").blur(function(){
        var checkCode = $(this).val();
        var result = str1.test(checkCode);
        if(result == false){
            $("h6").text("密码为6位数字或字母组合！")
        }else{
            $("h6").text("");
        }
    });
    //点击登录
    $(document).on("click",".login",function(){
        var admin = $("#admin").val();//手机号码
        if(admin != ""){
                //判断验证码是否正确
                var password = $("#password").val();
                if(password != ""){
                        $.ajax({
                            type:"post",
                            url:"/adminlogin",
                            async:"false",
                            data:{
                                "admin":admin,
                                "password":password
                            },
                            success:function(data){
                                console.log(data);
                                if(data.length != 0){
                                    //自动写入localStorage
                                    window.localStorage.clear(); //清除所有的变量和值
                                    window.localStorage.admin = $("#admin").val();
                                    location.href = "admin_head.html";
                                }else{
                                    $(".prompt").text("帐号或密码错误！");
                                }
                            },
                            error:function(){
                                window.localStorage.clear(); //清除所有的变量和值
                            }
                        })
                }else{
                    $(".prompt").text("验证码不能为空！");
                    return false;
                }
        }else{
            $("h6").text("帐号不能为空！");
            return false;
        }
    });
};