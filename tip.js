/**
 * Tiny simplistic tooltip plugin for jQuery
 * version 0.1.0
 * Kane Cohen [KaneCohen@gmail.com] | https://github.com/KaneCohen
 * @preserve
 */
(function(factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else {
		factory(jQuery);
	}
}(function($) {
	$.fn.tip = function(options) {
		var args = arguments,
		    o = $.extend(true, {}, options);

		var tip = $(o.parent || document).data('tip');
		o.selector = this.selector || '.tip';
		if (tip) {
			tip.trigger.apply(tip, args);
		} else {
			new Tip(o);
		}
		return this;
	};

	function Tip(o) {
		this.init(o);
	}

	Tip.prototype = {
		o: {},
		d: {
			parent:   null,   // Object to bind listeners to.
			showTime: 200,
			hideTime: 1000,
			arrowSize: 5,
			follow:   false,   // Follow mouse. Values: 'x', 'y', 'xy', false.
			position: 'auto',  // top, bottom, left, right, auto.
			align:    'right', // center, right
			aside:    false,   // Place tooltip to the left/right based on "position" option. true, false.
			selector: '.tip',
			tpl: '<div id="tip" style="visibility: hidden;">' +
				'<div class="content"></div>' +
				'<i class="arrow"></i>' +
			'</div>'
		},
		v: {},
		dv: {
			timer: null,
			enter: null,
			active: false,
			follow: {
				x: false,
				y: false
			}
		},
		init: function(o) {
			this.o = $.extend({}, this.d, o);
			this.v = $.extend({}, this.dv);
			this.o.parent = o.parent || document;
			this.initEvents();
			$(this.o.parent).data('tip', this);
		},

		initEvents: function() {
			var self = this;
			$(this.o.parent).on('mouseover.tip', this.o.selector, function(e) {
				var el = $(this);
				if (! el.data('tip') && el.attr('title')) {
					el.attr('data-tip', $.trim(el.attr('title')));
				}
				el.removeAttr('title');
				$('#tip').remove();
				clearTimeout(self.v.timer);
				clearTimeout(self.v.enter);
				if (self.v.active) {
					self.show(e, el);
				} else {
					self.v.timer = setTimeout(function() {
						self.v.active = true;
						self.show(e, el);
					}, self.o.showTime);
				}
			});

			$(this.o.parent).on('mouseout.tip mousedown.tip', self.o.selector+', #tip', function(e) {
				$(self.o.parent).off('mousemove.tip');
				$('#tip').remove();
				clearTimeout(self.v.timer);
				clearTimeout(self.v.enter);
				self.v.enter = setTimeout(function() {
					self.v.active = false;
				}, self.o.hideTime);
			});
		},

		show: function(e, el) {
			var self = this,
			    o    = this.o,
			    v    = this.v,
			    tip  = $.trim(el.data('tip')),
			    follow   = el.data('tipFollow') || o.follow,
			    align    = el.data('tipAlign') || o.align,
			    aside    = el.data('tipAside') || o.aside,
			    position = el.data('tipPosition') || o.position;

			if (follow) {
				v.follow.x = follow.indexOf('x') >= 0;
				v.follow.y = follow.indexOf('y') >= 0;
			}

			if (tip !== null && tip.length !== 0) {
				var template = $(self.o.tpl),
				    arrow = template.find('.arrow'),
						win = {
							left: $(window).scrollLeft(),
							top: $(window).scrollTop(),
							width: $(window).width(),
							height: $(window).height()
						},
				    b = el[0].getBoundingClientRect();

				template.find('.content').text(tip);
				$('body').append(template);

				var tb = template[0].getBoundingClientRect(),
				    w  = tb.width,
				    h  = tb.height,
				    maxX = win.width - w,
				    maxY = win.height - h;
				template.css({
					width: w,
					height: h
				});

				var p = {
					left: align == 'right' ? b.left + (b.width/2) - 9 : b.left + (b.width/2) - (tb.width/2),
					top:  b.top-h-o.arrowSize
				};

				if (aside || position == 'left' || position == 'right') {
					position = position != 'left' || position != 'right' ? 'right' : position;
					p.top = b.top + (b.height/2) - (h/2) + 2;
					p.left = b.left - w - o.arrowSize;
					if (p.left > maxX) {
						p.left = b.right + o.arrowSize;
						position = 'left';
					} else if (p.left < 0 || position == 'right') {
						p.left = b.right + o.arrowSize;
					}
				} else {
					if (align == 'center') {
						arrow.css({left: (tb.width/2)-o.arrowSize});
					}
					if (p.left > maxX) {
						arrow.css({left: p.left-maxX+o.arrowSize});
						p.left = maxX;
					} else if (p.left < 0) {
						p.left = 0;
					}
					if (p.top > maxY) {
						p.top = maxY;
					} else if (p.top < 0 || position == 'bottom') {
						p.top = b.bottom + o.arrowSize;
						position = 'bottom';
					}
				}

				position = position == 'auto' ? 'top' : position;
				template.addClass(position);

				if (follow) {
					p = this.calculatePos(position, p, tb, win, align, e);

					$(this.o.parent).on('mousemove.tip', function(e) {
						p = self.calculatePos(position, p, tb, win, align, e);
						template[0].style.left = p.left+'px';
						template[0].style.top = p.top+'px';
					});
				}

				template.css({left: p.left, top: p.top, visibility: 'visible'});
			}
		},

		calculatePos: function(position, p, tb, win, align, e) {
			if (position == 'top' || position == 'bottom') {
				if (this.v.follow.x) {
					p.left = align == 'right' ? e.pageX-win.left-9 : e.pageX-win.left-(tb.width/2);
				}
				if (this.v.follow.y) {
					p.top = e.pageY-h-win.top-9;
					p.top += p.top < 0 ? h*2 : 0;
				}
			} else {
				if (v.follow.x) {
					p.left = e.pageX-win.left+9;
				}
				if (v.follow.y) {
					p.top = e.pageY-(h/2)-win.top+2;
				}
			}
			return p;
		},

		destroy: function() {
			$(this.o.parent).off('.tip');
			$('#tip').remove();
		},

		trigger: function(name) {
			var args = Array.prototype.slice.call(arguments, 1);
			if (this[name]) {
				if (this[name].apply(this, args) === false)
					return false;
			}
			return true;
		}
	};

}));
