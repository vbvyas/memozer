function unclearFollowup(button) {
	var url = "/followups/incomplete/"
			+ button.children('[name="followup-id"]').val();
	// url = "#";
	$.get(url, function() {
		button.removeClass('follow-up-unclear').addClass('follow-up-clear');
		button.children('span').removeClass('fa').removeClass(
				'fa-check-square-o').addClass('glyphicon').addClass(
				'glyphicon-unchecked');
		button.unbind().click(function() {
			clearFollowup(button);
		});
	});
}

function clearFollowup(button) {
	var url = "/followups/complete/"
			+ button.children('[name="followup-id"]').val();
//	url = "#";
	$.get(url, function() {
		button.removeClass('follow-up-clear').addClass('follow-up-unclear');
		button.children('span').removeClass('glyphicon').removeClass(
				'glyphicon-unchecked').addClass('fa').addClass(
				'fa-check-square-o');
		button.unbind().click(function() {
			unclearFollowup(button);
		});
	});

}

$(function() {
	$('.follow-up-unclear').click(function() {
		var button = $(this);
		unclearFollowup(button);
	});
	$('.follow-up-clear').click(function() {
		var button = $(this);
		clearFollowup(button);
	});
});