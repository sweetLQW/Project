//点击提交时把选中的index值传递给后台，保存至对应车牌号的第三个字段中
if(window.localStorage.number){
    if(window.localStorage.cycleNumber){
        $(".sub-btn").click(function(){
            $("input[type='radio']").each(function(){
                if($(this).is(':checked')) {
                    var idx = $(this).parents().index()+1;
                    var obj = {
                        "number": window.localStorage.cycleNumber,
                        "index":idx
                    };
                    console.log(obj);
                    $.ajax({
                        type:"post",
                        url:"question",
                        data:obj
                    })
                }
            });
            delete window.localStorage.cycleNumber;
            location.href = "head.html";
        });
    }
}else{
    location.href = "login.html";
}
