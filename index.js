//when the jQuery Mobile page is initialised
$(document).on('pageinit', function() {
	
	//set up listener for button click
	$(document).on('click', getPosition);
	
	//change time box to show message
	$('#time').val("Press the button to get location data");
	
});


//Call this function when you want to get the current position
function getPosition() {
	
	//change time box to show updated message
	$('#time').val("Getting data...");
	
	//instruct location service to get position with appropriate callbacks
	navigator.geolocation.getCurrentPosition(successPosition, failPosition);
}


//called when the position is successfully determined
function successPosition(position) {
	

	//lets get some stuff out of the position object
	var time = position.timestamp;
    var date = new Date(time);
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	
	//OK. Now we want to update the display with the correct values
	$('#time').val(date);
	$('#lattext').val(latitude);
	$('#longtext').val(longitude);
	
    var Map;
    var Infowindow;
    // Get geo coordinates
        getPlaces(latitude, longitude);

    // Get places by using coordinates

    function getPlaces(latitude, longitude) {

        var latLong = new google.maps.LatLng(latitude, longitude);

        var mapOptions = {

            center: new google.maps.LatLng(latitude, longitude),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP

        };

        Map = new google.maps.Map(document.getElementById("places"), mapOptions);

        Infowindow = new google.maps.InfoWindow();

        var service = new google.maps.places.PlacesService(Map);
        service.nearbySearch({

            location: latLong,
            radius: 500,
            type: ['pub']
        }, foundStoresCallback);

    }

    // Success callback for watching your changing position

    var onPlacesWatchSuccess = function (position) {

        var updatedlatitude = position.coords.latitude;
        var updatedlongitude = position.coords.longitude;

        if (updatedlatitude != latitude && updatedlongitude != longitude) {

            latitude = updatedlatitude;
            longitude = updatedlongitude;

            getPlaces(updatedlatitude, updatedlongitude);
        }
    }

    // Success callback for locating stores in the area

    function foundStoresCallback(results, status) {

        if (status === google.maps.places.PlacesServiceStatus.OK) {

            for (var i = 0; i < results.length; i++) {

                createMarker(results[i]);

            }
        }
    }

    // Place a pin for each store on the map

    function createMarker(place) {

        var placeLoc = place.geometry.location;

        var marker = new google.maps.Marker({
            map: Map,
            position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function () {

            Infowindow.setContent(place.name);
            Infowindow.open(Map, this);

        })
    }

    // Error callback

    function onPlacesError(error) {
        console.log('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
    }

    // Watch your changing position

    function watchPlacesPosition() {

        return navigator.geolocation.watchPosition
        (onPlacesWatchSuccess, onPlacesError, { enableHighAccuracy: true });
    }
}

//called if the position is not obtained correctly
function failPosition(error) {
	//change time box to show updated message
	$('#time').val("Error getting data: " + error);
	
}