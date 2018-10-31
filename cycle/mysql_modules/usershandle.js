var mysql  = require('mysql');  //调用MySQL模块
//创建一个connection
var connection = mysql.createConnection({
    host     : '127.0.0.1',       //主机
    user     : 'root',            //MySQL认证用户名
    password:'',
    port:   '3306',
    database: 'users_info'
});
var _TABLE = 'phone_number';
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
    connection.query('SELECT * FROM '+ _TABLE + ' where number='+data.number,function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            if(!results[0]){
                insertdata(data);
                next(data);
            }else{
                if(!data.money){
                    connection.query('update phone_number set cip=? where number=?',[data.cip,data.number]);
                }
                next(results[0]);
            }
        }
    );
}
function insertdata(data,next){
    //新用户插入数据
    console.log(data);
    var addVip = 'insert into phone_number(number,money,cip,name,sex,school,authentication,idcard) values(?,300,?,"未填写","未填写","未填写","未认证","未认证")';
    var wenhao = [data.number,data.cip];
    connection.query(addVip,wenhao, function(error, result){
        if(error){
            console.log(error.message);
        }else{
            console.log('新用户插入成功');
        }
    });
}
function update(money,next){
    //修改余额
    connection.query('SELECT * FROM '+ _TABLE + ' where number='+ money.number ,function selectCb(err, results, fields) {
        if (err) {
            throw err;
        }
        var yuer = results[0].money-money.money;
        if(yuer < 0){
            //余额不足
        }else{
            //余额充足
            var addVip = 'update ' + _TABLE + ' set money=' + yuer + ' where number='+ money.number;
            connection.query(addVip, function(error, result){
                if(error){
                    console.log(error.message);
                }else{
                    console.log("余额修改成功");
                }
            });
        }
    });
}
function logjudge(data,next){
    //查询，并设置回调函数
    connection.query('SELECT * FROM '+ _TABLE + ' where number='+data.number,function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            next(results[0]);
        }
    );
}
function updatedata(addVip,wenhao,next){
    connection.query(addVip,wenhao,function(err,results){
        if (err) {
            throw err;
        }
        next("success");
    });
}
function findeallusers(next){
    //查询，并设置回调函数
    connection.query('SELECT * FROM '+ _TABLE ,function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            next(results);
        }
    );
}
function inmoney(addVip,data,next){
    connection.query('SELECT * FROM '+ _TABLE + ' where number='+data.number,function selectCb(err, results, fields) {
        if (err) {
            throw err;
        }
        var money = results[0].money + Number(data.addmoney);
        var wenhao = [money,data.number];
        updatedata(addVip,wenhao,function(){});
    })
}
function outmoney(addVip,data,next){
    connection.query('SELECT * FROM '+ _TABLE + ' where number='+data.number,function selectCb(err, results, fields) {
        if (err) {
            throw err;
        }
        var money = results[0].money - Number(data.removemoney);
        var wenhao = [money,data.number];
        updatedata(addVip,wenhao,function(){});
    })
}
//关闭connection
// connection.end(function(err){
//     if(err){
//         return;
//     }
//     console.log('[connection end] succeed!');
// });

//暴露接口
module.exports ={
    finddata:finddata,
    insertdata:insertdata,
    update:update,
    logjudge:logjudge,
    updatedata:updatedata,
    findeallusers:findeallusers,
    inmoney:inmoney,
    outmoney:outmoney
};