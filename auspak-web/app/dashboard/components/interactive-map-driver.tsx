"use client"

import { GoogleMap, Marker, useLoadScript, Polyline, DirectionsRenderer, DirectionsService} from '@react-google-maps/api';
import { useEffect, useMemo, useState } from 'react';
import {sendData, fetchData} from '../../services/apiService';
import { ShowerHead } from 'lucide-react';



export default function InteractiveMapDriver({ token }: { token: string }) {
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

  
  const [stopMarkers, setStopMarkers] = useState<MarkerType[]>([]);
  const [busMarkers, setBusMarkers] = useState<MarkerType[]>([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as any,
    libraries: libraries as any,
  });


  useEffect(() => {
    const loadData = async () => {
      const stopsResponse = await fetchData('stops/list', { token: token });
      const fetchedMarkers = await stopsResponse.json();
      if (!stopsResponse.ok) {
        console.error("Couldn't fetch list of buses and stops:", fetchedMarkers);
        return;
      }
      console.log('Markers received:', fetchedMarkers);
      const fetchedBusMarkers = fetchedMarkers.buses;
      if (fetchedBusMarkers) {
        const busMarkersData = fetchedBusMarkers.map((marker: any) => ({
          position: {
            lat: marker.lat,
            lng: marker.long
          },
          icon: {
            url: '/bus.png',
            scaledSize: new google.maps.Size(35, 35)
          }
        }));
        setBusMarkers(busMarkersData);
      } else {
        console.error('Error: fetchedBusMarkers is not an array');
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

  const path = stopMarkers.map(marker => marker.position);

  return (
    <div className="relative text-2xl overflow-auto flex items-center justify-center"> {/* Add relative positioning here */}
      {/* ... other code ... */}
      <GoogleMap
        options={mapOptions}
        zoom={14}
        center={mapCenter} 
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: '1200px', height: '1200px' }} // Ensure width has 'px'
        onLoad={() => console.log('Map Component Loaded...')}
      >
        {stopMarkers.map((marker, index) => (
          <Marker key={index} position={marker.position} icon={marker.icon} />
        ))}
        {busMarkers.map((marker, index) => (
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

