
function goToByScroll(id) {
	$('html,body').animate({
		scrollTop: $("#"+id).offset().top
	}, 'slow');
}

$("form").on('submit', function (e) {
	e.preventDefault();
	$.ajax({
		type: "POST",
		cache: false,
		url: $(this).attr('action'),
		data: $(this).serialize(),
		success: function(data) {
			$msg = $("#msgSpace");
			
			$msg.hide();
			
			if (data.status == 0) {
				$msg.html('<div class="alert alert-success alert-dismissable"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>¡Se ha registrado al aspirante con éxito!</strong></div>');
			} else {
				$msg.html('<div class="alert alert-danger alert-dismissable"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>¡Error!</strong> ' + data.status + ' (' + data.code + ')</div>');
			}
			
			$msg.show();
		}
	});
});
