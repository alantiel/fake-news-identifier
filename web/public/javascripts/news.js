$( document ).ready(function() {
    function rate(point, url) {
       $.get("/rate?point="+point+"&url="+url)
    }

    function detail(index){
    	window.location="/indexnew/" + index
    }

	$(".rate-positive").click(function(e){
		rate(1, $(e.target).data("url"));
	})

	$(".rate-negative").click(function(e){
		rate(-1, $(e.target).data("url"));
	})

	$(".detail").click(function(e){
		detail($(e.target).data("index"));
	})
});
