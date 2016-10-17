define(function(require,exports,module){
	function click(){
		$(".timeSort").click(function(){
			$(".show").fadeIn(30);
			$(".show1").fadeOut(300);
		})
		$(".close").click(function(){
			$(".show").fadeOut(300);
			$(".show1").fadeOut(300);
		})
		$(".all").click(function(){
			$(".show1").fadeIn(30);
			$(".show").fadeOut(300);
		})
	}
	module.exports = {
		cl:click,
	}
	
})
