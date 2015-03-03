/* globals jQuery, popupCenter */

jQuery(document).ready(function() {
  function popupCenter(pageURL, title, w, h) {
    var left = (screen.width / 2) - (w / 2),
      top = (screen.height / 2) - (h / 2);

    window.open(pageURL, title, 'status=no, menubar=no, toolbar=no, location=no, scrollbars=yes, resizable=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
  }

  jQuery('.webcam-link-876').click(function(e) {
    e.preventDefault();
    popupCenter(jQuery(this).attr('href'), 'newPop876', ((screen.width - 70) > 1059) ? 1059 : (screen.width - 70), ((screen.height - 50) > 846) ? 846 : (screen.height - 50));
  });
});
