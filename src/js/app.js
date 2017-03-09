/* global google:ignore */

$(() => {

const mapStyles = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]





  function updateModal(pylon) {
    $('.modal-body h1').text(pylon.name);
    $('[name=category]').val(pylon.category);
    $('[name=address]').val(pylon.address);
    $('[name=tel]').val(pylon.tel);
    $('[name=website]').val(pylon.website);
    $('[name=comments]').val(pylon.comments);
    $('form.newForm').attr('action', `/pylons/${pylon._id}`);
  }

  const markers = [];
  const $map = $('#map');
  if ($map.length) initMap();

  function initMap() {
    const latLng = { lat: 51.515113, lng: -0.072051 };
    var map = new google.maps.Map($map.get(0), {
      zoom: 12,
      center: latLng,
      scrollwheel: false,
      styles: mapStyles

    });

    const infoWindow = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      icon: '/assets/images/me.png'
    });

  // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        infoWindow.setPosition(pos);
        map.setCenter(pos);
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
    // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
    }

    var $input = $('#pac-input');
    if ($input.length) {
    var options = {
      componentRestrictions: {country: 'uk'},
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
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
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
    }
    const pylons = $('#map').data('pylons');
    if(pylons) addMarkers(pylons);
    const $searchForm = $('.search-form');

    $searchForm.on('submit', filterpins);

    function addMarkers(pylons) {
      pylons.forEach((pylon) => {
        const marker = new google.maps.Marker({
          position: { lat: parseFloat(pylon.lat), lng: parseFloat(pylon.lng) },
          map: map,
          animation: google.maps.Animation.DROP
        });
        markers.push(marker);
        google.maps.event.addListener(marker, 'click', function() {
          $('#modalTrigger').trigger('click');
          updateModal(pylon);
        });
      });
    }

    function filterpins(){
      console.log('inside filter');
      event.preventDefault();

      const category = $('.category').val();

      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }

      if ($('.userMap').length) {
        if(category === 'All') {
          return addMarkers(pylons);
        }

        var filteredPylons = pylons.filter((pylon) => {
          return pylon.category === category;
        });

        addMarkers(filteredPylons);
      }
    }
  }
});
