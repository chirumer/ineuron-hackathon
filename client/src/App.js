import "./App.css";
import alanBtn from "@alan-ai/alan-sdk-web";
import React, { useEffect } from "react";
import { useSpeechSynthesis } from 'react-speech-kit';

function App() {
  const {speak} = useSpeechSynthesis();

  // const dospeak = () => {
  //   speak({ text:"ninad"});
  // } 


   
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


// async function set_destination(location) {
//     navigator.geolocation.getCurrentPosition(async (position) => {
//         const { latitude:lat, longitude:lng } = position.coords;
//         const post_data = { to: location, from: { lat, lng }};
//         //console.log(post_data);
//         let response = await fetch('https://ineuronbackend-production.up.railway.app/get_route', {
//             method: 'POST',
//             headers: {
//             'Content-Type': 'application/json;charset=utf-8'
//             },
//             body: JSON.stringify(post_data)
//         });
//         const end_locations = await response.json();

//         speak_direction(end_locations[0].instruction);

//         const directions_timer = setInterval(() => {
//             navigator.geolocation.getCurrentPosition(async (position) => {
//             const { latitude:lat, longitude:lng } = position.coords;

//             const threshold = 50; // 100 metres
//             if (getDistanceFromLatLonInKm(lat, lng, end_locations[0].end_location.lat, end_locations[0].end_location.lng) * 1000 < threshold) {
//                 end_locations.shift()
//                 if (end_locations) {
//                     speak_direction(end_locations[0].instruction);
//                 }
//                 else {
//                     clearInterval(directions_timer);
//                     console.log("Done trip");
//                 }
//             }
//         });
//     }, 100);
//     });
// }


  useEffect(() => {
    
    alanBtn({
      key: "b8bd8ab891cce7c43cbb48a7f7162e6d2e956eca572e1d8b807a3e2338fdd0dc/stage",
      onCommand: (commandData) => {
        if (commandData.command === "navigate") {
          navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const locationD = {
              to: commandData.location,
              from: { lat, lng },
            };
            (async () => {
              const rawResponse = await fetch('https://ineuronbackend-production.up.railway.app/get_route', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(locationD)
              });
             
              const end_locations = await rawResponse.json();

              const dospeak = (message) => {
                var msg = new SpeechSynthesisUtterance(message);
                window.speechSynthesis.speak(msg);
              };
              dospeak(end_locations[0].instruction);

              console.log(end_locations[0].instruction);

              const directions_timer = setInterval(() => {
                navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude:lat, longitude:lng } = position.coords;
    
                const threshold = 50; // 100 metres
                if (getDistanceFromLatLonInKm(lat, lng, end_locations[0].end_location.lat, end_locations[0].end_location.lng) * 1000 < threshold) {
                    end_locations.shift()
                    if (end_locations) {
                        console.log(end_locations[0].instruction)
                        dospeak(end_locations[0].instruction);
                    }
                    else {
                        clearInterval(directions_timer);
                        dospeak("done trip")
                        console.log("Done trip");
                    }
                }
            });
        }, 100);
            })();
  
          });
        }
        // if (commandData.command === "go") {
        //  console.log(locationData)
        // }
      },
    });
  }, []);

  return (
    <div className="App">
   ninad sonawne
    </div>
  );
}

export default App;
