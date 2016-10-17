define(function(require,exports,module){
	function click(){
		$(".sort").click(function(){
			$(".module").fadeIn(30);
		})
		$(".mo").click(function(){
			$(".module1").fadeIn(30);
		})
		$(".close").click(function(){
			$(".module").fadeOut(300);
			$(".module1").fadeOut(300);
		})
		$(".module .c-left ul li").click(function(){
			var nav = $(this).index();
			$(this).addClass("color").siblings().removeClass("color");
			$(".module .c-right div").eq(nav).addClass("active").siblings().removeClass("active");
		});
		$(".module1 .c-left ul li").click(function(){
			var nav = $(this).index();
			$(this).addClass("color").siblings().removeClass("color");
			$(".module1 .c-right div").eq(nav).addClass("active").siblings().removeClass("active");
		});
	}
	module.exports = {
		cl:click
	}
})