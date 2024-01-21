"use client"

import { GoogleMap, useLoadScript } from '@react-google-maps/api';
//import type { NextPage } from 'next';
//import styles from '../styles/Home.module.css';
import { useMemo, useState } from 'react';
import {sendData} from '../../services/apiService';


export default function InteractiveMap() {

  const libraries = useMemo(() => ['places'], []);
  const [address, setAddress] = useState('Please select a location');
  const [long, setLong] = useState(0);
  const [lat, setLat] = useState(0);


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

    const name = formData.get('address') as string;
    const entity = formData.get('type') as string;
    console.log(name);
    console.log(entity);

    const endpoint = 'stops/'; // Replace with your actual endpoint
    const params = { token: 'operator_0' }; // Optional query parameters

    const body = {
      entity: "passenger_pickup",
      lat: 0,
      long: 0,
      //name: name
    };

    console.log(body);


    try {
      const response = await sendData(endpoint, params, body);
      console.log('Data sent successfully:', response);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };



  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    // Get latitude and longitude from the map click event
    setLat(event.latLng.lat());
    setLong(event.latLng.lng());
    const geocoder = new google.maps.Geocoder();
    const latLng = { lat: lat, lng: long };
    const resp = geocoder.geocode({ location: latLng});
    const newAddress = (await resp).results[0].formatted_address
    setAddress(newAddress);
    //console.log(`Latitude: ${lat}, Longitude: ${long}`);
    //console.log(address);
  };

  //const response = await sendData("",formData);

  return (
    <div className={"relative text-2xl"}> {/* Add relative positioning here */}
      <div className={"text-2xl"}>
        <p>This is Sidebar...</p>
      </div>
      <GoogleMap
        onClick={handleMapClick} // Add the onClick event handler here
        options={mapOptions}
        zoom={14}
        center={mapCenter}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: '1200px', height: '800px' }} // Ensure width has 'px'
        onLoad={() => console.log('Map Component Loaded...')}
      />

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

