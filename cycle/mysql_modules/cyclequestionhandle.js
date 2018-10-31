var mysql  = require('mysql');  //调用MySQL模块
//创建一个connection
var connection = mysql.createConnection({
    host     : '127.0.0.1',       //主机
    user     : 'root',            //MySQL认证用户名
    password:'',
    port:   '3306',
    database: 'users_info'
});
var _TABLE = 'question_number';

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
            if(results.length == 0){
                insertdata(data);
            }else {
                for(var i = 0;i<results.length;i++){
                    if(results[i].number == data.number){
                        update(data,results[i]);
                        return;
                    }else{
                        hint = 0;
                    }
                }
            }
            if(hint === 0){
                insertdata(data);
            }
            next(results);
        }
    );
}
function insertdata(data,next){
    var addVip = 'insert into ' + _TABLE + '(number,question) values(' + data.number + ','+ data.index +')';
    connection.query(addVip, function(error, result){
        if(error){
            console.log(error.message);
        }else{
            console.log('insert id: '+result.insertId);
        }
    });
}
function update(data,results){
    //修改数据
    var arr = results.question.split("");
    for(var i = 0;i<arr.length;i++){
        if(arr[i] === data.index){
            console.log("已经有此问题");
            return;
        }
    }
    var question = results.question+data.index;
    console.log(question);
    var addVip = 'update ' + _TABLE + ' set question=' + question + ' where number='+ data.number;
    console.log(addVip);
    connection.query(addVip, function(error, result){
        if(error){
            console.log(error.message);
        }else{
            console.log("修改成功");
        }
    });
}
function showquestion(next){
    connection.query('SELECT * FROM '+ _TABLE,function(err, results){
        if (err) {
            throw err;
        }
        next(results);
    })
}
function deletedata(addVip,wenhao,next){
    connection.query(addVip,wenhao,function(err, results){
        if (err) {
            throw err;
        }
        next(results);
    })
}
//暴露接口
module.exports ={
    finddata:finddata,
    insertdata:insertdata,
    update:update,
    showquestion:showquestion,
    deletedata:deletedata
};
