// Tiny simplistic tooltip plugin for jQuery
// version 0.0.2
// Kane Cohen [KaneCohen@gmail.com] | https://github.com/KaneCohen
(function($) {
	$.fn.tip = function(options) {
		var defaults = {
			showTime: 200,
			hideTime: 1000
		};
		var o = $.extend({}, defaults, options),
		    timer = null,
		    enter = null,
				selector = this.selector || '.tip',
		    active = false,
		    tpl = '<div id="tip" class="transparent">' +
				'<div class="tipContent"></div>' +
				'<i class="tipArrow"></i>' +
			'</div>';

		$(document).on('mouseenter.tip', selector, function(e) {
			var el = $(this);
			$('#tip').remove();
			clearTimeout(timer);
			clearTimeout(enter);
			if (active) {
				tip(e, tpl, el);
			} else {
				timer = setTimeout(function() {
					active = true;
					tip(e, tpl, el);
				}, o.showTime);
			}
		});

		$(document).on('mouseleave.tip', selector+', #tip', function(e) {
			if ($(e.toElement).parent().is('#tip')) {
				return false;
			}
			$(document).off('mousemove.tip');
			$('#tip').remove();
			clearTimeout(timer);
			enter = setTimeout(function() {
				active = false;
			}, o.hideTime);
		});
		return true;
	};

	function tip(e, tpl, el) {
		var tip    = $.trim(el.attr('data-tip'));
		var follow = el.attr('data-tipFollow') || false;

		if (tip !== null && tip.length !== 0) {
			var template = $(tpl),
			    sl = $(document).scrollLeft(),
			    st = $(document).scrollTop(),
			    b  = el[0].getBoundingClientRect(),
			    arrow = template.find('.tipArrow');

			template.find('.tipContent').text(tip);
			$('body').append(template);

			var tb = template[0].getBoundingClientRect(),
			    w  = tb.width,
			    h  = tb.height,
			    winSL = $(window).scrollLeft(),
			    winST = $(window).scrollTop(),
			    winW  = $(window).width(),
			    winH  = $(window).height();

			var pos = {
				left: b.left + (b.width/2) - 9,
				top:  b.top-h
			};

			var maxX = winW - w,
					maxY = winH - h;

			if (pos.left > maxX) {
				arrow.css({left: pos.left-maxX+5});
				pos.left = maxX;
			} else if (pos.left < 0) {
				pos.left = 0;
			}

			if (pos.top > maxY) {
				pos.top = maxY;
			} else if (pos.top < 0) {
				pos.top = b.bottom + 4;
				if (! follow) {
					arrow.addClass('top');
				}
			}

			if (follow) {
				if (follow.indexOf('x') >= 0) {
					pos.left = e.pageX-9-winSL;
				}
				if (follow.indexOf('y') >= 0) {
					pos.top = e.pageY-tb.height-4-winST;
				}

				$(document).on('mousemove.tip', function(e) {
					if (follow.indexOf('x') >= 0) {
						pos.left = e.pageX-9-winSL;
					}
					if (follow.indexOf('y') >= 0) {
						pos.top = e.pageY-tb.height-4-winST;
					}

					template[0].style.left = pos.left+'px';
					template[0].style.top = pos.top+'px';
				});
			}

			template.css({left: pos.left, top: pos.top}).attr('class', null);
		}
	}
})(jQuery);
