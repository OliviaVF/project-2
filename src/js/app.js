//Facbook oauth

// (function(d, s, id) {
//   var js, fjs = d.getElementsByTagName(s)[0];
//   if (d.getElementById(id)) return;
//   js = d.createElement(s); js.id = id;
//   js.src = '//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.8&appId=179286675905739';
//   fjs.parentNode.insertBefore(js, fjs);
// }(document, 'script', 'facebook-jssdk'));

//Add pylons

/* global google:ignore */

$(() => {

  const $map = $('#map');
  if ($map.length) initMap();
  // let map = null;

  function initMap() {
    const latLng = { lat: 51.515113, lng: -0.072051 };
    var map = new google.maps.Map($map.get(0), {
      zoom: 14,
      center: latLng,
      scrollwheel: false
      // Map styles are stored in another .js file - which is required above the app.js and is available inside this file
    });

    var $input = $('#pac-input');
    var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-0.118092, 51.509865),
      new google.maps.LatLng(-0.117500, 51.510400));
    var options = {
      bounds: defaultBounds,
      types: ['establishment']
    };
    var autocomplete = new google.maps.places.Autocomplete($input[0], options);

    google.maps.event.addListener(autocomplete, 'place_changed', function () {

      var place = autocomplete.getPlace();
      var lat = place.geometry.location.lat();
      var lng = place.geometry.location.lng();
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        icon: '../assets/images/pin.png'
      });
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);
    });
  }
});
