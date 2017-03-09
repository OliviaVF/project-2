/* global google:ignore */
const pylonApp = pylonApp || {};

pylonApp.toggleMenu = function() {
  $('.dropdown').toggle();
};

pylonApp.updateModal = function(pylon) {
  $('.modal-body h1').text(pylon.name);
  $('[name=category]').val(pylon.category);
  $('[name=address]').val(pylon.address);
  $('[name=tel]').val(pylon.tel);
  $('[name=website]').val(pylon.website);
  $('[name=comments]').val(pylon.comments);
  $('form.newForm').attr('action', `/pylons/${pylon._id}`);
};

pylonApp.initMap = function() {
  const latLng = { lat: 51.515113, lng: -0.072051 };
  this.map = new google.maps.Map(this.$map.get(0), {
    zoom: 12,
    center: latLng,
    scrollwheel: false,
    styles: this.mapStyles
  });

  this.myLocation();
};

pylonApp.myLocation = function() {
  const infoWindow = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    icon: '/assets/images/me.png'
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      this.map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, this.map.getCenter());
    });
  } else {
  // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, this.map.getCenter());
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
  }
};

pylonApp.autcomplete = function() {
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
        map: pylonApp.map,
        animation: google.maps.Animation.DROP
      });

      if (place.geometry.viewport) {
        pylonApp.map.fitBounds(place.geometry.viewport);
      } else {
        pylonApp.map.setCenter(place.geometry.location);
        pylonApp.map.setZoom(17);
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
};

pylonApp.addMarkers = function(pylons) {
  pylons.forEach((pylon) => {
    const marker = new google.maps.Marker({
      position: { lat: parseFloat(pylon.lat), lng: parseFloat(pylon.lng) },
      map: this.map,
      animation: google.maps.Animation.DROP
    });
    this.markers.push(marker);
    google.maps.event.addListener(marker, 'click', () => {
      $('#modalTrigger').trigger('click');
      this.updateModal(pylon);
    });
  });
};

pylonApp.filterpins = function(){
  console.log('inside filter');
  event.preventDefault();

  const category = $('.category').val();

  for (var i = 0; i < this.markers.length; i++) {
    this.markers[i].setMap(null);
  }

  if ($('.userMap').length) {
    if(category === 'All') {
      return this.addMarkers(this.pylons);
    }

    var filteredPylons = this.pylons.filter((pylon) => {
      return pylon.category === category;
    });

    this.addMarkers(filteredPylons);
  }
};



pylonApp.setup = function() {
  this.$dropdown = $('.dropdown');
  this.markers = [];
  this.$map = $('#map');
  this.$menu = $('.menu');
  this.pylons = $('#map').data('pylons');
  if (this.$map.length) this.initMap();
  if(this.pylons) this.addMarkers(this.pylons);
  this.$searchForm = $('.search-form');

  this.autcomplete();

  this.$searchForm.on('submit', this.filterpins.bind(this));

  this.$menu.on('click', this.toggleMenu.bind(this));

  $(window).on('resize', () => {
    if ($(window).width() >= 950 ) {
      $('.dropdown').show();
    }
  });
};


$(pylonApp.setup.bind(pylonApp));
