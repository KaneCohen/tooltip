// Tiny simplistic tooltip plugin for jQuery
// version 0.0.1
// Kane Cohen [KaneCohen@gmail.com] | https://github.com/KaneCohen
(function($) {
	$.fn.tip = function(options) {
		var defaults = {
			showTime: 200,
			hideTime: 1000
		};
		var o = $.extend({}, defaults, options);
		var tpl = '<div id="tip" class="transparent">' +
				'<div class="tipContent"></div>' +
				'<i class="tipArrow"></i>' +
			'</div>';
		var timer = null,
				enter = null,
				active = false;
		$(document).on('mouseenter.tip', '.tip', function() {
			var el = $(this);
			$('#tip').remove();
			clearTimeout(timer);
			clearTimeout(enter);
			if (active) {
				tip(tpl, el);
			} else {
				timer = setTimeout(function() {
					active = true;
					tip(tpl, el);
				}, o.showTime);
			}
		});

		$(document).on('mouseleave.tip', '.tip', function() {
			$('#tip').remove();
			clearTimeout(timer);
			enter = setTimeout(function() {
				active = false;
			}, o.hideTime);
		});
		
		return true;
	};

	function tip(tpl, el) {
		var tip = $.trim(el.data('tip'));
		if (tip !== null && tip.length !== 0) {
			var template = $(tpl),
					sl = $(document).scrollLeft(),
					st = $(document).scrollTop(),
					b = el[0].getBoundingClientRect(),
					arrow = template.find('.tipArrow');
			template.find('.tipContent').text(tip);
			$('body').append(template);
			var tb = template[0].getBoundingClientRect(),
					w = tb.width, 
					h = tb.height,
					winW = $(window).width(),
					winH = $(window).height();
			var pos = {
				left: b.left + (b.width/2) - 9,
				top: b.top-h
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
				arrow.addClass('top');
			}
			template.css({left: pos.left, top: pos.top}).attr('class', null);
		}
	}
})(jQuery);
