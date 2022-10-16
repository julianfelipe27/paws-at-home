let map;

var marker;

var safe_zone;

var llamo = false;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 22,
    disableDefaultUI: true
  });

  const drawingManager = new google.maps.drawing.DrawingManager({
    drawingControlOptions: {
      drawingModes: [
        google.maps.drawing.OverlayType.CIRCLE,
        google.maps.drawing.OverlayType.MARKER
      ]
    }
  })
  
  drawingManager.setMap(map)

  google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event){
    if(event.type == 'circle') {
      var center = event.overlay.getCenter();
      safe_zone = {
        radius: event.overlay.getRadius(),
        center: {
          lat: center.lat(),
          lng: center.lng()
        },
        overlay:event.overlay
      }
    }
  })

  google.maps.event.addListener(map,"center_changed",function(){
    console.log("center_changed")
    navigator.geolocation.getCurrentPosition(function (position) {
      if(google.maps.geometry)
        if(google.maps.geometry.spherical)
          var isInRadious = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(position.coords.latitude,
              position.coords.longitude), safe_zone.overlay.getCenter()) <= safe_zone.radius;
          if(isInRadious == false && llamo== false){
            if(document.querySelector("#engage-digital-alert").textContent == "Connected to Engage Digital")
              document.querySelector("#engage-digital-click-to-call-btn").click();
              llamo = true
          }
              
    })
  })
}

setInterval(function () {

  navigator.geolocation.getCurrentPosition(function (position) {
    
    var newPoint = new google.maps.LatLng(position.coords.latitude,
      position.coords.longitude);
     
    if (marker) {
      marker.setPosition(newPoint);
    }
    else {
      marker = new google.maps.Marker({
        position: newPoint,
        map: map,
        icon: "./dog.png"
      });
    }

    map.setCenter(newPoint);
  });

}, 10000);

window.initMap = initMap;


