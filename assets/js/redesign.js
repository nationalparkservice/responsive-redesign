$(document).ready(function() {

  // BAR 
  var rotators = [];
  var BAR = function(data) {
    var data = data;
    var timeOut;

    var slickConfig = {
      infinite: true,
      speed: 500,
      arrows: false,
      autoplay: true,
      autoplaySpeed: 5000,
      dots: true,
      fade: true,
      slide: 'li',
      pauseOnDotsHover: true,
      cssEase: 'linear',

      onBeforeChange: function() {
        var $this = $(this);
        $this[0].$list.find('.sub').hide();
        clearTimer(timeOut);
      },
      onAfterChange: function() {
        var $this = $(this);
        timeOut = setTimeout(function() {
          fadeIn($this, timeOut);
        }, 2500);
      }
    }

    function clearTimer(timeOut) {
      clearTimeout(timeOut);
      timeOut = null;
    }

    function fadeIn($this, interval) {
      $this[0].$list.find('.sub').fadeIn(600);
      clearTimer(timeOut);
    }

    var exports = {
      initialize: function(data) {
        this.$el = data.el;
        // Create Slick Rotator
        this.initRotator();
      },

      initRotator: function() {
        var $this = this.$el;

        if (this.$el.hasClass('-no-delay')) {
          slickConfig.onBeforeChange = null;
          slickConfig.onAfterChange = null;
        }
        var $viewAll = this.$el.find('li.viewAll').detach();
        this.$el.find('ul').slick(slickConfig);

        if ($viewAll) {
          $($viewAll.html()).insertBefore($this.find('.slick-dots'));
        }
      }
    };

    exports.initialize(data);
    return exports;
  };

  $('[data-fader]').each(function(index) {
    var $this = $(this);
    rotators.push(new BAR({
      el: $this,
      index: index
    }));
  });

  // Photo Gallery
  var $lightbox = $(".lightbox");
  if ($lightbox.length) {
    $(".lightbox").magnificPopup({
      type:'image',
      gallery:{
        enabled:true
      }
    });
  }

  // Readmore
  var $expandable = $('.expandable');
  if ($expandable.length) {
    $expandable.readmore({
      collapsedHeight: 40,
      moreLink: '<span>&#8230;<span> <a href="#">more</a>',
      lessLink: '<a href="#">less</a>'
    });
  }

  // DatePicker
  var $dateRange = $('.input-daterange');
  if ($dateRange.length) {
    $dateRange.datepicker({
      clearBtn: true,
      todayBtn: "linked",
      todayHighlight: true
    });
  }
    
});
