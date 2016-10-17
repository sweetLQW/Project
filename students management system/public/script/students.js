//修改
$("table tbody").delegate(".update","click",function(){
    $("#myModal").modal();
    var num = $(this).attr("data_num");
    $("#myform input").val("");
    $(".num").val(num).attr("readonly","readonly");
    $("#myform").submit(function(){
        var data = $(this).serialize();
        console.log(data)
        $.ajax({
            method:"post",
            url:"/updatedata",
            data:data,
        }).done(function(data){
            show(data);
        }).fail(function(){
            alert("失败");
        })
        return false
    })
})
//删除
$("table tbody").delegate(".del","click",function(){
    var num = $(this).attr("data_num");
    var condition = {"num":num};
    if(confirm("是否删除此条数据？")){
        $.ajax({
            "method":"post",
            "url":"/removedata",
            "data":condition
        }).done(function(data){
            show(data);
        })
    }
})
//点击弹出模态框,添加数据
$(".showinsert").click(function(){
    $("#myModal").modal();
    $("#myform input").val("").removeAttr("readonly");
    $("#myform").submit(function(){
        var data = $(this).serialize();
        console.log(data);
        $.ajax({
            method:"post",
            url:"/insertdata",
            data:data
        }).done(function(data){
            show(data);
        }).fail(function(){
            alert("失败");
        })
        return false
    })
})

//显示数据
$.ajax({
    method:"get",
    url:"/finddata",
}).done(function(db){
    show(db);
}).fail(function(){
    alert("失败");
})
function show(data){//显示在table中
    $(".tab tbody").empty();
    for(var i in data){
        var $tr = $("<tr></tr>");
        for(var j in data[i]){
            if(j!="_id" ){//不显示id
                var text = data[i][j];
                var $td = $("<td></td>");
                $td.text(text);
                $tr.append($td);
            }
        }
        $tr.append("<td><button class='update' data_num='" + data[i].num + "'>修改</button></td>");
        $tr.append("<td><button class='del' data_num='" + data[i].num + "'>删除</button></td>");
        $("table tbody").append($tr);
    }
}