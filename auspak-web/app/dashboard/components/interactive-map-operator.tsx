"use client"

import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { useEffect, useMemo, useState } from 'react';
import {sendData, fetchData} from '../../services/apiService';
import { ShowerHead } from 'lucide-react';


export default function InteractiveMapOperator({ token }: { token: string }) {

  type MarkerType = {
    position: google.maps.LatLng | google.maps.LatLngLiteral;
    icon: {
      url: string;
      scaledSize: google.maps.Size;
    };
  };

  const libraries = useMemo(() => ['places'], []);
  const [address, setAddress] = useState('Please select a location');
  const [long, setLong] = useState(0);
  const [lat, setLat] = useState(0);

  
  const [stopMarkers, setStopMarkers] = useState<MarkerType[]>([]);
  const [busMarkers, setBusMarkers] = useState<MarkerType[]>([]);
  const [latest_marker, setLatestMarker] = useState<MarkerType[]>([]);

  
  useEffect(() => {
    const loadData = async () => {
      const stopsResponse = await fetchData('stops/list', { token: token });
      const fetchedMarkers = await stopsResponse.json();
      if (!stopsResponse.ok) {
        console.error("Couldn't fetch list of buses and stops:", fetchedMarkers);
        return;
      }
      console.log('Markers received:', fetchedMarkers);
      const fetchedStopMarkers = fetchedMarkers.stops;
      if (fetchedStopMarkers) {
        const stopMarkersData = fetchedStopMarkers.map((marker: any) => ({
          position: {
            lat: marker.lat,
            lng: marker.long
          },
          icon: {
            url: '/box.png', // Assuming the icon is the same for all markers
            scaledSize: new google.maps.Size(30, 30) // Assuming the same size for all markers
          }
        }));
        setStopMarkers(stopMarkersData);
      } else {
        console.error('Error: fetchedMarkers.data is not an array');
      }
      const fetchedBusMarkers = fetchedMarkers.buses;
      if (fetchedBusMarkers) {
        const busMarkersData = fetchedBusMarkers.map((marker: any) => ({
          position: {
            lat: marker.lat,
            lng: marker.long
          },
          icon: {
            url: '/bus.png', // Assuming the icon is the same for all markers
            scaledSize: new google.maps.Size(30, 30) // Assuming the same size for all markers
          }
        }));
        setBusMarkers(busMarkersData);
      } else {
        console.error('Error: fetchedMarkers.data is not an array');
      }
    };
    loadData();
  }, [token]);


  const mapCenter = useMemo(
    () => ({ lat: 48.1351, lng: 11.5820 }),
    []
  );  

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
      scrollwheel: true,
      restriction: {
        latLngBounds: {
          north: 48.25560092726563,
          south: 48.01980429314496,
          east: 11.769519351785643,
          west: 11.33283319893357,
        },
        strictBounds: true,
      },
      styles: [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f5f5"
            }
          ]
        },
        {
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#f5f5f5"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#bdbdbd"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#eeeeee"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "poi.business",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e5e5e5"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ffffff"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dadada"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e5e5e5"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#eeeeee"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#c9c9c9"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        }
      ],
      disableDoubleClickZoom: true,
      gestureHandling: 'cooperative', // Require two-finger touch gestures



    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as any,
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submit action

    const formData = new FormData(event.currentTarget);

    const endpoint = "stops/";
    const params = { token: token };
    const body = {
      "entity": formData.get('type') as string,
      "lat": lat,
      "long": long,
      "name": formData.get('address') as string 
    };

    try {
      const response = await sendData(endpoint, params, body);
      console.log('Data sent successfully:', response);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    // Get latitude and longitude from the map click event
    if (event.latLng) {
      setLat(event.latLng.lat());
      setLong(event.latLng.lng());

      setLatestMarker([{
        position: event.latLng!.toJSON(),
        icon: {
          url: '/box.png', // Path to the image in the public folder
          scaledSize: new google.maps.Size(30, 30), // Adjust the size as needed
        },
      }]);
      console.log(latest_marker);
      const geocoder = new google.maps.Geocoder();
      const resp = await geocoder.geocode({ location: event.latLng});
      const newAddress = resp.results[0].address_components[1].long_name + " " + resp.results[0].address_components[0].long_name;
      setAddress(newAddress);
  };
  }

  return (
    <div
      className="relative text-2xl overflow-auto flex items-center justify-center"> {/* Add relative positioning here */}
      <GoogleMap
        onClick={handleMapClick} // Add the onClick event handler here
        options={mapOptions}
        zoom={14}
        center={mapCenter}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{width: '1300px', height: '800px'}} // Ensure width has 'px'
        onLoad={() => console.log('Map Component Loaded...')}
      >
        {stopMarkers.map((markers, index) => (
          <Marker key={index} position={markers.position} icon={markers.icon}/>
        ))}
        {busMarkers.map((markers, index) => (
          <Marker key={index} position={markers.position} icon={markers.icon}/>
        ))}
        {latest_marker.length > 0 && latest_marker.map((marker, index) => (
          <Marker key={index} position={marker.position} icon={marker.icon}/>
        ))}
      </GoogleMap>

      <div className={"absolute top-24 left-0 transform -translate-y-1/2 p-4"}>
        <form className={"bg-auspak-green p-4 rounded-lg shadow-lg"} onSubmit={handleSubmit}>
          <div className="text-lg">
            <label htmlFor="address">Address: </label>
            <input className="bg-auspak-green" id="address" name="address" value={address} onChange={(e) => setAddress(e.target.value)} required/>
          </div>
          <div className="text-lg">
            <label htmlFor="type">Type: </label>
            <select className="bg-auspak-green" id="type" name="type" required>
              <option value="parcel_pickup">Parcel Pickup</option>
              <option value="parcel_dropoff">Parcel Drop Off</option>

            </select>
          </div>
          <button className="text-lg font-light rounded bg-auspak-dark-grey text-white pl-1 pr-1" type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

