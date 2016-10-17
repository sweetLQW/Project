var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/managementSystem";
function checkdData(option,next){
    //0 登陆成功
    //1 密码错误
    //2 用户名错误
    MongoClient.connect(url,function(err,db){
        //性能优化版
        var condition= {"email":option.email};
        db.collection("users").find(condition).toArray(function(err,docs){
            db.close();
            if(docs.length === 0){
                next(2);
            }else if(docs[0].password === option.password){
                next(0);
            }else{
                next(1);
            }
        })
    })
}
function checkuser(option,next){
    MongoClient.connect(url,function(err,db){
        var condition= {"email":option};
        db.collection("users").find(condition).toArray(function(err,docs){
            next(docs);
            db.close();
        })
    })
}
module.exports = {
    checkData:checkdData,
    checkuser:checkuser
}
