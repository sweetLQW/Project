
//addclass
$(".con-bottom .list").click(function(){
	$(this).addClass("active1").siblings().removeClass("active1")
});
//回顶部
$(window).scroll(function(){
	$(".cen-float .btop").css("display","block")
});
//选项卡
// $(function () {
//       $('#myTab li:eq(0) a').tab('show');
// });
$("#gun li").click(function(){
	var ind = $(this).index();
	switch(ind){
		case 0:var offset=$("#xcjj").offset();break;
		case 1:var offset=$("#fymx").offset();break;
		case 2:var offset=$("#qtsm").offset();break;
		case 3:var offset=$("#yhpl").offset();break;
	}	
	/*获取元素相对于文档的top和left位置*/
	var top=offset.top
	$("html,body").animate({scrollTop:top},2000);		
})





//加减1
$(".banner .center .cen-top .right .c-t-r-bottom .sub").click(function(){
	var num = Number($(".banner .center .cen-top .right .c-t-r-bottom .amount input").val());
	if(num > 0){
		$(".banner .center .cen-top .right .c-t-r-bottom .amount input").val(--num);
	}
})
$(".banner .center .cen-top .right .c-t-r-bottom .add").click(function(){
	var num = Number($(".banner .center .cen-top .right .c-t-r-bottom .amount input").val());
	$(".banner .center .cen-top .right .c-t-r-bottom .amount input").val(++num);
})
$(".banner .center .cen-top .right .c-t-r-bottom .su").click(function(){
	var num = Number($(".banner .center .cen-top .right .c-t-r-bottom .amoun input").val());
	if(num > 0){
		$(".banner .center .cen-top .right .c-t-r-bottom .amoun input").val(--num);
	}
})
$(".banner .center .cen-top .right .c-t-r-bottom .ad").click(function(){
	var num = Number($(".banner .center .cen-top .right .c-t-r-bottom .amoun input").val());
	$(".banner .center .cen-top .right .c-t-r-bottom .amoun input").val(++num);
})
//收藏
$(".collect img").click(function(){
	var src = $(".collect img").attr("src");
	if(src=="../images/wyy/wyy22.jpg"){
		$(".collect img").attr("src","../images/wyy/wyy222.jpg");
	}else if(src = "../images/wyy/wyy222.jpg"){
		$(".collect img").attr("src","../images/wyy/wyy22.jpg");
	}
})
//第二部分图片移动
var mySwiper = new Swiper('.swiper-container',{
	prevButton:'.swiper-button-prev',
	nextButton:'.swiper-button-next',
	slidesPerView : 4,
	slidesPerGroup : 1,
	loop: true,
	autoplay : 2000,
});
//第一部分图片移动
var n=0;
var arr=[];
function fun(){
	$(".sspic").animate({"margin-left":(-114*n)},500);
	n++;
	arr.push(n);
	n=n==3?0:n;
}
var t =setInterval(fun,1500);

$("but1").click(function(){

	$(".sspic").css("margin-left",-114*n)

})


$(".but2").click(function(){
	if(n!=0){
		$(".sspic").css("margin-left",114*n)
	}
})







$(".sspic img").click(function(){
	var ind = $(this).index();
	var src = "../images/wyy/wyy"+ind+".png"
	$(".change").attr("src",src);
})







