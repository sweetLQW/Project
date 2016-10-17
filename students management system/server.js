var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var session = require("express-session");
var usershandle = require("./my_modules/usershandle");
var datahandle = require("./my_modules/datahandle");
var studentshandle = require("./my_modules/studentshandle");
var app = express();
app.use(session({
    "secret":"hello",
    "cookie":{maxAge:10 * 1000}
}));
app.use(bodyParser.urlencoded({extended:"false"}));
app.set("view engine","jade");
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine","jade");
app.listen(3000,function(){
    console.log("服务器已启动");
})

app.get("/",function(req,res){
    var info = req.query.info;
    res.render("login",{info:info})
})
app.get("/students",function(req,res){
    if(req.session.email){
        datahandle.checkuser(req.session.email,function(data){
            res.render("students",{username:data[0].username});
        })
    }else{
        res.redirect("/");
    }
})
app.get("/users",function(req,res){
    if(req.session.email){
        datahandle.checkuser(req.session.email,function(data){
            res.render("users",{username:data[0].username});
        })
    }else{
        res.redirect("/");
    }
})
app.post("/home",function(req,res){
    var option = req.body;
    datahandle.checkData(option,function(result){
        if(result === 0){
            req.session.email = option.email;
            res.redirect("/students");
        }else if(result === 1){
            res.redirect("/?info=密码错误,请重新输入");
        }else{
            res.redirect("/?info=邮箱不存在,请重新输入");
        }
    })
})
//学生数据操作
app.get("/finddata",function(req,res){
    console.log("hh")
    studentshandle.finddata(function(data){
        res.send(data);
    })
})
app.post("/insertdata",function(req,res){
    studentshandle.insertdata(req.body,function(data){
        res.send(data);
    })
})
app.post("/removedata",function(req,res){
    studentshandle.removedata(req.body,function(data){
        res.send(data);
    })
})
app.post("/updatedata",function(req,res){
    var condition = {num:req.body.num}
    studentshandle.updatedata(condition,req.body,function(data){
        res.send(data);
    })
})
//y用户数据操作
app.get("/Ufinddata",function(req,res){
    console.log("hh")
    usershandle.finddata(function(data){
        console.log(data)
        res.send(data);
    })
})
app.post("/Uinsertdata",function(req,res){
    usershandle.insertdata(req.body,function(data){
        res.send(data);
    })
})
app.post("/Uremovedata",function(req,res){
    usershandle.removedata(req.body,function(data){
        res.send(data);
    })
})
app.post("/Uupdatedata",function(req,res){
    var condition = {email:req.body.email}
    usershandle.updatedata(condition,req.body,function(data){
        res.send(data);
    })
})
// studentshandle.removedata({"username":"LQW"},function(data){
//    console.log(data)
// })



