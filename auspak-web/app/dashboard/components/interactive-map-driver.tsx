"use client"

import { GoogleMap, Marker, useLoadScript, Polyline, DirectionsRenderer, DirectionsService} from '@react-google-maps/api';
import { useEffect, useMemo, useState } from 'react';
import {sendData, fetchData} from '../../services/apiService';
import { ShowerHead } from 'lucide-react';



export default function InteractiveMapDriver() {
  const libraries = useMemo(() => ['places'], []);


  type MarkerType = {
    position: google.maps.LatLng | google.maps.LatLngLiteral;
    icon: {
      url: string;
      scaledSize: google.maps.Size;
    };
  };
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [long, setLong] = useState(0);
  const [lat, setLat] = useState(0);

  
  const [stop_markers, setStopMarker] = useState<MarkerType[]>([]);
  const [driver_marker, setDriverMarker] = useState<MarkerType[]>([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as any,
    libraries: libraries as any,
  });

  
  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedMarkers = await fetchData("stops/list", {"token": "ryan.gosling@drive.com"});
        console.log('Markers received:', fetchedMarkers);
        if (fetchedMarkers) {
          const markersData = fetchedMarkers.map((marker: any) => ({
            position: {
              lat: marker.lat,
              lng: marker.long
            },
            icon: {
              url: '/bus-stop.png', // Assuming the icon is the same for all markers
              scaledSize: new google.maps.Size(30, 30) // Assuming the same size for all markers
            }
          }));
          setStopMarker(markersData);
        } else {
          console.error('Error: fetchedMarkers.data is not an array');
        }
      } catch (error) {
        console.error('Fetching markers error:', error);
      }
    };
    loadData();
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

  useEffect(() => {
    if (isLoaded) {
    const directionsService = new google.maps.DirectionsService();
    const origin = stop_markers[0]?.position; // Assuming the first marker is the start
    const destination = stop_markers[stop_markers.length - 1]?.position; // Assuming the last marker is the end

    if (origin && destination) {
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
          waypoints: stop_markers.slice(1, -1).map(marker => ({ location: marker.position, stopover: true })),
          optimizeWaypoints: true,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result || null);
          } else {
            console.error(`error fetching directions ${status}`);
          }
        }
      );
    }
  }
  }, [isLoaded, stop_markers]);

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  const path = stop_markers.map(marker => marker.position);

  return (
    <div className={"relative text-2xl"}> {/* Add relative positioning here */}
      {/* ... other code ... */}
      <GoogleMap
        options={mapOptions}
        zoom={14}
        center={mapCenter}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: '1200px', height: '800px' }} // Ensure width has 'px'
        onLoad={() => console.log('Map Component Loaded...')}
      >
        {stop_markers.map((marker, index) => (
          <Marker key={index} position={marker.position} icon={marker.icon} />
        ))}
        {/* <Polyline
          path={path}
          options={{
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            clickable: false,
            draggable: false,
            editable: false,
            visible: true,
            radius: 30000,
            zIndex: 1
          }}
        /> */}

        {directionsResponse && (
          <DirectionsRenderer
            directions={directionsResponse}
            options={{
              polylineOptions: {
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
              },
              markerOptions: {
                visible: false, // Set to false if you don't want to show default markers
              },
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

