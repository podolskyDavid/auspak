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
    <div className={"relative text-2xl"}> {/* Add relative positioning here */}
      <GoogleMap
        onClick={handleMapClick} // Add the onClick event handler here
        options={mapOptions}
        zoom={14}
        center={mapCenter}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: '1200px', height: '800px' }} // Ensure width has 'px'
        onLoad={() => console.log('Map Component Loaded...')}
      >
      {stopMarkers.map((markers, index) => (
        <Marker key={index} position={markers.position} icon={markers.icon} />
      ))}
      {busMarkers.map((markers, index) => (
        <Marker key={index} position={markers.position} icon={markers.icon} />
      ))}
      {latest_marker.length > 0 && latest_marker.map((marker, index) => (
        <Marker key={index} position={marker.position} icon={marker.icon} />
      ))}
      </GoogleMap>

      <div className={"absolute top-1/2 left-1/4 transform -translate-y-1/2 p-4"}>
        <form className={"bg-white p-4 rounded shadow-lg"} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="address">Address</label>
            <input id="address" name="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="type">Type</label>
            <select id="type" name="type" required>
              <option value="parcel_pickup">Parcel Pickup</option>
              <option value="parcel_dropoff">Parcel Drop Off</option>

            </select>
          </div>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

