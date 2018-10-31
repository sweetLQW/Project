var mysql  = require('mysql');  //调用MySQL模块
//创建一个connection
var connection = mysql.createConnection({
    host     : '127.0.0.1',       //主机
    user     : 'root',            //MySQL认证用户名
    password:'',
    port:   '3306',
    database: 'personal_info',
    dateStrings:true
});
var _TABLE = 'idcard_number';
//创建一个connection
connection.connect(function(err){
    if(err){
        console.log('[query] - :'+err);
        return;
    }
    console.log('[connection connect]  succeed!');
});
function finddata(addVip,wenhao1,next){
    connection.query(addVip,wenhao1,function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            console.log(results);
            next(results[0]);
        }
    );
}
//暴露接口
module.exports ={
    finddata:finddata
};