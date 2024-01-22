"use client"

import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
//import type { NextPage } from 'next';
//import styles from '../styles/Home.module.css';
import { useEffect, useMemo, useState } from 'react';
import {sendData, fetchData} from '../../services/apiService';
import { ShowerHead } from 'lucide-react';
import { set } from 'react-hook-form';


export default function InteractiveMapPassenger() {

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

  
  const [passenger_marker, setPassengerMarker] = useState<MarkerType[]>([]);

  const [bus_marker, setBusMarker] = useState<MarkerType[]>([]);


  useEffect(() => {
    const loadBusMarkers = async () => {
      try {
        const fetchedBusMarkers = await fetchData("buses/list", {"token": "operator_0"});
        console.log('Bus markers received:', fetchedBusMarkers);
        if (fetchedBusMarkers) {
          const busMarkersData = fetchedBusMarkers.map((marker: any) => ({
            position: {
              lat: marker.lat,
              lng: marker.long
            },
            icon: {
              url: '/bus.png', // Assuming the icon is the same for all bus markers
              scaledSize: new google.maps.Size(30, 30) // Assuming the same size for all bus markers
            }
          }));
          setBusMarker(busMarkersData);
        } else {
          console.error('Error: fetchedBusMarkers.data is not an array');
        }
      } catch (error) {
        console.error('Fetching bus markers error:', error);
      }
    };
    loadBusMarkers();
  }, []);



  
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

  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    // Get latitude and longitude from the map click event
    if (event.latLng) {
      setLat(event.latLng.lat());
      setLong(event.latLng.lng());

      setPassengerMarker([{
        position: event.latLng!.toJSON(),
        icon: {
          url: '/hail.png', // Path to the image in the public folder
          scaledSize: new google.maps.Size(30, 30), // Adjust the size as needed
        },
      }]);

      console.log(passenger_marker);
      const geocoder = new google.maps.Geocoder();
      const resp = await geocoder.geocode({ location: event.latLng});
      const newAddress = resp.results[0].address_components[1].long_name + " " + resp.results[0].address_components[0].long_name;
      setAddress(newAddress);
  };
  }

  const handleButton = () => {
    console.log('Button clicked!');
    const endpoint = "stops/"; // Replace with your actual endpoint
    const params = {"token": "passenger_0"}

    const body = {
      "lat": lat,
      "long": long,
      "entity": "passenger_pickup",
      "name": address
    };

    let response;

    try {
      response = sendData(endpoint, params, body);
      console.log('Data sent successfully:', response);
    } catch (error) {
      console.error('Error sending data:', error);
    }
    
    response.then(data => {
      const bus_id = data.bus_id;
      console.log('Bus ID:', bus_id);
    }).catch(error => {
      console.error('Error extracting bus_id:', error);
    });

    //TODO bus



    //TODO show bus marker on the map
    //console.log(response);

    // Add any additional logic you want to execute when the button is clicked
  };
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
        {passenger_marker.map((marker, index) => (
        <Marker key={index} position={marker.position} icon={marker.icon} />
      ))}
        {bus_marker.length > 0 && bus_marker.map((marker, index) => (
          <Marker key={index} position={marker.position} icon={marker.icon} />
        ))}
      </GoogleMap>



      <button
        className="absolute top-1/2 left-1/2 z-10 flex flex-col mt-4 mb-4 gap-4 min-w-96 transform -translate-x-1/2 -translate-y-1/2 bg-auspak-dark-grey text-white p-2"
        onClick={handleButton}
        style={{ margin: '10px' }}>
          <div className="text-2xl font-bold">
            Order Bus
          </div>
      </button>

    </div>
  );
};

