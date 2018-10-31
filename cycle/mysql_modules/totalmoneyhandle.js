var mysql  = require('mysql');  //调用MySQL模块
//创建一个connection
var connection = mysql.createConnection({
    host     : '127.0.0.1',       //主机
    user     : 'root',            //MySQL认证用户名
    password:'',
    port:   '3306',
    database: 'users_info'
});
//创建一个connection
connection.connect(function(err){
    if(err){
        console.log('[query] - :'+err);
        return;
    }
    console.log('[connection connect]  succeed!');
});
function finddata(next){
    connection.query("select * from allmoney",function(err,results){
        if(err){
            console.log(err);
            return;
        }
        next(results);
    })
}
function update(data,next){
    connection.query('insert into allmoney(money) values('+ data +')',function(err,results){
        if(err){
            console.log(err);
            return;
        }
    })
}
module.exports = {
    finddata:finddata,
    update:update
};