let end_locations;
let directions_timer;

function speak_direction(text) {
  console.log(text);
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

async function set_destination(location) {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude:lat, longitude:lng } = position.coords;
    const post_data = { to: location, from: { lat, lng }};

    let response = await fetch('https://ineuronbackend-production.up.railway.app/get_route', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(post_data)
    });
    end_locations = await response.json();

    speak_direction(end_locations[0].instruction);

    directions_timer = setInterval(() => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude:lat, longitude:lng } = position.coords;

        const threshold = 100; // 100 metres
        if (getDistanceFromLatLonInKm(lat, lng, end_locations[0].end_location.lat, end_locations[0].end_location.lng) * 1000 < threshold) {
          end_locations.shift()
          if (end_locations) {
            speak_direction(end_locations[0].instruction);
          }
          else {
            clearInterval(directions_timer);
          }
        }
      });
    }, 100);
  });
}

set_destination('Basavanagudi');