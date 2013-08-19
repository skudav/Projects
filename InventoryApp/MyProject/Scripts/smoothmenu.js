
//** Smooth Navigational Menu

var ddsmoothmenu = {

    ///////////////////////// Global Configuration Options: /////////////////////////

    //Specify full URL to down and right arrow images (23 is padding-right for top level LIs with drop downs, 6 is for vertical top level items with fly outs):
    arrowimages: { down: ['downarrowclass', 'down.gif', 23], right: ['rightarrowclass', 'right.gif', 6] },
    transition: { overtime: 300, outtime: 300 }, //duration of slide in/ out animation, in milliseconds
    shadow: true, //enable shadow? (offsets now set in ddsmoothmenu.css stylesheet)
    showhidedelay: { showdelay: 100, hidedelay: 200 }, //set delay in milliseconds before sub menus appear and disappear, respectively
    zindexvalue: 1000, //set z-index value for menus
    closeonnonmenuclick: true, //when clicking outside of any "toggle" method menu, should all "toggle" menus close? 
    closeonmouseout: false, //when leaving a "toggle" menu, should all "toggle" menus close? Will not work on touchscreen

    /////////////////////// End Global Configuration Options ////////////////////////

    overarrowre: /(?=\.(gif|jpg|jpeg|png|bmp))/i,
    overarrowaddtofilename: '_over',
    detecttouch: !!('ontouchstart' in window) || !!('ontouchstart' in document.documentElement) || !!window.ontouchstart || !!window.Touch || !!window.onmsgesturechange || (window.DocumentTouch && window.document instanceof window.DocumentTouch),
    detectwebkit: navigator.userAgent.toLowerCase().indexOf("applewebkit") > -1, //detect WebKit browsers (Safari, Chrome etc)
    idevice: /ipad|iphone/i.test(navigator.userAgent),
    detectie6: (function () { var ie; return (ie = /MSIE (\d+)/.exec(navigator.userAgent)) && ie[1] < 7; })(),
    detectie9: (function () { var ie; return (ie = /MSIE (\d+)/.exec(navigator.userAgent)) && ie[1] > 8; })(),
    ie9shadow: function () { },
    css3support: typeof document.documentElement.style.boxShadow === 'string' || (!document.all && document.querySelector), //detect browsers that support CSS3 box shadows (ie9+ or FF3.5+, Safari3+, Chrome etc)
    prevobjs: [], menus: null,

    executelink: function ($, prevobjs, e) {
        var prevscount = prevobjs.length, link = e.target;
        while (--prevscount > -1) {
            if (prevobjs[prevscount] === this) {
                prevobjs.splice(prevscount, 1);
                if (link.href !== ddsmoothmenu.emptyhash && link.href && $(link).is('a') && !$(link).children('span.' + ddsmoothmenu.arrowimages.down[0] + ', span.' + ddsmoothmenu.arrowimages.right[0]).size()) {
                    if (link.target && link.target !== '_self') {
                        window.open(link.href, link.target);
                    } else {
                        window.location.href = link.href;
                    }
                    e.stopPropagation();
                }
            }
        }
    },

    updateprev: function ($, prevobjs, $curobj) {
        var prevscount = prevobjs.length, prevobj, $indexobj = $curobj.parents().add(this);
        while (--prevscount > -1) {
            if ($indexobj.index((prevobj = prevobjs[prevscount])) < 0) {
                $(prevobj).trigger('click', [1]);
                prevobjs.splice(prevscount, 1);
            }
        }
        prevobjs.push(this);
    },

    subulpreventemptyclose: function (e) {
        var link = e.target;
        if (link.href === ddsmoothmenu.emptyhash && $(link).parent('li').find('ul').size() < 1) {
            e.preventDefault();
            e.stopPropagation();
        }
    },

    getajaxmenu: function ($, setting, nobuild) { //function to fetch external page containing the panel DIVs
        var $menucontainer = $('#' + setting.contentsource[0]); //reference empty div on page that will hold menu
        $menucontainer.html("Loading Menu...");
        $.ajax({
            url: setting.contentsource[1], //path to external menu file
            async: true,
            error: function (ajaxrequest) {
                $menucontainer.html('Error fetching content. Server Response: ' + ajaxrequest.responseText);
            },
            success: function (content) {
                $menucontainer.html(content);
                !!!nobuild && ddsmoothmenu.buildmenu($, setting);
            }
        });
    },

    closeall: function (e) {
        var smoothmenu = ddsmoothmenu, prevscount;
        if (!smoothmenu.globaltrackopen) { return; }
        if (e.type === 'mouseleave' || ((e.type === 'click' || e.type === 'touchstart') && smoothmenu.menus.index(e.target) < 0)) {
            prevscount = smoothmenu.prevobjs.length;
            while (--prevscount > -1) {
                $(smoothmenu.prevobjs[prevscount]).trigger('click');
                smoothmenu.prevobjs.splice(prevscount, 1);
            }
        }
    },

    emptyhash: $('<a href="#"></a>').get(0).href,

    buildmenu: function ($, setting) {
        var smoothmenu = ddsmoothmenu;
        smoothmenu.globaltrackopen = smoothmenu.closeonnonmenuclick || smoothmenu.closeonmouseout;
        var zsub = 0; //subtractor to be incremented so that each top level menu can be covered by previous one's drop downs
        var prevobjs = smoothmenu.globaltrackopen ? smoothmenu.prevobjs : [];
        var $mainparent = $("#" + setting.mainmenuid).removeClass("ddsmoothmenu ddsmoothmenu-v").addClass(setting.classname || "ddsmoothmenu");
        //setting.$mainparent = $mainparent;
        var $mainmenu = $mainparent.find('>ul'); //reference main menu UL
        var method = smoothmenu.detecttouch ? 'toggle' : setting.method === 'toggle' ? 'toggle' : 'hover';
        var $topheaders = $mainmenu.find('>li>ul').parent(); //has('ul');
        //$mainparent.data('$headers', $topheaders);
        var orient = setting.orientation != 'v' ? 'down' : 'right', $parentshadow = $(document.body);
        $mainmenu.click(function (e) { e.target.href === smoothmenu.emptyhash && e.preventDefault(); });
        if (method === 'toggle') {
            if (smoothmenu.globaltrackopen) {
                smoothmenu.menus = smoothmenu.menus ? smoothmenu.menus.add($mainmenu.add($mainmenu.find('*'))) : $mainmenu.add($mainmenu.find('*'));
            }
            if (smoothmenu.closeonnonmenuclick) {
                if (orient === 'down') { $mainparent.click(function (e) { e.stopPropagation(); }); }
                $(document).unbind('click.smoothmenu').bind('click.smoothmenu', smoothmenu.closeall);
                if (smoothmenu.idevice) {
                    document.removeEventListener('touchstart', smoothmenu.closeall, false);
                    document.addEventListener('touchstart', smoothmenu.closeall, false);
                }
            } else if (setting.closeonnonmenuclick) {
                if (orient === 'down') { $mainparent.click(function (e) { e.stopPropagation(); }); }
                $(document).bind('click.' + setting.mainmenuid, function (e) { $mainmenu.find('li>a.selected').parent().trigger('click'); });
                if (smoothmenu.idevice) {
                    document.addEventListener('touchstart', function (e) { $mainmenu.find('li>a.selected').parent().trigger('click'); }, false);
                }
            }
            if (smoothmenu.closeonmouseout) {
                var $leaveobj = orient === 'down' ? $mainparent : $mainmenu;
                $leaveobj.bind('mouseleave.smoothmenu', smoothmenu.closeall);
            } else if (setting.closeonmouseout) {
                var $leaveobj = orient === 'down' ? $mainparent : $mainmenu;
                $leaveobj.bind('mouseleave.smoothmenu', function () { $mainmenu.find('li>a.selected').parent().trigger('click'); });
            }
            if (!$('style[title="ddsmoothmenushadowsnone"]').size()) {
                $('head').append('<style title="ddsmoothmenushadowsnone" type="text/css">.ddsmoothmenushadowsnone{display:none!important;}</style>');
            }
            var shadowstimer;
            $(window).resize(function () {
                clearTimeout(shadowstimer);
                var $selected = $mainmenu.find('li>a.selected').parent(),
			$shadows = $('.ddshadow').addClass('ddsmoothmenushadowsnone');
                $selected.eq(0).trigger('click');
                $selected.trigger('click');
                shadowstimer = setTimeout(function () { $shadows.removeClass('ddsmoothmenushadowsnone'); }, 100);
            });
        }

        $topheaders.each(function () {
            var $curobj = $(this).css({ zIndex: (setting.zindexvalue || smoothmenu.zindexvalue) + zsub-- }); //reference current LI header
            var $subul = $curobj.children('ul:eq(0)').css({ display: 'block' }).data('timers', {});
            var $link = $curobj.children("a:eq(0)").css({ paddingRight: smoothmenu.arrowimages[orient][2] }).append( //add arrow images
			'<span style="display: block;" class="' + smoothmenu.arrowimages[orient][0] + '"></span>'
		);
            var dimensions = {
                w: $link.outerWidth(),
                h: $curobj.innerHeight(),
                subulw: $subul.outerWidth(),
                subulh: $subul.outerHeight()
            };
            $subul.css({ top: orient === 'down' ? dimensions.h : 0 });
            function restore() { $link.removeClass('selected'); }
            method === 'toggle' && $subul.click(smoothmenu.subulpreventemptyclose);
            $curobj[method](
			function (e) {
			    if (!$curobj.data('headers')) {
			        smoothmenu.buildsubheaders($, $subul.find('>li>ul').parent(), setting, method, prevobjs);
			        $curobj.data('headers', true).find('>ul').css({ display: 'none', visibility: 'visible' });
			    }
			    method === 'toggle' && smoothmenu.updateprev.call(this, $, prevobjs, $curobj);
			    clearTimeout($subul.data('timers').hidetimer);
			    $link.addClass('selected');
			    $subul.data('timers').showtimer = setTimeout(function () {
			        var menuleft = orient === 'down' ? 0 : dimensions.w;
			        var menumoved = menuleft;
			        menuleft = ($curobj.offset().left + menuleft + dimensions.subulw > $(window).width()) ? (orient === 'down' ? -dimensions.subulw + dimensions.w : -dimensions.w) : menuleft; //calculate this sub menu's offsets from its parent
			        menumoved = menumoved !== menuleft;
			        $subul.css({ left: menuleft, width: dimensions.subulw }).stop(true, true).animate({ height: 'show', opacity: 'show' }, smoothmenu.transition.overtime, function () { this.style.removeAttribute && this.style.removeAttribute('filter'); });
			        if (menumoved) { $subul.addClass('repositioned'); } else { $subul.removeClass('repositioned'); }
			        if (setting.shadow) {
			            if (!$curobj.data('$shadow')) {
			                $curobj.data('$shadow', $('<div></div>').addClass('ddshadow toplevelshadow').prependTo($parentshadow).css({ zIndex: $curobj.css('zIndex') }));  //insert shadow DIV and set it to parent node for the next shadow div
			            }
			            smoothmenu.ie9shadow($curobj.data('$shadow'));
			            var offsets = $subul.offset();
			            var shadowleft = offsets.left;
			            var shadowtop = offsets.top;
			            $curobj.data('$shadow').css({ overflow: 'visible', width: dimensions.subulw, left: shadowleft, top: shadowtop }).stop(true, true).animate({ height: dimensions.subulh }, smoothmenu.transition.overtime);
			        }
			    }, smoothmenu.showhidedelay.showdelay);
			},
			function (e, speed) {
			    var $shadow = $curobj.data('$shadow');
			    if (method === 'hover') { restore(); }
			    else { smoothmenu.executelink.call(this, $, prevobjs, e); }
			    clearTimeout($subul.data('timers').showtimer);
			    $subul.data('timers').hidetimer = setTimeout(function () {
			        $subul.stop(true, true).animate({ height: 'hide', opacity: 'hide' }, speed || smoothmenu.transition.outtime, function () { method === 'toggle' && restore(); });
			        if ($shadow) {
			            if (!smoothmenu.css3support && smoothmenu.detectwebkit) { //in WebKit browsers, set first child shadow's opacity to 0, as "overflow:hidden" doesn't work in them
			                $shadow.children('div:eq(0)').css({ opacity: 0 });
			            }
			            $shadow.stop(true, true).animate({ height: 0 }, speed || smoothmenu.transition.outtime, function () { if (method === 'toggle') { this.style.overflow = 'hidden'; } });
			        }
			    }, smoothmenu.showhidedelay.hidedelay);
			}
		); //end hover/toggle
        }); //end $topheaders.each()
    },

    buildsubheaders: function ($, $headers, setting, method, prevobjs) {
        //setting.$mainparent.data('$headers').add($headers);
        $headers.each(function () { //loop through each LI header
            var smoothmenu = ddsmoothmenu;
            var $curobj = $(this).css({ zIndex: $(this).parent('ul').css('z-index') }); //reference current LI header
            var $subul = $curobj.children('ul:eq(0)').css({ display: 'block' }).data('timers', {}), $parentshadow;
            method === 'toggle' && $subul.click(smoothmenu.subulpreventemptyclose);
            var $link = $curobj.children("a:eq(0)").append( //add arrow images
			'<span style="display: block;" class="' + smoothmenu.arrowimages['right'][0] + '"></span>'
		);
            var dimensions = {
                w: $link.outerWidth(),
                subulw: $subul.outerWidth(),
                subulh: $subul.outerHeight()
            };
            $subul.css({ top: 0 });
            function restore() { $link.removeClass('selected'); }
            $curobj[method](
			function (e) {
			    if (!$curobj.data('headers')) {
			        smoothmenu.buildsubheaders($, $subul.find('>li>ul').parent(), setting, method, prevobjs);
			        $curobj.data('headers', true).find('>ul').css({ display: 'none', visibility: 'visible' });
			    }
			    method === 'toggle' && smoothmenu.updateprev.call(this, $, prevobjs, $curobj);
			    clearTimeout($subul.data('timers').hidetimer);
			    $link.addClass('selected');
			    $subul.data('timers').showtimer = setTimeout(function () {
			        var menuleft = dimensions.w;
			        var menumoved = menuleft;
			        menuleft = ($curobj.offset().left + menuleft + dimensions.subulw > $(window).width()) ? -dimensions.w : menuleft; //calculate this sub menu's offsets from its parent
			        menumoved = menumoved !== menuleft;
			        $subul.css({ left: menuleft, width: dimensions.subulw }).stop(true, true).animate({ height: 'show', opacity: 'show' }, smoothmenu.transition.overtime, function () { this.style.removeAttribute && this.style.removeAttribute('filter'); });
			        if (menumoved) { $subul.addClass('repositioned'); } else { $subul.removeClass('repositioned'); }
			        if (setting.shadow) {
			            if (!$curobj.data('$shadow')) {
			                $parentshadow = $curobj.parents("li:eq(0)").data('$shadow');
			                $curobj.data('$shadow', $('<div></div>').addClass('ddshadow').prependTo($parentshadow).css({ zIndex: $parentshadow.css('z-index') }));  //insert shadow DIV and set it to parent node for the next shadow div
			            }
			            var offsets = $subul.offset();
			            var shadowleft = menuleft;
			            var shadowtop = $curobj.position().top;
			            if (smoothmenu.detectwebkit && !smoothmenu.css3support) { //in WebKit browsers, restore shadow's opacity to full
			                $curobj.data('$shadow').css({ opacity: 1 });
			            }
			            $curobj.data('$shadow').css({ overflow: 'visible', width: dimensions.subulw, left: shadowleft, top: shadowtop }).stop(true, true).animate({ height: dimensions.subulh }, smoothmenu.transition.overtime);
			        }
			    }, smoothmenu.showhidedelay.showdelay);
			},
			function (e, speed) {
			    var $shadow = $curobj.data('$shadow');
			    if (method === 'hover') { restore(); }
			    else { smoothmenu.executelink.call(this, $, prevobjs, e); }
			    clearTimeout($subul.data('timers').showtimer);
			    $subul.data('timers').hidetimer = setTimeout(function () {
			        $subul.stop(true, true).animate({ height: 'hide', opacity: 'hide' }, speed || smoothmenu.transition.outtime, function () {
			            method === 'toggle' && restore();
			        });
			        if ($shadow) {
			            if (!smoothmenu.css3support && smoothmenu.detectwebkit) { //in WebKit browsers, set first child shadow's opacity to 0, as "overflow:hidden" doesn't work in them
			                $shadow.children('div:eq(0)').css({ opacity: 0 });
			            }
			            $shadow.stop(true, true).animate({ height: 0 }, speed || smoothmenu.transition.outtime, function () { if (method === 'toggle') { this.style.overflow = 'hidden'; } });
			        }
			    }, smoothmenu.showhidedelay.hidedelay);
			}
		); //end hover/toggle for subheaders
        }); //end $headers.each() for subheaders
    },

    init: function (setting) {
        if (this.detectie6 && parseFloat(jQuery.fn.jquery) > 1.3) {
            this.init = function (setting) {
                if (typeof setting.contentsource == "object") { //if external ajax menu
                    jQuery(function ($) { ddsmoothmenu.getajaxmenu($, setting, 'nobuild'); });
                }
                return false;
            };
            jQuery('link[href*="ddsmoothmenu"]').attr('disabled', true);
            jQuery(function ($) {
                alert('You Seriously Need to Update Your Browser!\n\nDynamic Drive Smooth Navigational Menu Showing Text Only Menu(s)\n\nDEVELOPER\'s NOTE: This script will run in IE 6 when using jQuery 1.3.2 or less,\nbut not real well.');
                $('link[href*="ddsmoothmenu"]').attr('disabled', true);
            });
            return this.init(setting);
        }
        var mainmenuid = '#' + setting.mainmenuid, right, down, stylestring = ['</style>\n'], stylesleft = setting.arrowswap ? 4 : 2;
        function addstyles() {
            if (stylesleft) { return; }
            if (typeof setting.customtheme == "object" && setting.customtheme.length == 2) { //override default menu colors (default/hover) with custom set?
                var mainselector = (setting.orientation == "v") ? mainmenuid : mainmenuid + ', ' + mainmenuid;
                stylestring.push([mainselector, ' ul li a {background:', setting.customtheme[0], ';}\n',
				mainmenuid, ' ul li a:hover {background:', setting.customtheme[1], ';}'].join(''));
            }
            stylestring.push('\n<style type="text/css">');
            stylestring.reverse();
            jQuery('head').append(stylestring.join('\n'));
        }
        if (setting.arrowswap) {
            right = ddsmoothmenu.arrowimages.right[1].replace(ddsmoothmenu.overarrowre, ddsmoothmenu.overarrowaddtofilename);
            down = ddsmoothmenu.arrowimages.down[1].replace(ddsmoothmenu.overarrowre, ddsmoothmenu.overarrowaddtofilename);
            jQuery(new Image()).bind('load error', function (e) {
                setting.rightswap = e.type === 'load';
                if (setting.rightswap) {
                    stylestring.push([mainmenuid, ' ul li a:hover .', ddsmoothmenu.arrowimages.right[0], ', ',
				mainmenuid, ' ul li a.selected .', ddsmoothmenu.arrowimages.right[0],
				' { background-image: url(', this.src, ');}'].join(''));
                }
                --stylesleft;
                addstyles();
            }).attr('src', right);
            jQuery(new Image()).bind('load error', function (e) {
                setting.downswap = e.type === 'load';
                if (setting.downswap) {
                    stylestring.push([mainmenuid, ' ul li a:hover .', ddsmoothmenu.arrowimages.down[0], ', ',
				mainmenuid, ' ul li a.selected .', ddsmoothmenu.arrowimages.down[0],
				' { background-image: url(', this.src, ');}'].join(''));
                }
                --stylesleft;
                addstyles();
            }).attr('src', down);
        }
        jQuery(new Image()).bind('load error', function (e) {
            if (e.type === 'load') {
                stylestring.push([mainmenuid + ' ul li a .', ddsmoothmenu.arrowimages.right[0], ' { background: url(', this.src, ') no-repeat;width:', this.width, 'px;height:', this.height, 'px;}'].join(''));
            }
            --stylesleft;
            addstyles();
        }).attr('src', ddsmoothmenu.arrowimages.right[1]);
        jQuery(new Image()).bind('load error', function (e) {
            if (e.type === 'load') {
                stylestring.push([mainmenuid + ' ul li a .', ddsmoothmenu.arrowimages.down[0], ' { background: url(', this.src, ') no-repeat;width:', this.width, 'px;height:', this.height, 'px;}'].join(''));
            }
            --stylesleft;
            addstyles();
        }).attr('src', ddsmoothmenu.arrowimages.down[1]);
        setting.shadow = this.detectie6 && (setting.method === 'hover' || setting.orientation === 'v') ? false : setting.shadow || this.shadow; //in IE6, always disable shadow except for horizontal toggle menus
        jQuery(document).ready(function ($) { //ajax menu?
            if (setting.shadow && ddsmoothmenu.css3support) { $('body').addClass('ddcss3support'); }
            if (typeof setting.contentsource == "object") { //if external ajax menu
                ddsmoothmenu.getajaxmenu($, setting);
            }
            else { //else if markup menu
                ddsmoothmenu.buildmenu($, setting);
            }
        });
    }
}; //end ddsmoothmenu variable


// Patch for jQuery 1.9+ which lack click toggle (deprecated in 1.8, removed in 1.9)
// Will not run if using another patch like jQuery Migrate, which also takes care of this
if (
	(function ($) {
	    var clicktogglable = false;
	    try {
	        $('<a href="#"></a>').toggle(function () { }, function () { clicktogglable = true; }).trigger('click').trigger('click');
	    } catch (e) { }
	    return !clicktogglable;
	})(jQuery)
) {
    (function () {
        var toggleDisp = jQuery.fn.toggle; // There's an animation/css method named .toggle() that toggles display. Save a reference to it.
        jQuery.extend(jQuery.fn, {
            toggle: function (fn, fn2) {
                // The method fired depends on the arguments passed.
                if (!jQuery.isFunction(fn) || !jQuery.isFunction(fn2)) {
                    return toggleDisp.apply(this, arguments);
                }
                // Save reference to arguments for access in closure
                var args = arguments, guid = fn.guid || jQuery.guid++,
					i = 0,
					toggler = function (event) {
					    // Figure out which function to execute
					    var lastToggle = (jQuery._data(this, "lastToggle" + fn.guid) || 0) % i;
					    jQuery._data(this, "lastToggle" + fn.guid, lastToggle + 1);

					    // Make sure that clicks stop
					    event.preventDefault();

					    // and execute the function
					    return args[lastToggle].apply(this, arguments) || false;
					};

                // link all the functions, so any of them can unbind this click handler
                toggler.guid = guid;
                while (i < args.length) {
                    args[i++].guid = guid;
                }

                return this.click(toggler);
            }
        });
    })();
}

/* TECHNICAL NOTE: To overcome an intermittent layout bug in IE 9+, the script will change margin top and left for the shadows to 
1px less than their computed values, and the first two values for the box-shadow property will be changed to 1px larger than 
computed, ex: -1px top and left margins and 6px 6px 5px #aaa box-shadow results in what appears to be a 5px box-shadow. 
Other browsers skip this step and it shouldn't affect you in most cases. In some rare cases it will result in 
slightly narrower (by 1px) box shadows for IE 9+ on one or more of the drop downs. Without this, sometimes 
the shadows could be 1px beyond their drop down resulting in a gap. This is the first of the two patches below. 
and also relates to the MS CSSOM which uses decimal fractions of pixels for layout while only reporting rounded values. 
There appears to be no computedStyle workaround for this one. */

//Scripted CSS Patch for IE 9+ intermittent mis-rendering of box-shadow elements (see above TECHNICAL NOTE for more info)
//And jQuery Patch for IE 9+ CSSOM re: offset Width and Height and re: getBoundingClientRect(). Both run only in IE 9 and later.
//IE 9 + uses decimal fractions of pixels internally for layout but only reports rounded values using the offset and getBounding methods.
//These are sometimes rounded inconsistently. This second patch gets the decimal values directly from computedStyle.
if (ddsmoothmenu.detectie9) {
    (function ($) { //begin Scripted CSS Patch
        function incdec(v, how) { return parseInt(v) + how + 'px'; }
        ddsmoothmenu.ie9shadow = function ($elem) { //runs once
            var getter = document.defaultView.getComputedStyle($elem.get(0), null),
			curshadow = getter.getPropertyValue('box-shadow').split(' '),
			curmargin = { top: getter.getPropertyValue('margin-top'), left: getter.getPropertyValue('margin-left') };
            $('head').append(['\n<style title="ie9shadow" type="text/css">',
			'.ddcss3support .ddshadow {',
			'\tbox-shadow: ' + incdec(curshadow[0], 1) + ' ' + incdec(curshadow[1], 1) + ' ' + curshadow[2] + ' ' + curshadow[3] + ';',
			'}', '.ddcss3support .ddshadow.toplevelshadow {',
			'\topacity: ' + ($('.ddcss3support .ddshadow').css('opacity') - 0.1) + ';',
			'\tmargin-top: ' + incdec(curmargin.top, -1) + ';',
			'\tmargin-left: ' + incdec(curmargin.left, -1) + ';', '}',
			'</style>\n'].join('\n'));
            ddsmoothmenu.ie9shadow = function () { }; //becomes empty function after running once
        }; //end Scripted CSS Patch
        var jqheight = $.fn.height, jqwidth = $.fn.width; //begin jQuery Patch for IE 9+ .height() and .width()
        $.extend($.fn, {
            height: function () {
                var obj = this.get(0);
                if (this.size() < 1 || arguments.length || obj === window || obj === document) {
                    return jqheight.apply(this, arguments);
                }
                return parseFloat(document.defaultView.getComputedStyle(obj, null).getPropertyValue('height'));
            },
            innerHeight: function () {
                if (this.size() < 1) { return null; }
                var val = this.height(), obj = this.get(0), getter = document.defaultView.getComputedStyle(obj, null);
                val += parseInt(getter.getPropertyValue('padding-top'));
                val += parseInt(getter.getPropertyValue('padding-bottom'));
                return val;
            },
            outerHeight: function (bool) {
                if (this.size() < 1) { return null; }
                var val = this.innerHeight(), obj = this.get(0), getter = document.defaultView.getComputedStyle(obj, null);
                val += parseInt(getter.getPropertyValue('border-top-width'));
                val += parseInt(getter.getPropertyValue('border-bottom-width'));
                if (bool) {
                    val += parseInt(getter.getPropertyValue('margin-top'));
                    val += parseInt(getter.getPropertyValue('margin-bottom'));
                }
                return val;
            },
            width: function () {
                var obj = this.get(0);
                if (this.size() < 1 || arguments.length || obj === window || obj === document) {
                    return jqwidth.apply(this, arguments);
                }
                return parseFloat(document.defaultView.getComputedStyle(obj, null).getPropertyValue('width'));
            },
            innerWidth: function () {
                if (this.size() < 1) { return null; }
                var val = this.width(), obj = this.get(0), getter = document.defaultView.getComputedStyle(obj, null);
                val += parseInt(getter.getPropertyValue('padding-right'));
                val += parseInt(getter.getPropertyValue('padding-left'));
                return val;
            },
            outerWidth: function (bool) {
                if (this.size() < 1) { return null; }
                var val = this.innerWidth(), obj = this.get(0), getter = document.defaultView.getComputedStyle(obj, null);
                val += parseInt(getter.getPropertyValue('border-right-width'));
                val += parseInt(getter.getPropertyValue('border-left-width'));
                if (bool) {
                    val += parseInt(getter.getPropertyValue('margin-right'));
                    val += parseInt(getter.getPropertyValue('margin-left'));
                }
                return val;
            }
        }); //end jQuery Patch for IE 9+ .height() and .width()
    })(jQuery);
}



ddsmoothmenu.init({
    mainmenuid: "smoothmenu1", //menu DIV id
    orientation: 'h', //Horizontal or vertical menu: Set to "h" or "v"
    classname: 'ddsmoothmenu', //class added to menu's outer DIV
    //customtheme: ["#1c5a80", "#18374a"],
    contentsource: "markup" //"markup" or ["container_id", "path_to_menu_file"]
})

ddsmoothmenu.init({
    mainmenuid: "smoothmenu2", //Menu DIV id
    orientation: 'v', //Horizontal or vertical menu: Set to "h" or "v"
    classname: 'ddsmoothmenu-v', //class added to menu's outer DIV
    method: 'hover', // set to 'hover' (default) or 'toggle'
    arrowswap: true, // enable rollover effect on menu arrow /Images?
    //customtheme: ["#804000", "#482400"],
    contentsource: "markup" //"markup" or ["container_id", "path_to_menu_file"]
})

// Calendar

// default settins - this structure can be moved in separate file in multilangual applications
var A_TCALCONF = {
    'cssprefix': 'tcal',
    'months': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    'weekdays': ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    'longwdays': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    'yearscroll': true, // show year scroller
    'weekstart': 0, // first day of week: 0-Su or 1-Mo
    'prevyear': 'Previous Year',
    'nextyear': 'Next Year',
    'prevmonth': 'Previous Month',
    'nextmonth': 'Next Month',
    'format': 'm/d/Y' // 'd-m-Y', Y-m-d', 'l, F jS Y'
};

var A_TCALTOKENS = [
// A full numeric representation of a year, 4 digits
	{'t': 'Y', 'r': '19\\d{2}|20\\d{2}', 'p': function (d_date, n_value) { d_date.setFullYear(Number(n_value)); return d_date; }, 'g': function (d_date) { var n_year = d_date.getFullYear(); return n_year; } },
// Numeric representation of a month, with leading zeros
	{'t': 'm', 'r': '0?[1-9]|1[0-2]', 'p': function (d_date, n_value) { d_date.setMonth(Number(n_value) - 1); return d_date; }, 'g': function (d_date) { var n_month = d_date.getMonth() + 1; return (n_month < 10 ? '0' : '') + n_month } },
// A full textual representation of a month, such as January or March
	{'t': 'F', 'r': A_TCALCONF.months.join('|'), 'p': function (d_date, s_value) { for (var m = 0; m < 12; m++) if (A_TCALCONF.months[m] == s_value) { d_date.setMonth(m); return d_date; } }, 'g': function (d_date) { return A_TCALCONF.months[d_date.getMonth()]; } },
// Day of the month, 2 digits with leading zeros
	{'t': 'd', 'r': '0?[1-9]|[12][0-9]|3[01]', 'p': function (d_date, n_value) { d_date.setDate(Number(n_value)); if (d_date.getDate() != n_value) d_date.setDate(0); return d_date }, 'g': function (d_date) { var n_date = d_date.getDate(); return (n_date < 10 ? '0' : '') + n_date; } },
// Day of the month without leading zeros
	{'t': 'j', 'r': '0?[1-9]|[12][0-9]|3[01]', 'p': function (d_date, n_value) { d_date.setDate(Number(n_value)); if (d_date.getDate() != n_value) d_date.setDate(0); return d_date }, 'g': function (d_date) { var n_date = d_date.getDate(); return n_date; } },
// A full textual representation of the day of the week
	{'t': 'l', 'r': A_TCALCONF.longwdays.join('|'), 'p': function (d_date, s_value) { return d_date }, 'g': function (d_date) { return A_TCALCONF.longwdays[d_date.getDay()]; } },
// English ordinal suffix for the day of the month, 2 characters
	{'t': 'S', 'r': 'st|nd|rd|th', 'p': function (d_date, s_value) { return d_date }, 'g': function (d_date) { n_date = d_date.getDate(); if (n_date % 10 == 1 && n_date != 11) return 'st'; if (n_date % 10 == 2 && n_date != 12) return 'nd'; if (n_date % 10 == 3 && n_date != 13) return 'rd'; return 'th'; } }

];

function f_tcalGetHTML(d_date) {

    var e_input = f_tcalGetInputs(true);
    if (!e_input) return;

    var s_pfx = A_TCALCONF.cssprefix,
		s_format = A_TCALCONF.format;

    // today from config or client date
    var d_today = f_tcalParseDate(A_TCALCONF.today, A_TCALCONF.format);
    if (!d_today)
        d_today = f_tcalResetTime(new Date());

    // selected date from input or config or today 
    var d_selected = f_tcalParseDate(e_input.value, s_format);
    if (!d_selected)
        d_selected = f_tcalParseDate(A_TCALCONF.selected, A_TCALCONF.format);
    if (!d_selected)
        d_selected = new Date(d_today);

    // show calendar for passed or selected date
    d_date = d_date ? f_tcalResetTime(d_date) : new Date(d_selected);

    var d_firstDay = new Date(d_date);
    d_firstDay.setDate(1);
    d_firstDay.setDate(1 - (7 + d_firstDay.getDay() - A_TCALCONF.weekstart) % 7);

    var a_class, s_html = '<table id="' + s_pfx + 'Controls"><tbody><tr>'
		+ (A_TCALCONF.yearscroll ? '<td id="' + s_pfx + 'PrevYear" ' + f_tcalRelDate(d_date, -1, 'y') + ' title="' + A_TCALCONF.prevyear + '"></td>' : '')
		+ '<td id="' + s_pfx + 'PrevMonth"' + f_tcalRelDate(d_date, -1) + ' title="' + A_TCALCONF.prevmonth + '"></td><th>'
		+ A_TCALCONF.months[d_date.getMonth()] + ' ' + d_date.getFullYear()
		+ '</th><td id="' + s_pfx + 'NextMonth"' + f_tcalRelDate(d_date, 1) + ' title="' + A_TCALCONF.nextmonth + '"></td>'
		+ (A_TCALCONF.yearscroll ? '<td id="' + s_pfx + 'NextYear"' + f_tcalRelDate(d_date, 1, 'y') + ' title="' + A_TCALCONF.nextyear + '"></td>' : '')
		+ '</tr></tbody></table><table id="' + s_pfx + 'Grid"><tbody><tr>';

    // print weekdays titles
    for (var i = 0; i < 7; i++)
        s_html += '<th>' + A_TCALCONF.weekdays[(A_TCALCONF.weekstart + i) % 7] + '</th>';
    s_html += '</tr>';

    // print calendar table
    var n_date, n_month, d_current = new Date(d_firstDay);
    while (d_current.getMonth() == d_date.getMonth() ||
		d_current.getMonth() == d_firstDay.getMonth()) {

        s_html += '<tr>';
        for (var n_wday = 0; n_wday < 7; n_wday++) {

            a_class = [];
            n_date = d_current.getDate();
            n_month = d_current.getMonth();

            if (d_current.getMonth() != d_date.getMonth())
                a_class[a_class.length] = s_pfx + 'OtherMonth';
            if (d_current.getDay() == 0 || d_current.getDay() == 6)
                a_class[a_class.length] = s_pfx + 'Weekend';
            if (d_current.valueOf() == d_today.valueOf())
                a_class[a_class.length] = s_pfx + 'Today';
            if (d_current.valueOf() == d_selected.valueOf())
                a_class[a_class.length] = s_pfx + 'Selected';

            s_html += '<td' + f_tcalRelDate(d_current) + (a_class.length ? ' class="' + a_class.join(' ') + '">' : '>') + n_date + '</td>';
            d_current.setDate(++n_date);
        }
        s_html += '</tr>';
    }
    s_html += '</tbody></table>';

    return s_html;
}

function f_tcalRelDate(d_date, d_diff, s_units) {

    var s_units = (s_units == 'y' ? 'FullYear' : 'Month');
    var d_result = new Date(d_date);
    if (d_diff) {
        d_result['set' + s_units](d_date['get' + s_units]() + d_diff);
        if (d_result.getDate() != d_date.getDate())
            d_result.setDate(0);
    }
    return ' onclick="f_tcalUpdate(' + d_result.valueOf() + (d_diff ? ',1' : '') + ')"';
}

function f_tcalResetTime(d_date) {
    d_date.setMilliseconds(0);
    d_date.setSeconds(0);
    d_date.setMinutes(0);
    d_date.setHours(12);
    return d_date;
}

// closes calendar and returns all inputs to default state
function f_tcalCancel() {

    var s_pfx = A_TCALCONF.cssprefix;
    var e_cal = document.getElementById(s_pfx);
    if (e_cal)
        e_cal.style.visibility = '';
    var a_inputs = f_tcalGetInputs();
    for (var n = 0; n < a_inputs.length; n++)
        f_tcalRemoveClass(a_inputs[n], s_pfx + 'Active');
}

function f_tcalUpdate(n_date, b_keepOpen) {

    var e_input = f_tcalGetInputs(true);
    if (!e_input) return;

    d_date = new Date(n_date);
    var s_pfx = A_TCALCONF.cssprefix;

    if (b_keepOpen) {
        var e_cal = document.getElementById(s_pfx);
        if (!e_cal || e_cal.style.visibility != 'visible') return;
        e_cal.innerHTML = f_tcalGetHTML(d_date, e_input);
    }
    else {
        e_input.value = f_tcalGenerateDate(d_date, A_TCALCONF.format);
        f_tcalCancel();
    }
}

function f_tcalOnClick() {

    // see if already opened
    var s_pfx = A_TCALCONF.cssprefix;
    var s_activeClass = s_pfx + 'Active';
    var b_close = f_tcalHasClass(this, s_activeClass);

    // close all clalendars
    f_tcalCancel();
    if (b_close) return;

    // get position of input
    f_tcalAddClass(this, s_activeClass);

    var n_left = f_getPosition(this, 'Left'),
		n_top = f_getPosition(this, 'Top') + this.offsetHeight;

    var e_cal = document.getElementById(s_pfx);
    if (!e_cal) {
        e_cal = document.createElement('div');
        e_cal.onselectstart = function () { return false };
        e_cal.id = s_pfx;
        document.getElementsByTagName("body").item(0).appendChild(e_cal);
    }
    e_cal.innerHTML = f_tcalGetHTML(null);
    e_cal.style.top = n_top + 'px';
    e_cal.style.left = (n_left + this.offsetWidth - e_cal.offsetWidth) + 'px';
    e_cal.style.visibility = 'visible';
}

function f_tcalParseDate(s_date, s_format) {

    if (!s_date) return;

    var s_char, s_regexp = '^', a_tokens = {}, a_options, n_token = 0;
    for (var n = 0; n < s_format.length; n++) {
        s_char = s_format.charAt(n);
        if (A_TCALTOKENS_IDX[s_char]) {
            a_tokens[s_char] = ++n_token;
            s_regexp += '(' + A_TCALTOKENS_IDX[s_char]['r'] + ')';
        }
        else if (s_char == ' ')
            s_regexp += '\\s';
        else
            s_regexp += (s_char.match(/[\w\d]/) ? '' : '\\') + s_char;
    }
    var r_date = new RegExp(s_regexp + '$');
    if (!s_date.match(r_date)) return;

    var s_val, d_date = f_tcalResetTime(new Date());
    d_date.setDate(1);

    for (n = 0; n < A_TCALTOKENS.length; n++) {
        s_char = A_TCALTOKENS[n]['t'];
        if (!a_tokens[s_char])
            continue;
        s_val = RegExp['$' + a_tokens[s_char]];
        d_date = A_TCALTOKENS[n]['p'](d_date, s_val);
    }

    return d_date;
}

function f_tcalGenerateDate(d_date, s_format) {

    var s_char, s_date = '';
    for (var n = 0; n < s_format.length; n++) {
        s_char = s_format.charAt(n);
        s_date += A_TCALTOKENS_IDX[s_char] ? A_TCALTOKENS_IDX[s_char]['g'](d_date) : s_char;
    }
    return s_date;
}

function f_tcalGetInputs(b_active) {

    var a_inputs = document.getElementsByTagName('input'),
		e_input, s_rel, a_result = [];

    for (n = 0; n < a_inputs.length; n++) {

        e_input = a_inputs[n];
        if (!e_input.type || e_input.type != 'text')
            continue;

        if (!f_tcalHasClass(e_input, 'tcal'))
            continue;

        if (b_active && f_tcalHasClass(e_input, A_TCALCONF.cssprefix + 'Active'))
            return e_input;

        a_result[a_result.length] = e_input;
    }
    return b_active ? null : a_result;
}

function f_tcalHasClass(e_elem, s_class) {
    var s_classes = e_elem.className;
    if (!s_classes)
        return false;
    var a_classes = s_classes.split(' ');
    for (var n = 0; n < a_classes.length; n++)
        if (a_classes[n] == s_class)
            return true;
    return false;
}

function f_tcalAddClass(e_elem, s_class) {
    if (f_tcalHasClass(e_elem, s_class))
        return;

    var s_classes = e_elem.className;
    e_elem.className = (s_classes ? s_classes + ' ' : '') + s_class;
}

function f_tcalRemoveClass(e_elem, s_class) {
    var s_classes = e_elem.className;
    if (!s_classes || s_classes.indexOf(s_class) == -1)
        return false;

    var a_classes = s_classes.split(' '),
		a_newClasses = [];

    for (var n = 0; n < a_classes.length; n++) {
        if (a_classes[n] == s_class)
            continue;
        a_newClasses[a_newClasses.length] = a_classes[n];
    }
    e_elem.className = a_newClasses.join(' ');
    return true;
}

function f_getPosition(e_elemRef, s_coord) {
    var n_pos = 0, n_offset,
		e_elem = e_elemRef;

    while (e_elem) {
        n_offset = e_elem["offset" + s_coord];
        n_pos += n_offset;
        e_elem = e_elem.offsetParent;
    }

    e_elem = e_elemRef;
    while (e_elem != document.body) {
        n_offset = e_elem["scroll" + s_coord];
        if (n_offset && e_elem.style.overflow == 'scroll')
            n_pos -= n_offset;
        e_elem = e_elem.parentNode;
    }
    return n_pos;
}

function f_tcalInit() {

    if (!document.getElementsByTagName)
        return;

    var e_input, a_inputs = f_tcalGetInputs();
    for (var n = 0; n < a_inputs.length; n++) {
        e_input = a_inputs[n];
        e_input.onclick = f_tcalOnClick;
        f_tcalAddClass(e_input, A_TCALCONF.cssprefix + 'Input');
    }

    window.A_TCALTOKENS_IDX = {};
    for (n = 0; n < A_TCALTOKENS.length; n++)
        A_TCALTOKENS_IDX[A_TCALTOKENS[n]['t']] = A_TCALTOKENS[n];
}

function f_tcalAddOnload(f_func) {
    if (document.addEventListener) {
        window.addEventListener('load', f_func, false);
    }
    else if (window.attachEvent) {
        window.attachEvent('onload', f_func);
    }
    else {
        var f_onLoad = window.onload;
        if (typeof window.onload != 'function') {
            window.onload = f_func;
        }
        else {
            window.onload = function () {
                f_onLoad();
                f_func();
            }
        }
    }
}

f_tcalAddOnload(f_tcalInit);
