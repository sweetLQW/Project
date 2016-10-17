define(function(require,exports,module){
	function click(){
		$(".add1").click(function(){
			var text = $(".number").text();
			text = Number(text) + 1;
			$(".number").text(text);
		})
		$(".sub").click(function(){
			var text = $(".number").text();
			if(text > 0){
				text = Number(text) - 1;
				$(".number").text(text);
			}
		})
	}
	module.exports = {
		cl:click,
	}
	
})
