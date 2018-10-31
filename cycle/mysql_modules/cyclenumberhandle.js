var mysql  = require('mysql');  //调用MySQL模块
//创建一个connection
var connection = mysql.createConnection({
    host     : '127.0.0.1',       //主机
    user     : 'root',            //MySQL认证用户名
    password:'',
    port:   '3306',
    database: 'users_info'
});
var _TABLE = 'cycle_number';

//创建一个connection
connection.connect(function(err){
    if(err){
        console.log('[query] - :'+err);
        return;
    }
    console.log('[connection connect]  succeed!');
});

function finddata(data,next){
    //查询，并设置回调函数
    connection.query('SELECT * FROM '+ _TABLE,function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            var hint;
            for(var i = 0;i<results.length;i++){
                if(results[i].number == data.number){
                    hint = 1;
                    next(results[i]);
                    return;
                }else{
                    hint = 0;
                }
            }
            if(hint === 0){
                next(null);
            }
        }
    );
}
function findpoint(next){
    //查询，并设置回调函数
    connection.query('SELECT * FROM '+ _TABLE ,function selectCb(err, results, fields) {
        if (err) {
            throw err;
        }
        next(results);
    })
}
function update(addVip,wenhao,next){
    //查询，并设置回调函数
    connection.query(addVip,wenhao,function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
    })
}
function showcycle(addVip,wenhao,next){
    connection.query(addVip,wenhao,function(err,results){
        if(err){
            console.log(err);
        }
        next(results);
    })
}
function handledata(addVip,wenhao,next){
    connection.query(addVip,wenhao,function(err,results){
        if(err){
            console.log(err);
        }
        next("success");
    })
}
//暴露接口
module.exports ={
    finddata:finddata,
    update:update,
    findpoint:findpoint,
    showcycle:showcycle,
    handledata:handledata
};