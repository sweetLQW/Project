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
function finddata(data,next){
    var $sql = "select * from admin_info where admin=? and password=?";
    var wenhao = [data.admin,data.password];
    connection.query($sql,wenhao,function selectCb(err, results, fields) {
        if (err) {
            throw err;
        }
        next(results);
    });
}
//暴露接口
module.exports ={
    finddata:finddata
};