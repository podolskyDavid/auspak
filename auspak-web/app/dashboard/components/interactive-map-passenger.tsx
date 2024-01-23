"use client"

import { GoogleMap, Marker, useLoadScript, DirectionsRenderer } from '@react-google-maps/api';
//import type { NextPage } from 'next';
//import styles from '../styles/Home.module.css';
import { useEffect, useMemo, useState } from 'react';
import { sendData, fetchData } from '../../services/apiService';
import { ShowerHead } from 'lucide-react';
import { set } from 'react-hook-form';
import { Button } from "@/components/ui/button";


export default function InteractiveMapPassenger({ token }: { token: string }) {

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
  const [buttonClicked, setButtonClicked] = useState(false);
  const [busNumber, setBusNumber] = useState<number | null>(null);
  const [busStarted, setBusStarted] = useState(false);

  
  const [passenger_marker, setPassengerMarker] = useState<MarkerType[]>([]);

  const [busMarkers, setBusMarkers] = useState<MarkerType[]>([]);
  const [stopMarkers, setStopMarkers] = useState<MarkerType[]>([]);

  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);


  useEffect(() => {
    const loadBusMarkers = async () => {
      const stopsResponse = await fetchData('stops/list', { token: token });
      const fetchedMarkers = await stopsResponse.json();
      if (!stopsResponse.ok) {
        console.error("Couldn't fetch list of buses and stops:", fetchedMarkers);
        return;
      }
      console.log('Markers received:', fetchedMarkers);
      const fetchedBusMarkers = fetchedMarkers.buses;
      if (fetchedBusMarkers) {
        if (fetchedBusMarkers.length > 0) {
          setBusNumber(fetchedBusMarkers[0].bus_id);
          if (fetchedBusMarkers[0].lat) {
            setBusStarted(true);
          }
        }
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
        setBusMarkers(busMarkersData);
      } else {
        console.error('Error: fetchedBusMarkers.data is not an array');
      }
      const fetchedStopMarkers = fetchedMarkers.stops;
      if (fetchedStopMarkers) {
        const stopMarkersData = fetchedStopMarkers.map((marker: any) => ({
          position: {
            lat: marker.lat,
            lng: marker.long
          },
          icon: {
            url: (marker.entity == 'static' ? '/bus-stop.png'
              : marker.entity == 'passenger_pickup' ? '/hail.png'
              : 'box.png'),
            scaledSize: new google.maps.Size(30, 30)
          }
        }));
        setStopMarkers(stopMarkersData);
      } else {
        console.error('Error: fetchedStopMarkers is not an array');
      }
    };
    loadBusMarkers();
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

  useEffect(() => {
    if (isLoaded) {
    const directionsService = new google.maps.DirectionsService();
    const origin = stopMarkers[0]?.position; // Assuming the first marker is the start
    const destination = stopMarkers[stopMarkers.length - 1]?.position; // Assuming the last marker is the end

    if (origin && destination) {
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
          waypoints: stopMarkers.slice(1, -1).map(marker => ({ location: marker.position, stopover: true })),
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
  }, [isLoaded, stopMarkers]);

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

  const handleButton = async () => {
    console.log('Button clicked!');
    try {
      const endpoint = "stops";
      const params = { token: token };

      const body = {
        "lat": lat,
        "long": long,
        "entity": "passenger_pickup",
        "name": address
      };
  
      // Send POST request
      const response = await (await sendData(endpoint, params, body)).json();

      if (!response) {
        throw new Error('Response is undefined');
      }
      const bus_id = response.data.bus_id;
      console.log('Bus ID:', bus_id);
      // Update state or perform other actions after a successful request
      setButtonClicked(true);
    } catch (error) {
      console.error('Error sending POST request:', error);
    }

    //TODO bus



    //TODO show bus marker on the map
    //console.log(response);

    // Add any additional logic you want to execute when the button is clicked
  };
  return (
    <div className="relative text-2xl"> {/* Add relative positioning here */}
      <div id="passenger-headline" className="flex justify-between gap-6">
        <div className="text-3xl font-bold">
          Dashboard
        </div>
      </div>
      <div className="text-2xl font-bold">
        {busNumber != null ? (
        <p>{`Bus ${busNumber} ${busStarted ? 'is' : 'will soon be'} on its way`}</p>
        ) : (
            <Button
              className="flex gap-4"
              onClick={handleButton}
              disabled={buttonClicked}
             >
              <div>
                Select pickup location and press this button
              </div>
            </Button>
        )
        }
      </div>
      <GoogleMap
        onClick={handleMapClick} // Add the onClick event handler here
        options={mapOptions}
        zoom={14}
        center={mapCenter}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: '1200px', height: '800px' }} // Ensure width has 'px'
        onLoad={() => console.log('Map Component Loaded...')}
      >
        {passenger_marker.map((marker, index) => ( busNumber == null && 
          <Marker key={index} position={marker.position} icon={marker.icon} />
        ))}
        {busMarkers.length > 0 && busMarkers.map((marker, index) => (
          <Marker key={index} position={marker.position} icon={marker.icon} />
        ))}
        {stopMarkers.length > 0 && stopMarkers.map((marker, index) => (
          <Marker key={index} position={marker.position} icon={marker.icon} />
        ))}
        {directionsResponse && (
          <DirectionsRenderer
            directions={directionsResponse}
            options={{
              polylineOptions: {
                strokeColor: '#D9E866',
                strokeOpacity: 1,
                strokeWeight: 5,
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

