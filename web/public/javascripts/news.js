$( document ).ready(function() {
    function rate(point, url) {
       $.get("/rate?point="+point+"&url="+url)
    }

	$(".rate-positive").click(function(e){
		rate(1, $(e.target).data("url"));
	})

	$(".rate-negative").click(function(e){
		rate(-1, $(e.target).data("url"));
	})
});
