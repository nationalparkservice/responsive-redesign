/* globals: jQuery, jwplayer */

jQuery(document).ready(function() {
  jwplayer('playerrIqlfrkNZSRG').setup({
    aspectratio: '16:9',
    file: '//www.youtube.com/watch?v=otaYZ60wK5I',
    image: '/images/content/mtn_ice.jpg',
    title: 'America\'s National Parks',
    width: '100%'
  });
});
