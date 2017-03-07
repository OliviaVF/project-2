'use strict';

/* global google:ignore */

$(function () {

  var $map = $('#map');
  if ($map.length) initMap();

  function initMap() {
    var latLng = { lat: 51.515113, lng: -0.072051 };
    var map = new google.maps.Map($map.get(0), {
      zoom: 14,
      center: latLng,
      scrollwheel: false
    });

    var $input = $('#pac-input');
    var options = {
      componentRestrictions: { country: 'uk' },
      types: ['establishment']
    };
    var autocomplete = new google.maps.places.Autocomplete($input[0], options);

    google.maps.event.addListener(autocomplete, 'place_changed', function () {

      var place = autocomplete.getPlace();
      var name = place.name;
      var address = place.formatted_address;
      var tel = place.formatted_phone_number;
      var website = place.website;
      var lat = place.geometry.location.lat();
      var lng = place.geometry.location.lng();
      var marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        icon: '../assets/images/pin.png',
        animation: google.maps.Animation.DROP
      });

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      marker.setPosition(place.geometry.location);
      marker.setVisible(true);
      $('[name=name]').val(name);
      $('[name=tel]').val(tel);
      $('[name=address]').val(address);
      $('[name=website]').val(website);
      $('[name=lat]').val(lat);
      $('[name=lng]').val(lng);
    });

    var pylons = $('#map').data('pylons');
    console.log(pylons);

    if ($('.userMap').length) {
      pylons.forEach(function (pylon) {
        console.log('pylon', pylon);
        var marker = new google.maps.Marker({
          position: { lat: parseFloat(pylon.lat), lng: parseFloat(pylon.lng) },
          map: map,
          // icon: '../assets/images/pin.png',
          animation: google.maps.Animation.DROP
        });
        google.maps.event.addListener(marker, 'click', function () {
          console.log('in here');
          $('#modalTrigger').trigger('click');
          updateModal(pylon);
        });
      });
    }
  }

  function updateModal(pylon) {

    $('.modal-body h1').text(pylon.name);
  }
});