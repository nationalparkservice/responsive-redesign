var NPS = NPS || {};

NPS.loadPlugins = function() {
  // Mouse hold down jquery function.
  jQuery.fn.mousehold = function(timeout, f) {
    if (timeout && typeof timeout === 'function') {
      f = timeout;
      timeout = 100;
    }

    if (f && typeof f === 'function') {
      var fireStep = 0,
        timer = 0;

      return this.each(function() {
        jQuery(this).mousedown(function() {
          var ctr = 0,
            t = this;

          fireStep = 1;
          timer = setInterval(function() {
            ctr++;
            f.call(t, ctr);
            fireStep = 2;
          }, timeout);
        });
        clearMousehold = function() {
          clearInterval(timer);

          if (fireStep === 1) {
            f.call(this, 1);
          }

          fireStep = 0;
        };
        jQuery(this)
          .mouseout(clearMousehold)
          .mouseup(clearMousehold);
      });
    }
  };
  // Slide box.
  jQuery.fn.slidebox = function() {
    var slidebox = this,
      open = false,
      originalPosition = slidebox.css('right'),
      boxAnimations;

    if (Modernizr.cssanimations) {
      boxAnimations = {
        open: function() {
          slidebox.addClass('open');
        },
        close: function() {
          slidebox.removeClass('open');
        }
      };
    } else {
      boxAnimations = {
        open: function() {
          slidebox.animate({
            right: '10px'
          }, 300);
        },
        close: function() {
          slidebox.stop(true).animate({
            right: originalPosition
          }, 100);
        }
      };
    }

    jQuery(window).scroll(function() {
      var distanceTop = jQuery('#content-bottom').offset().top - jQuery(window).height() - 80;

      if (jQuery(window).scrollTop() > distanceTop) {
        if (!open) {
          open = true;
          boxAnimations.open();
        }
      } else {
        open = false;
        boxAnimations.close();
      }
    });
    slidebox.find('.close').click(function() {
      jQuery(this).parent().parent().remove();
    });
  };
  /** 
   * jQuery split a list into multiple rows or columns
   *   Usage: 
   *     jQuery(".dropdown ul").splitList(3);
   *     jQuery(".dropdown ul").splitList(3, { wrapClass: "div_class_name" });
   *     jQuery(".dropdown ul").splitList(3, { splitInto: "div_class_name" });
   */
  jQuery.fn.splitList = function(n, options) {
    settings = jQuery.extend({
      wrapClass: false,
      splitInto: 'cols'
    }, options);

    return this.each(function(){
      var intoCols = (settings.splitInto === 'cols'),
        w = '<div' + (settings.wrapClass ? ' class="' + settings.wrapClass + '"' : '' ) + '></div>';

      jQuerylis = jQuery(this).find('> li');
      jQueryinc = intoCols ? parseInt((jQuerylis.length/n) + (jQuerylis.length % n > 0 ), 10) : n;

      for (var i = 0; i < (intoCols ? n : Math.ceil(jQuerylis.length/n)); i++) {
        jQuerylis.slice(jQueryinc*i, jQueryinc*(i+1)).wrapAll(w);
      }
    });
  };
};
NPS.utility = {
  // Global parameters.
  params: {
    resize : [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'ol',
      'ul',
      'dt',
      'dd'
    ],
    preloadChrome: [
      ['/common/commonspot/templates/images/chrome/bg/results.png'],
      ['/common/commonspot/templates/images/chrome/bg/results-bottom.png'],
      ['/common/commonspot/templates/images/chrome/bg/results-top.png'],
      ['/common/commonspot/templates/images/chrome/bg/nav-dd-edges.png']
    ],
    saytId: '277'
  },
  // Detect versions of IE.
  getIeVersion: function() {
    if (this.ieVersion === 'undefined') {
      var div = document.createElement('div'),
        all = div.getElementsByTagName('i'),
        v = 3,
        undef;

      while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        all[0]
      );

      if (v > 4) {
        this.ieVersion = v;
      } else {
        this.ieVersion = NaN;
      }
    }
    return this.ieVersion;
  },
  // Checks to see if a value is an integer.
  isInt: function(value) {
    if ((parseFloat(value) === parseInt(value, 10)) && !isNaN(value)) {
      return true;
    } else {
      return false;
    }
  },
  pageSetups: function(value) {
    jQuery('#site-map-container').hide();
    jQuery('#sm-control a').removeClass('expanded');
    jQuery('.content-container .utils').css('visibility', 'visible');
    jQuery('.search-control input[type=submit]').hide();
    jQuery('html').removeClass('no-js').addClass('js');
  },
  // Image preload.
  preload: function(arrayOfImages) {
    jQuery(arrayOfImages).each(function() {
      jQuery('<img/>')[0].src = this;
    });
  },
  setMinContentHeight: function() {
    //set min height to content if the sub-nav is larger
    if (jQuery('#sub-nav').length && jQuery('.content-container').length) {
      if (jQuery('#sub-nav').height() > jQuery('.content-container').height()) {
        if (jQuery('.fact').length) {
          jQuery('.fact').before('<br style="clear: both; height:1px; line-height:1px;" />').css({
            'display': 'block',
            'margin-top': (jQuery('#sub-nav').height() - jQuery('.content-container').height() - 60) + 'px'
          });
        } else {
          jQuery('.content-container').css('min-height', jQuery('#sub-nav').height()-35);
        }
      }
    }
  }
};
NPS.cycle = {
  // Sets height of cycle containers.
  setCycleHeight: function(element) {
    var childHeight = 0,
      height = 0;

    jQuery.each(jQuery(element).children(), function(index) {
      childHeight = jQuery(this).height() + 25;

      if(childHeight > height) {
        height = childHeight;
      }
    });
    jQuery(element).parent().css('height', height);
  },
  // Remove fade effect from cycle for IE7, IE8.
  cycleEffect: function() {
    var effect = 'fade';

    if (NPS.utility.getIeVersion() < 9) {
      effect = 'none';
    }

    return effect;
  },
  // Enables slider on bap.
  bapSlider: function() {
    var effect = this.cycleEffect(),
      bapSize;

    if (jQuery('.bap').length) {
      jQuery.each(jQuery('.bap .title'), function(index) {
        var maxWidth = 640;

        if (jQuery(this).children('.main').children('h1').width() > maxWidth) {
          jQuery(this).children('.main').children('h1').addClass('resized');
        }

        while(jQuery(this).children('.main').children('h1').width() > maxWidth) {
          var curSize = jQuery(this).children('.main').children('h1').css('font-size'),
            newSize = parseInt(curSize.replace('px',''), 10) + -2 + 'px';

          jQuery(this).children('.main').children('h1').css('font-size', newSize);
        }
      });

      bapSize = jQuery('.bap .cycle').children().size();

      if (bapSize > 1) {
        jQuery('.bap .cycle')
          .after(jQuery('<ul>').addClass('controls'))
          .cycle({
            fx: effect,
            autostop: 0,
            activePagerClass: 'active',
            pager: '.bap .controls',
            pagerAnchorBuilder: function(idx, slide) {
              return jQuery('<li>')
                .attr('class', 'ir')
                .text('Go to slide ' + ++idx);
            },
            end: function(options) {
              jQuery('.bap .cycle').cycle(0).cycle('pause');
            }
          });
      }
    }

    if(jQuery('.bap-mini').length) {
      bapSize = jQuery('.bap-mini .cycle').children().size();

      if (bapSize > 1) {
        jQuery('.bap-mini .cycle')
          .after(jQuery('<ul>').addClass('controls'))
          .cycle({
            autostop: 0,
            fx: effect,
            activePagerClass: 'active',
            pager: '.bap-mini .controls',
            pagerAnchorBuilder: function(idx, slide) {
              return jQuery('<li>')
                .attr('class', 'ir')
                .text('Go to slide ' + ++idx);
            },
            end: function(options) {
              jQuery('.bap-mini .cycle').cycle(0).cycle('pause');
            }
          });
      }
    }
  },
  // Enables slider on bap.
  carousel: function() {
    var self = this;

    if (!(jQuery('.carousel-list ul').length)) {
      return;
    }

    this.carousel = jQuery('.carousel-list ul');
    this.slideCount = jQuery('.carousel-list ul li').length;
    this.addControls = function() {
      jQuery('' +
        '<ul id="carousel-controls"><li id="carousel-controls-prev"><a class="ir" href="#"><img src="/common/commonspot/templates/images/controls/carousel_arrow_left.png" /></a></li><li id="carousel-controls-next"><a class="ir" href="#"><img src="/common/commonspot/templates/images/controls/carousel_arrow_right.png" /></a></li></ul>' +
      '').appendTo(jQuery('.carousel-list'));

      if (jQuery('.carousel-list .row').length > 1) {
        this.carousel.next('#carousel-controls').show();
      }
    };
    this.contentsWrap = function() {
      var classes = jQuery('.carousel-list').attr('class'),
        countIndex = classes.indexOf('carousel-list-'),
        carNum = parseInt(classes.substr(countIndex + 14, 1), 10);

      jQuery('.carousel-list ul').splitList(carNum, {
        splitInto: 'rows'
      }).children('div').addClass('clearfix row');
    };
    this.cycleItems = function() {
      var effect = self.cycleEffect();
      this.carousel.cycle({
        after:  this.cycleAfter,
        fx: effect,
        next: '#carousel-controls-next a',
        nowrap: 1,
        prev: '#carousel-controls-prev a',
        speed: 'fast',
        timeout: 0
      });
    };
    this.cycleAfter = function (curr, next, opts) {
      if (opts === 'undefined') {
        return;
      }

      var $next = jQuery('#carousel-controls-next'),
        $prev = jQuery('#carousel-controls-prev'),
        position = opts.currSlide;

      if (NPS.utility.getIeVersion() < 9) {
        jQuery.each(jQuery('.carousel-list ul:first').children(), function(index) {
          if (this === next) {
            position = index;
          }
        });
      }

      if (position === 0) {
        $prev.addClass('prev-disabled');
      } else {
        $prev.removeClass('prev-disabled');
      }

      if ((position + 1) === opts.slideCount) {
        $next.addClass('next-disabled');
      } else {
        $next.removeClass('next-disabled');
      }

      self.setCycleHeight(this);
    };
    this.init = function() {
      this.contentsWrap();
      this.addControls();
      this.cycleItems();
      this.cycleAfter();
    };

    this.init();
  }
};
NPS.newContent = {
  addPrintLink: function() {
    jQuery('.addthis_toolbox')
      .before(jQuery('<li>')
      .addClass('print')
      .append(jQuery('<a>')
        .attr('href','javascript:void(0);')
        .text('print')
      ));
    jQuery('.print a').click(function() {
      window.print();
      return false;
    });
  },
  // Popup window for webcam.
  webcamLink: function() {
    jQuery('.webcam-link').click(function(e) {
      e.preventDefault();

      if (window.focus) {
        window.open(jQuery(this).attr('href'),'','height=800,width=960,scrollbars=yes').focus();
      }
    });
  },
  // Simple function that adds the double right brackets to the links with the .more class.
  moreLinks: function () {
    if (NPS.utility.getIeVersion() < 8) {
      var $this = jQuery(this);

      jQuery('.more').each(function() {
        $this[0].innerHTML = $this.text() + '&nbsp;&raquo;';
      });
      jQuery('.back').each(function() {
        $this = jQuery(this);
        $this[0].innerHTML = '&laquo;&nbsp;' + $this.text();
      });
    }
  },
  // Twitter.
  getTweets: function (username, tweetNum, container) {
    if (container && container.length) {
      container.append(jQuery('<span>').addClass('loading'));

      jQuery.getJSON('http://twitter.com/statuses/user_timeline.json?screen_name=' + username + '&count=' + tweetNum + '&callback=?', function(data) {
        var tweet = data[0].text;

        tweet = tweet.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, function(url) {
          return '<a href="' + url + '">'+url+'</a>';
        }).replace(/B@([_a-z0-9]+)/ig, function(reply) {
          return  reply.charAt(0)+'<a href="http://twitter.com/' + reply.substring(1) + '">' + reply.substring(1) + '</a>';
        });
        container
          .empty()
          .append(jQuery('<p>').append(tweet));
      });
    }
  }
};
NPS.text = {
  // Resizes the container to the width of the child image.
  resizeToImage: function() {
    if (jQuery('.resize-to-image img').length) {
      jQuery.each(jQuery('.resize-to-image'), function(index, val) {
        $this = jQuery(this);

        $this.children('img').load(function() {
          $this.width($this.children('img').width());
        });
      });
    }
  },
  // Update text controls.
  textSizes: function() {
    var self = this;

    jQuery('.utils .text-sizes a').click(function() {
      var activeSize = jQuery('.utils .text-sizes .active').parent().attr('class'),
        size = jQuery(this).parent().attr('class');

      jQuery('.utils .text-sizes a').removeClass('active');
      jQuery(this).addClass('active');
      self.textResize(activeSize, size);

      if (jQuery('.carousel-list').length) {
        NPS.cycle.setCycleHeight('.carousel-list .row');
      }
    });
  },
  // Resize text by - or + 2 pixels.
  textResize: function(activeSize, size) {
    var value = 0;

    switch (activeSize) {
    case 'large':
      switch (size) {
      case 'medium':
        value = -2;
        break;
      case 'small':
        value = -4;
        break;
      }
      break;
    case 'medium':
      switch (size) {
      case 'large':
        value = 2;
        break;
      case 'small':
        value = -2;
        break;
      }
      break;
    case 'small':
      switch (size) {
      case 'medium':
        value = 2;
        break;
      case 'large':
        value = 4;
        break;
      }
      break;
    }

    jQuery.each(NPS.utility.params.resize, function(index, elementType) {
      jQuery(elementType).each(function() {
        var $this = jQuery(this);

        if (!$this.parents('.bap').length && !$this.parents('.navbar').length) {
          $this.css('font-size', (parseInt(jQuery.trim($this.css('font-size').replace('px', '')), 10) + value) + 'px');
        }
      });
    });
  }
};
NPS.forms = {

  /**
  * Add placeholder support for older browsers
  */
  placeholder: function() {
    jQuery('[placeholder]').focus(function() {
      var input = jQuery(this);
      if (input.val() == input.attr('placeholder')) {
        input.val('');
        input.removeClass('placeholder');
      }
    }).blur(function() {
      var input = jQuery(this);
      if (input.val() == '' || input.val() == input.attr('placeholder')) {
        input.addClass('placeholder');
        input.val(input.attr('placeholder'));
      }
    }).blur().parents('form').submit(function() {
      jQuery(this).find('[placeholder]').each(function() {
        var input = jQuery(this);
        if (input.val() == input.attr('placeholder')) {
          input.val('');
        }
      });
    }); 
  },
  
  /**
  * Submit drop down on click
  */
  searchDropdown: function() {
    //submit on find a park drop down
    jQuery("#park-query").change(function() {
          if (!!jQuery(this).val()) window.location = jQuery(this).val();
      // now change the submit button action as well
      jQuery("#find_park_form").attr("action", jQuery(this).val());
      });
    //submit on find a subject drop down
    jQuery("#subject-query").change(function() {
          if (!!jQuery(this).val()) window.location = jQuery(this).val();
      });
  },
  
  /**
  * submit sort by
  */
  sortBySubmit: function() {
    if(jQuery('.sort-by #sort-by-select').length) {
      jQuery('.sort-by #sort-by-select').change(function(){
        jQuery('.sort-by').submit();
      });
    }
  },
  
  /**
  * Live search
  */
   liveSearch: function(){
    jQuery('#global-search input').keyup(function() {
      var searchVal = jQuery('#global-search input').val();
      //get url
      var url = document.location.href;
      //split url
      var urlparts = url.split('/');
      //get the park
      var park = urlparts[3];
      var siteLimit = '';
      //ensure that the park is 4 letters long
      if(park.length == 4){
        var siteLimit = 'nps.gov/' + park;
      }

      // added 2013-07-06 for orgs and subject site limits for search
      if(park === 'subjects'){
        var siteLimit = 'nps.gov/subjects/' +  urlparts[4];
      }
      if(park === 'orgs'){
        var siteLimit = 'nps.gov/orgs/' +  urlparts[4];
      }
      
      var subsites = window.location.pathname.split('/');
      var searchTextGuidance = 'this site';
        
      if (subsites[1] == 'subjects') {
        searchTextGuidance = 'this site';
      }
      else if (subsites[1] == 'teachers') {
        searchTextGuidance = 'this site';
      }

      //update search for results
      jQuery('#result1')[0].innerHTML = '<a href="/search/index.htm?query=' + searchVal + '&sitelimit=' + siteLimit + '">' + searchVal + ' ' + searchTextGuidance + '</a>';
      jQuery('#result2')[0].innerHTML = '<a href="/search/index.htm?query=' + searchVal + '">' + searchVal + ' in NPS.gov</a>';
      
      //show search result
      jQuery('#search-results-container').show();
      //make ajax request to get suggestions
      jQuery.ajax({
        dataType: 'jsonp',
        url: 'http://search.usa.gov/sayt?aid=' + NPS.utility.params.saytId,
        data:{
          q: searchVal
        },
        success: function(suggestions) {
          //if there are suggestions
          if(suggestions.length != 0){
            var i = 0;
            //generate suggestions html
            var html = jQuery('<ul>');
            //var html = '<p>Suggestions</p><ul>';
            jQuery.each(suggestions, function(index, suggestion) {
              if(i < 3){
                //debug here
                html.append(jQuery('<li>').append(jQuery('<a>').attr('href', '/search/index.htm?query=' + suggestion).text(suggestion)));
              }
              i++;
            });
            html = jQuery('<p>').text('Suggestions').append(html);
            //empty and populate suggestions
            jQuery('#search-results #suggestions').empty().html(html);
          }
        //Hide the this site verbiage if on the nps.gov homepage
        if(window.location.href.split('/').length-1 == 3) {
          jQuery('#result1').hide();
        }
        },
        error: function() {
          jQuery('#search-results #suggestions').empty();
        }

      });
    });
  }

  /**
  * registration form validation
  */
  /* Commented out 2/27/12 by Lisa Backer, Fig Leaf Software.  Awaiting instructions on how to properly remove this from the global.js file.
  regForm: function(){
    if(jQuery('#registration').length) {
      //phone validation
      jQuery.validator.addMethod("phone", function(phone_number, element) {
          phone_number = phone_number.replace(/\s+/g, ""); 
        return this.optional(element) || phone_number.length > 9 &&
          phone_number.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}jQuery/);
      }, "Please specify a valid phone number");
      jQuery("#registration").validate({
        rules: {
          "reg-full-name": "required",
          "reg-school-name": "required",
          "reg-email-address": {
            required: true,
            email: true
          },
          "reg-phone": {
            required: true,
            phone: true
          },
          "reg-student-number": {
            required: true,
            digits: true
          }
        },
        errorPlacement: function(error, element) {
          jQuery('#reg-errors').show();
        }
      });
    }
  }
  */
};


NPS.gallery = {

  /**
  * tool tip
  */
  tooltip: function() { 
    if(jQuery('.tooltip').length) {
      xOffset = 10;
      yOffset = 20; 
      jQuery('.tooltip img').hover(function(e) {
        //set empty title attribute for IE7
        if(NPS.utility.getIeVersion() < 8){
          jQuery(this).attr('title','');
        }
        jQuery('#tooltip').remove();
        var text = jQuery(this).attr('alt');
        if(text != undefined && text != '') {
          jQuery('body').append('<p id="tooltip">'+ jQuery(this).attr('alt') +'</p>');
          jQuery('#tooltip')
            .css('top',(e.pageY - xOffset) + 'px')
            .css('left',(e.pageX + yOffset) + 'px')
            .show();  
        }
        },
      function() {
        this.title = this.t;    
        jQuery('#tooltip').remove();
        }); 
      jQuery('.tooltip img').mousemove(function(e) {
        jQuery('#tooltip')
          .css('top',(e.pageY - xOffset) + 'px')
          .css('left',(e.pageX + yOffset) + 'px');
      });
    }
    if(jQuery('.gallery-content-tooltip').length) {
      jQuery('.gallery-content-tooltip img').mouseenter(function(e) {
        //set empty title attribute for IE7
        if(NPS.utility.getIeVersion() < 8){
          jQuery(this).attr('title','');
        }
        jQuery('.gallery-tooltip').hide();
        var tooltip = jQuery(this).parents('.image').children('.gallery-tooltip');
        if(tooltip.length && !tooltip.is(':visible')){
          tooltip.show();
        }
        else{
          var text = jQuery(this).attr('alt');
          if(text != undefined && text != '') {
            jQuery(this).parents('.image').append(jQuery('<div>').addClass('gallery-tooltip').append(jQuery('<div>').addClass('gallery-tooltip-arrow')).append(jQuery('<p>').text(text))).show();
          }
        }
        });
        jQuery('.gallery-content-tooltip img').mouseout(function(e) {
          jQuery(this).parents('.image').children('.gallery-tooltip').hide();
        });
    } 
  },
  /**
   * photo gallery setup
   */
  photoGallery: function() {
    if(jQuery('.gallery-views').length) {
      var buildControl = jQuery('<div id="gallery-controls"><ul class="view-controls"><li class="active"><a href="#" class="list-view">List View</a></li><li><a href="#" class="grid-view">Grid View</a></li></ul></div>');
      jQuery('.gallery-views #gallery-top').append(buildControl);
      NPS.gallery.galleryControls();
    }
    jQuery('#photo-gallery .description h3 a').click(function(e) {
      e.preventDefault();
      //simulate lightbox click
      jQuery(this).parent().parent().prev().children('a').click();
    });
  },
  /**
   * switch between grid and list view
   */
  galleryControls: function() {
    jQuery('.list-view, .grid-view').click(function(e){
      e.preventDefault();
      var jQuerythis = jQuery(this);
      if(!jQuerythis.parent().hasClass('active')){
        jQuerythis.parent().addClass('active');
        jQuerythis.parent().prev().removeClass('active');
        jQuerythis.parent().next().removeClass('active');
        if(jQuery('#gallery-content').hasClass('list')){
          jQuery('#gallery-content').removeClass('list').addClass('grid');
        }
        else if(jQuery('#gallery-content').hasClass('grid')){
          jQuery('#gallery-content').removeClass('grid').addClass('list');
        }
      }
    });
  }
};
NPS.lightbox = {
  lightboxTitle: function(title, currentArray, currentIndex, currentOpts) {
    var index = (currentIndex + 1);
    var html = jQuery('<div>').addClass('clearfix');
    var disablePrev = '', disableNext = '';
    if (currentArray.length > 1) {
      if(index == 1) {
        disablePrev = 'disable';
      }
        if(index == currentArray.length) {
          disableNext = 'disable'
        }
        //create next and previous buttons
        html.append(jQuery('<span>').attr('id','fancybox-prev').append(jQuery('<a>').addClass(disablePrev).attr('href','javascript:jQuery.fancybox.prev();').text('Previous')))
        .append(jQuery('<span>').attr('id','fancybox-next').append(jQuery('<a>').addClass(disableNext).attr('href','javascript:jQuery.fancybox.next();').text('Previous')))
      }
      var altText = jQuery(currentArray[currentIndex]).children().attr('alt');
      var linkText = jQuery(currentArray[currentIndex]).text();
      if(altText != undefined && altText != '') {
        title = altText;
      }
      else if(linkText != undefined && linkText != '') {
        title = linkText;
      }
      html.append(jQuery('<div>').attr('id','fancybox-description').append(jQuery('<p>').text(title)));
    return html;
  },
  /**
  * lightbox gallery
  */
  lightbox: function() {
    if (jQuery('a[data-rel="gallery1"]').length) {
      jQuery('a[data-rel="gallery1"]').fancybox({
        'titlePosition': 'inside',
        'titleFormat': NPS.lightbox.lightboxTitle
      });
    }

    //photo gallery
    if (jQuery('#photo-gallery #gallery-content .image').length) {
      jQuery('#photo-gallery #gallery-content .image a').fancybox({
        'titlePosition': 'inside',
        'titleFormat': NPS.lightbox.lightboxTitle
      });
    }

    //slideshow
    if (jQuery('#gallery-listing .slideshow').length) {
      jQuery('#gallery-listing .view-slideshow').click(function() {
        //remove relationship groupings
        jQuery('#photo-galleries .slideshow li a').attr('rel','');
        //add relationship grouping to this slideshow group
        jQuery(this).parent().next().children('li').children('a').attr('rel','gallery-slideshow');
        jQuery('a[rel="gallery-slideshow"]').fancybox({
          'titlePosition': 'inside',
          'titleFormat': NPS.lightbox.lightboxTitle
        });
        //simulate click to start lightbox
        jQuery(this).parent().next().children('li:first').children('a').click();
      });
    }
  },
  eventDetails: function(){
    if(jQuery('.results .show-event').length) {
      jQuery('.results .show-event').click(function(event) {
        jQuerythis = jQuery(this);

        if (!jQuerythis.hasClass('is-fancy')){
          //stop event
          event.preventDefault();
          //add is-fancy class to link
          jQuerythis.addClass('is-fancy');
          //add print link
          jQuery(this).parents('.wrapper').next().children().append(
            jQuery('<a>').attr('href','#').addClass('print-event ir').text('Print')
          );
          //get event details content + add width/height, hide title, no transition, cleanup on close 
          jQuerythis.fancybox({
            'content': jQuery(this).parents('.wrapper').next().children().css('width','475'),
            'titleShow': false,
            'transitionIn': 'none',
            'transitionOut': 'none',
            'onComplete': function() {
              //add print style sheet
              jQuery('<link rel="stylesheet" media="print" id="print-event" href="../global/css/event-details-print.css"/>').appendTo('head');
              //add print click event
              jQuery('#fancybox-content .print-event').click(function(e) {
                e.preventDefault();
                window.print();
                return false;
              });
            },
            'onCleanup': function() {
              //remove print style sheet
              jQuery('#print-event').remove();
            }
          });

          //continue event
          jQuerythis.trigger(event)
        }
      });
      jQuery('.results .show-event-trigger').click(function(event) {
        event.preventDefault();
        jQuerythis = jQuery(this);
        jQuerythis.parent('h3').siblings('.wrapper').find('.show-event').click();
      });
    }
  },
  /**
   * iframe for rate button
   */
  rateBtn: function () {
    var height = 805;

    //ie 7 height
    if (NPS.utility.getIeVersion() < 8) {
      height = 855;
    }

    if (jQuery('.rate-btn').length) {
      jQuery('.rate-btn').fancybox({
        'width': 598,
        'height': height,
        'autoScale': false,
        'type': 'iframe'
      });
    }
  }
};
NPS.starRating = {
  /**
   * enable star ratings
   */
  starRatings: function () {
    if(jQuery('.ratings-wrapper').length) {
      jQuery.each(jQuery(".ratings-wrapper"), function() {
        jQuery(this).stars({
          inputType: "select",
          captionEl: jQuery(this).next('.stars-cap'),
          disabled: true
        });
      });

      //ensure the review breakdown is hidden
      jQuery('.ratings-box .review-breakdown').hide();
      //show breakdown
      jQuery('.ratings-box .ratings-wrapper div').mouseenter(function() {
        jQuery('.ratings-box .review-breakdown').show();
      });
      //hide breakdown
      jQuery('.ratings-box .ratings-wrapper div').mouseout(function() {
        jQuery('.ratings-box .review-breakdown').hide();
      });
      //Add a close for touch devices
      jQuery('.review-breakdown .hover-close').click(function() {
        jQuery(this).parent().hide();
      });
    }
  }
};
NPS.display = {
  /**
   * Wraps the dt and dd pair in each dl with a class of wrapper with a div
   */
  wrapdldt: function() {
     jQuery('.wrapped dt').each(function() {
      //get current dt
      var jQuerycurElement = jQuery(this);
      //add dt to selection list
      var jQueryselection = jQuery(this);
      //add next children

      while (jQuerycurElement.next().is('dd')) {
        jQuerycurElement = jQuerycurElement.next();
        jQueryselection.push(jQuerycurElement[0]);
      }

      //wrap all elements in a dl wrapper
      jQueryselection.wrapAll('<div class="dl-wrapper">');
    });
  },
  /**
  * Setting up results show / hide functionality
  */
  showHide: function() {
    jQuery('.show-hide a').click(function() {
      if(jQuery(this).hasClass('read-more')) {
        jQuery(this).removeClass('read-more').addClass('read-less').text('Read Less');  
        jQuery(this).parent().next().show();
      }
      else{
        jQuery(this).removeClass('read-less').addClass('read-more').text('Read More');
        jQuery(this).parent().next().hide();
      }
    });
  },
  /**
   * Setting up tabs functionality - relies on jQuery ui
   */
  tabsSetup: function() {
    if (jQuery('.list-nav li').length) {
      jQuery(".list-nav li:not(:first-child)").hide();
      jQuery(".list-nav li:first-child").addClass("active");
      jQuery(".list-nav li a").click(function(){
        var jQuerythis = jQuery(this);
        var jQuerylist = jQuery(this).parent().parent();

        if(jQuerythis.parent().siblings(':visible').length==0) {
          jQuerythis.parent().siblings().show();
        } else {
          jQuerythis.parent().siblings().removeClass("active")
            .end().addClass("active");

          var move = jQuery(this).parent().detach();
          move.prependTo(jQuerylist);
          move = null;
          jQuerythis.parent().siblings().hide();
        }
      });
    }

    if(jQuery('.content-viewer').length) {
      jQuery( ".content-viewer" ).tabs();
    }

    if(jQuery('.tabbed').length) {
      jQuery('.tabbed').tabs(); 
    }
  },
  /**
  * Show and hide global alert message
  */
  alert: function() {
    if ((jQuery('#content-alert').length) && (jQuery('.alert-toggle').length)){
      jQuery('#content-alert').hide();
      jQuery('.alert-toggle').click(function(){
        if(jQuery('#content-alert').is(':visible')) {
          jQuery('#content-alert').hide();
          jQuery('#alert-toggle')[0].innerHTML = 'Show Alerts &raquo;';
        }
        else{
          jQuery('#content-alert').show();
          jQuery('#alert-toggle')[0].innerHTML = 'Hide Alerts &raquo;';         
        }
      });
    }
  },
  /**
  * Show and hide transcript controls
  */
  transcriptControls: function() {
    if(jQuery('.transcript-control').length) {
      jQuery(".transcript-control a").click(function() {
        var transcript = jQuery(this).parent().next('.transcript');
        var jQueryfact = jQuery('.adjusted-for-fact .fact');
        if(transcript.is(':visible')) {
          if (NPS.utility.getIeVersion()==7) { jQueryfact.hide(); }
          transcript.hide();
          jQuery(this).parent().removeClass('close').addClass('open');
          if (NPS.utility.getIeVersion()==7) { jQueryfact.show(); }

        }
        else {
          if (NPS.utility.getIeVersion()==7) { jQueryfact.hide(); }
          transcript.show();
          jQuery(this).parent().removeClass('open').addClass('close')
          if (NPS.utility.getIeVersion()==7) { jQueryfact.show(); }

        }
      });
    }
  },
  /**
  * hide and show full field trips
  */
  resultAlert: function() {
    if(jQuery('#micro-filter-check').length) {
      jQuery('#micro-filter-check').change(function() {
        if(jQuery('#micro-filter-check').is(':checked')) {
          jQuery("#display-list-view li").has(".alert-box").show();

        }
        else{
          jQuery("#display-list-view li").has(".alert-box").hide();

        }
      });
    }
  },
  /**
  * Show and hide the footer
  */
  footerControls: function() {
    if((jQuery('#site-map-container').length) || (jQuery('.site-map-container').length)) {
      jQuery('#sm-control').click(function() {
        jQuery('#site-map-container').toggle();
        if(jQuery('#sm-control a').hasClass('expanded')) {
          jQuery('#sm-control a').removeClass('expanded');

        }
        else {
          jQuery('#sm-control a').addClass('expanded');

        }
      });
    }
  },
  /**
  * Monitor click events, blur divs if shown
  */
  searchBlur: function() {
    //click off search results
    jQuery(document).click(function(e) {
      //if the parent of the click is inside the search result container and the search result if visible
      if(jQuery(e.target).parents("#search-results-container").attr('id') != "search-results-container" && jQuery('#search-results-container').is(':visible')){
        jQuery('#search-results-container').hide();
      }
    });
  },
  /**
  * click functionality for tiles
  */
  tiles: function() {
    //add classes for IE7/8
    if(jQuery('.tiles').length) {
      jQuery('.tiles li:nth-child(even)').addClass('even');
      jQuery('.tiles li:last-child').addClass('last-child');
      //close and open tile
      jQuery('.tiles li').click(function(){
        if(jQuery(this).hasClass('show-info')){
          jQuery(this).removeClass('show-info');
          jQuery(this).children('.description').addClass('visuallyhidden');
        }
        else{
          jQuery('.tiles li').removeClass('show-info');
          jQuery('.tiles .description').addClass('visuallyhidden');
          jQuery(this).children('.description').removeClass('visuallyhidden');
          jQuery(this).addClass('show-info');
        }
      });
    }
  },
  /**
  * Add show-hide buttons to reviews
  */
  reviewShow: function(){
    if(jQuery('.content .review-body').length) {
      jQuery('.review-body').hide();
      jQuery('.review-body').before('<div class="show-hide"><a class="read-more" href="javascript:;">Read More</a></div>');
      this.showHide();
    }
  }
};

jQuery(document).ready(function(){
  //page set up actions
  NPS.utility.pageSetups();
  //preload images
  if(jQuery('#search-results-container').length)
    NPS.utility.preload(NPS.utility.params.preloadChrome);
  
  NPS.loadPlugins();
  
  NPS.text.resizeToImage();
  if (navigator.userAgent.toLowerCase().indexOf('chrome') >= 0) 
{
jQuery('#global-search').attr('autocomplete', 'off'); 
}
  NPS.display.wrapdldt();
  NPS.display.searchBlur();
  NPS.display.reviewShow();
  NPS.display.transcriptControls();
  NPS.display.footerControls();
  NPS.display.resultAlert();
  NPS.display.tabsSetup();
  NPS.display.alert();
  NPS.display.tiles();
  NPS.text.textSizes();
  NPS.newContent.webcamLink();
  NPS.newContent.moreLinks();
  NPS.newContent.getTweets("CivilWarReportr", 1, jQuery('#tweet'));
  NPS.newContent.addPrintLink();
  NPS.forms.searchDropdown();
  NPS.forms.liveSearch();
  NPS.forms.placeholder();
  NPS.forms.sortBySubmit();
  /* Commented out 2/27/12 by Lisa Backer, Fig Leaf Software.  Awaiting instructions on how to properly remove this from the global.js file.
  NPS.forms.regForm();
  */
  NPS.cycle.bapSlider();
  NPS.cycle.carousel();
  NPS.lightbox.lightbox();
  NPS.lightbox.rateBtn();
  NPS.lightbox.eventDetails();
  NPS.gallery.tooltip();
  NPS.gallery.photoGallery();
  NPS.starRating.starRatings();
  
  if(jQuery('#slidebox').length) {
    jQuery('#slidebox').slidebox();
  }
  //if(jQuery('.urb-browser').length) {
    //preload urb images
  //  NPS.utility.preload(NPS.utility.params.preloadUrb);
    //initiate resource broswer
  //  NPS.urb = resourceBrowser.init();
  // }

  //uncomment below to provide browser back button functionality to the back button class
  //jQuery('#back .back-button').click(function(){window.history.back(1);});
  
  // Added after 508 upgrade because the image use to have the text and when we upgraded the text was placed in the div.
  // this became a problem with L3 and caching so we are cleaning this up using jquery to detect if they have text or not
  // in the div.
  // this can be removed after 11-07-2012 or if the site was puged
  if( jQuery('#alert-box').text() === '' ){
    jQuery('#alert-box').text("There are park alerts in effect.");
  }
  
});

jQuery(window).load(function(){
  //need to wait to window has loaded so Webkit gets height correct for certain functions
  NPS.utility.setMinContentHeight();
});

if (location.href.indexOf('www') > -1) {
  document.write("<script src='/common/commonspot/templates/js/federated-analytics.js'><\/script>");
  document.write("<script src='/common/commonspot/templates/js/nps-analytics.js'><\/script>");
}