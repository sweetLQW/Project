if(window.localStorage.number) {
	if(window.localStorage.hours){
		location.href = "timing.html";
	}else{
		console.log("用户信息存在本地");
		location.href = "head.html";
	}
}else{
	console.log("用户信息不存在本地");
	var str = /^[0-9]{11}$/;
	var str1 = /^[0-9]{4}$/;
	$("#checkCode").blur(function(){
		var checkCode = $(this).val();
		var result = str1.test(checkCode);
		if(result == false){
			$("h6").text("请输入4位验证码！")
		}else{
			$("h6").text("");
		}
	});

	//手机验证码
	var InterValObj; //timer变量，控制时间
	var count = 60; //间隔函数，1秒执行
	var curCount;//当前剩余秒数
	var code = ""; //验证码
	var codeLength = 6;//验证码长度
	function sendMessage() {
		curCount = count;
		var phone=$("#phone").val();//手机号码
		if(phone != ""){
			var result = str.test(phone);
			if(result == false){
				$("h6").text("请输入正确的手机号！");
			}else{
				$("h6").text("");
				//产生验证码
				for (var i = 0; i < codeLength; i++) {
					code += parseInt(Math.random() * 9).toString();
				}
				//设置button效果，开始计时
				$("#btnSendCode").attr("disabled", "true");
				$("#btnSendCode").val("请在" + curCount + "秒内输入验证码");
				InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
				//向后台发送处理数据
				$.ajax({
					type: "post", //用POST方式传输
					dataType: "text", //数据格式:JSON
					url: '/getcode', //目标地址
					data: "phone=" + phone + "&code=" + code,
					cache:"false",
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						console.log("失败")
					},
					success: function (msg){
						console.log("成功")
					}
				});
			}
		}else{
			$("h6").text("手机号码不能为空！")
		}
	}
	//timer处理函数
	function SetRemainTime() {
		if (curCount == 0) {
			window.clearInterval(InterValObj);//停止计时器
			$("#btnSendCode").removeAttr("disabled");//启用按钮
			$("#btnSendCode").val("重新发送验证码");
			code = ""; //清除验证码。如果不清除，过时间后，输入收到的验证码依然有效
		}
		else {
			curCount--;
			$("#btnSendCode").val("请在" + curCount + "秒内输入验证码");
		}
	}
	//点击登录
	$(document).on("click",".login",function(){
		var phone=$("#phone").val();//手机号码
		if(phone != ""){
			var result = str.test(phone);
			if(result == false){
				$("h6").text("请输入正确的手机号！");
			}else {
				//判断验证码是否正确
				var checkCode = $("#checkCode").val();
				if(checkCode != ""){
					if(checkCode == code){
						console.log(checkCode);
						console.log(code);
						//自动写入localStorage
						window.localStorage.clear(); //清除所有的变量和值
						window.localStorage.number = $("#phone").val();
						window.localStorage.cip = returnCitySN["cip"];
							$.ajax({
								type:"post",
								url:"/head",
								async:"false",
								data:{
									"number":window.localStorage.number,
									"cip":window.localStorage.cip
								},
								success:function(data){
									if(data.lockstatus == "lock"){
										$(".prompt").text("您的账号已被封停！");
										window.localStorage.clear(); //清除所有的变量和值
									}else{
										location.href = "head.html";
									}
								},
								error:function(){
									window.localStorage.clear(); //清除所有的变量和值
								}
							})
					}else{
						$(".prompt").text("验证码错误，请重新输入！");
						return false;
					}
				}else{
					$(".prompt").text("验证码不能为空！");
					return false;
				}
			}
		}else{
			$("h6").text("手机号不能为空！");
			return false;
		}
	});
};