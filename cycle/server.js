var express = require("express");
var bodyParser = require("body-parser");
var usershandle = require("./mysql_modules/usershandle");
var cyclenumberhandle = require("./mysql_modules/cyclenumberhandle");
var cyclequestionhandle = require("./mysql_modules/cyclequestionhandle");
var cycleschedulehandle = require("./mysql_modules/cycleschedulehandle");
var totalmoneyhandle = require("./mysql_modules/totalmoneyhandle");
var personalhandle = require("./mysql_modules/personalhandle");
var adminhandle = require("./mysql_modules/adminhandle");
var Sms = require("alidayu-node");
var path = require("path");
var app = express();
app.set("view engine","html");
app.use(bodyParser.urlencoded({extended:"false"}));
app.use(express.static(path.join(__dirname,"public")));
//前台传入手机号发送验证码
app.post("/getcode",function(req,res){
    //前台传入手机号和验证码
    var data = req.body;
    console.log(data);
    //验证码
    var sms = new Sms('23619084', '6d86b9f516cf2a24ff79c1944f0001f6');
    sms.smsSend({
        sms_free_sign_name: '校园便捷单车', //短信签名
        sms_param: JSON.stringify({"code": data.code}),//短信变量，对应短信模板里面的变量
        rec_num: data.phone, //接收短信的手机号
        sms_template_code: 'SMS_44290242' //短信模板id
    });
});
//身份验证后进入主页
app.post("/head",function(req,res){
    var data = req.body;
    usershandle.finddata(data,function(data){
        res.send(data);
    })
});
//验证是否单设备登陆
app.post("/logjudge",function(req,res){
    var data = req.body;
    usershandle.logjudge(data,function(data){
        res.send(data);
    })
});
//获取密码开始计时
var cycleNumber;
app.post("/getpassword",function(req,res){
    cyclenumberhandle.finddata(req.body,function(data){
        cycleNumber = data;
        res.send(cycleNumber);
    })
});
app.get("/timing",function(req,res){
    res.send(cycleNumber);
});
//车辆问题提交
app.post("/question",function(req,res){
    cyclequestionhandle.finddata(req.body,function(data){
        console.log(data);
    });
});
//计算车费
app.post("/money",function(req,res){
    var money = req.body;
    console.log(money);
    if(money.money != 0){
        totalmoneyhandle.update(money.money);
        usershandle.update(money);
    }
});
//获取余额
app.post("/getbalance",function(req,res){
    usershandle.finddata(req.body,function(data){
        res.send(data);
    })
});
//提现充值
app.post("/in",function(req,res){
    console.log(req.body);
    var addVip = "update phone_number set money=? where number=?";
    usershandle.inmoney(addVip,req.body,function(data){
    })
});
app.post("/out",function(req,res){
    var addVip = "update phone_number set money=? where number=?";
    usershandle.outmoney(addVip,req.body,function(data){
    })
});
//行程开始
app.post("/insertschedule",function(req,res){
    var data = req.body;
    var date = new Date().Format("yyyy-MM-dd hh:mm:ss");
    data.starttime = date;
    var addVip = 'insert into schedule_number(number,starttime,cyclenumber,hint) values(?,?,?,"0")';
    wenhao = [data.number,data.starttime,data.cyclenumber];
    cycleschedulehandle.insertdata(data,addVip,wenhao);
});
//行程时间更新
app.post("/gettime",function(req,res){
    var date = new Date().Format("yyyy-MM-dd hh:mm:ss");
    var addVip = 'SELECT * FROM schedule_number where number=? and hint="0"';
    var wenhao = [req.body.number];
    cycleschedulehandle.finddata(addVip,wenhao,function(info){
        if(info[0]){
            var time = {"nowtime":date,"starttime":info[0].starttime,"hint":info[0].hint,"cyclenumber":info[0].cyclenumber};
            res.send(time);
        }else{
            res.send("null");
        }
    });
});
//行程结束
app.post("/updateschedule",function(req,res){
    var data = req.body;
    console.log(data);
    var date = new Date().Format("yyyy-MM-dd hh:mm:ss");
    data.endtime = date;
    var addVip = 'update schedule_number set spend=?,time=?,endtime=?,hint="1" where number=? and hint="0"';
    wenhao = [data.spend,data.time,data.endtime,data.number];
    cycleschedulehandle.update(addVip,wenhao);
});
//查看行程
app.post("/getschedule",function(req,res){
    var addVip = 'SELECT * FROM schedule_number where number=?';
    var wenhao = [req.body.number];
    cycleschedulehandle.finddata(addVip,wenhao,function(data){
        console.log(data);
        res.send(data);
    });
});
//查看或更新个人信息
app.post("/updatedata",function(req,res){
    console.log(req.body);
    var data = req.body;
    if(data.name == "birth"){
        var addVip = 'update phone_number set '+data.name+'="'+data.text+'" where number=?';
        var wenhao = [data.number];
    }else{
        var addVip = 'update phone_number set '+data.name+'=? where number=?';
        var wenhao = [data.text,data.number];
    }
    if(data.name == "idcard"){
        var addVip1 = 'select * from idcard_info where idcard=? and number=?';
        var wenhao1 = [data.text,data.number];
        personalhandle.finddata(addVip1,wenhao1,function(data){
            console.log(data);
            if(data){
                usershandle.updatedata(addVip,wenhao,function(data){
                    res.send(data);
                });
            }else{
                res.send("null");
            }
        })
    }else{
        usershandle.updatedata(addVip,wenhao,function(data){
            res.send(data);
        });
    }
});
//车辆定位
app.post("/updatepoint",function(req,res){
    console.log(req.body);
    var addVip = "update cycle_number set lng=?,lat=? where number=?";
    var wenhao = [req.body.lng,req.body.lat,req.body.cyclenumber];
    cyclenumberhandle.update(addVip,wenhao);
});
app.post("/removepoint",function(req,res){
    console.log(req.body);
    var addVip = "update cycle_number set lng=null,lat=null where number=?";
    var wenhao = [req.body.cyclenumber];
    cyclenumberhandle.update(addVip,wenhao);
});
app.get("/findpoint",function(req,res){
    cyclenumberhandle.findpoint(function(data){
        res.send(data);
    });
});
//管理员登录
app.post("/adminlogin",function(req,res){
    console.log(req.body);
    adminhandle.finddata(req.body,function(data){
       res.send(data);
    })
});
//管理员查看用户信息
app.get("/findallusers",function(req,res){
    usershandle.findeallusers(function(data){
        res.send(data);
    })
});
//取消封停
app.post("/cancellock",function(req,res){
    var addVip = "update phone_number set lockstatus='null' where number=?";
    var wenhao = [req.body.number];
    usershandle.updatedata(addVip,wenhao,function(data){
        res.send(data);
    })
});
//封停
app.post("/surelock",function(req,res){
    var addVip = "update phone_number set lockstatus='lock' where number=?";
    var wenhao = [req.body.number];
    usershandle.updatedata(addVip,wenhao,function(data){
        res.send(data);
    })
});
//显示问题车辆
app.get("/showquestion",function(req,res){
    cyclequestionhandle.showquestion(function(data){
        res.send(data);
    })
});
//修复完成车辆
app.post("/questionend",function(req,res){
    var addVip = 'delete FROM question_number where number=?';
    var wenhao = [req.body.number];
    cyclequestionhandle.deletedata(addVip,wenhao,function(data){
        res.send(data);
    })
});
//总余额
app.get("/showmoney",function(req,res){
    totalmoneyhandle.finddata(function(data){
        res.send(data);
    })
});
//车辆骑行总次数
app.get("/showcycleby",function(req,res){
    var addVip = "select * from schedule_number";
    var wenhao = [];
    cycleschedulehandle.finddata(addVip,wenhao,function(data){
        res.send(data);
    })
});
//显示车辆
app.get("/showcycle",function(req,res){
    var addVip = "select * from cycle_number";
    var wenhao = [];
    cyclenumberhandle.showcycle(addVip,wenhao,function(data){
        res.send(data);
    })
});
//查照车辆
app.post("/searchcycle",function(req,res){
    var addVip = "select * from cycle_number where number=?";
    var wenhao = [req.body.number];
    cyclenumberhandle.showcycle(addVip,wenhao,function(data){
        res.send(data);
    })
});
//添加车辆
app.post("/addcycle",function(req,res){
    var addVip = "insert into cycle_number(number,password) values(?,?)";
    var wenhao = [req.body.number,req.body.password];
    cyclenumberhandle.handledata(addVip,wenhao,function(data){
        res.send(data);
    })
});
//修改车辆密码
app.post("/updatecycle",function(req,res){
    var addVip = "update cycle_number set password=? where number=?";
    var wenhao = [req.body.password,req.body.number];
    cyclenumberhandle.handledata(addVip,wenhao,function(data){
        res.send(data);
    })
});
//删除车辆
app.post("/deletecycle",function(req,res){
    var addVip = "delete from cycle_number where number=?";
    var wenhao = [req.body.number];
    cyclenumberhandle.handledata(addVip,wenhao,function(data){
        res.send(data);
    })
});


app.listen(2000,function(){ 
    console.log("服务器已启动");
});

//定义日期格式
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




