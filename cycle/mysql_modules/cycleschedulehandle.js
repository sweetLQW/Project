var mysql  = require('mysql');  //调用MySQL模块
//创建一个connection
var connection = mysql.createConnection({
    host     : '127.0.0.1',       //主机
    user     : 'root',            //MySQL认证用户名
    password:'',
    port:   '3306',
    database: 'users_info',
    dateStrings:true
});
var _TABLE = 'schedule_number';
//创建一个connection
connection.connect(function(err){
    if(err){
        console.log('[query] - :'+err);
        return;
    }
    console.log('[connection connect]  succeed!');
});

function finddata(addVip,wenhao,next){
    connection.query(addVip,wenhao,function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            next(results);
        }
    );
}
function insertdata(data,addVip,wenhao){
    var $sql = 'SELECT * FROM schedule_number where number=? and hint="0"';
    var wen = [data.number];
    finddata($sql,wen,function(data){
        if(!data[0]){
            console.log("不存在未完成行程");
            connection.query(addVip,wenhao,function(error, result){
                if(error){
                    console.log(error.message);
                }else{
                    console.log('行程开始');
                }
            });
        }
    })
}
function update(addVip,wenhao){
    connection.query(addVip,wenhao,function(error, result){
        if(error){
            console.log(error.message);
        }else{
            console.log('行程结束');
        }
    });
}
//暴露接口
module.exports ={
    finddata:finddata,
    insertdata:insertdata,
    update:update
};