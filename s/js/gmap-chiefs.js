var map;
      var panoStartLatLng = new google.maps.LatLng(49.67912, -123.15586);
      var chief = new google.maps.LatLng(49.68151, -123.15586);
      
      var image = new google.maps.MarkerImage('pin.png',

      new google.maps.Size(385, 379),
      new google.maps.Point(0,0),
      new google.maps.Point(192, 379));

	  var marker;
      var markerPos = new google.maps.LatLng(49.67912, -123.15563);
      var isPanorama = 0;

      function getCustomPanoramaTileUrl(pano, zoom, tileX, tileY) {
        
        // Return the URL of the tile.
        return 'http://chiefs.russellgordon.org/p/' + pano + '/' + tileX + '-' + tileY + '.jpg';
      }
 
      function createCustomPanoramaData(room, pano) {
        return {
          location: {
          
            // The pano ID for confirmation.
            pano: pano,
          
            // The text for the address control.
            description: "Chiefs Do The Chief - " + room.name
          },
          
          // The array of links to navigate to other panoramas.
          links: room.links,
          
          // The text for the copyright control.
          copyright: 'Imagery (c) 2012 R. Bucks',
          
          // The definition of the tiles for this panorama.
          tiles: {
          	tileSize: new google.maps.Size(512, 512),
        	worldSize: new google.maps.Size(4096, 2048),
            // The heading at the origin of the panorama tile set.
            originHeading: room.originHeading,
            getTileUrl: getCustomPanoramaTileUrl
          }
        };
      }
 
      function getHeading(latLngFrom, latLngTo) {
        // Code to calculate the bearing.
        // Latitude/longitude spherical geodesy formulae & scripts (c) Chris Veness
        // 2002-2010 - www.movable-type.co.uk/scripts/latlong.html
        // Licence: CC-BY http://creativecommons.org/licenses/by/3.0/
        // <snip>
        var toLat = latLngTo.lat() / 180 * Math.PI;
        var fromLat = latLngFrom.lat() / 180 * Math.PI;
        var dLng = (latLngTo.lng() - latLngFrom.lng()) / 180 * Math.PI;
        var y = Math.sin(dLng) * Math.cos(fromLat);
        var x = Math.cos(toLat) * Math.sin(fromLat) -
                Math.sin(toLat) * Math.cos(fromLat) * Math.cos(dLng);
        return 180 - (Math.atan2(y, x) * 180 / Math.PI);
        // </snip>
      }
 
      function initialize() {
 
        // Setup the map
        var opts = {
          center: chief,
          zoom: 16,
          visibility: "simplified",
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          streetViewControl: true
        };
        map = new google.maps.Map(document.getElementById('map'), opts);
       
        // Setup StreetView
        
        var panorama = new google.maps.StreetViewPanorama(
          document.getElementById('map'), {
            position: panoStartLatLng,
            enableCloseButton: false,
            visible: false,
            pov : {
		      heading: 90,
		      pitch: 10,
		      zoom:0
		    },
            panoProvider: function(pano) {
            var room = rooms[pano];
           
            // Hide the custom marker in StreetView if we enter the building.
            marker.set('visible', !room);
           
            // If the requested panorama is not a custom panorama, it must be a
            // normal StreetView pano ID and return null to get the StreetView
            // Maps API to load the panorama from the StreetView tiles service.
            return room ? createCustomPanoramaData(room, pano) : null;
          }
        });
        map.setStreetView(panorama);
 
		marker = new google.maps.Marker({
	      icon: image,
	      map:map,
	      draggable:false,   
	      position: markerPos
	    });
	            
        var markerStreetView = new google.maps.Marker({
          icon: image,
          map: panorama,
          draggable:false,
          position: markerPos
        });
        
        google.maps.event.addListener(marker, 'click', togglePanorama);
		google.maps.event.addListener(markerStreetView, 'click', togglePanorama);
		google.maps.event.addDomListener(window, 'resize', function() {
	      map.setCenter(chief);
	    });
                		
        function onLinksChanged() {
          var links = panorama.get('links');
          if (!links) return;
          var pano = panorama.getPano();
          if (pano == nearestPano) {
            // Adding a link in the view from the entrance of the building to
            // first custom pano point
            links.push({
              'heading': 90,
              'pano' : '00'
            });
          } else if (pano == '00') {
            // Adding a link in the view from the entrance of the apartment
            // with an arrow pointing at 105 degrees, with a text of "Exit"
            // and loading the street entrance of the building pano on click.
            links.push({
              'heading': 35,
              'description' : 'Highway',
              'pano' : nearestPano
            });
          }
        }

    // The latlng of the entry point to the office on the road.
        var outsideOfficeLatLng = new google.maps.LatLng(49.67912, -123.15586);

        // Compute which is the nearest panorama to the position we care about.
        // We do this asynchronously, using StreetViewService. As the reply could
        // come back as the nearest panorama is already visible, we process
        // onLinksChanged to avoid the race condition.
        var nearestPano = null;
        var headingToEntry = null;
        var client = new google.maps.StreetViewService();
        client.getPanoramaByLocation(outsideOfficeLatLng, 50, function(result, status) {
          if (status == google.maps.StreetViewStatus.OK) {
          nearestPano = result.location.pano;
          headingToEntry = getHeading(result.location.latLng, panoStartLatLng);
          onLinksChanged();
          }      
        });

        // Setup the street link to get to the panorama
        // and exit link to go back to the street.
        google.maps.event.addListener(panorama, 'links_changed', onLinksChanged);
      }
      
	// Toggles between map and panorama view
		function togglePanorama(){
		    if(isPanorama){
		        map.streetView.setVisible(false);
		        isPanorama = 0;
		    } else{
		        map.streetView.setVisible(true);
		        isPanorama = 1;
		    }
		}