"use client"

import {Button} from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import fetchData from '../../services/apiService';


function mapStopEntity(stopEntity: string | undefined): string {

  switch (stopEntity) {
    case 'static':
      return "Regular stop";
    case 'passenger_pickup':
      return "Picking up passengers";
    case 'parcel_pickup':
      return "Picking up a package";
    case 'parcel_dropoff':
      return "Dropping off a package";
    default:
      return "Unknown stop";
  }
}


export default function BusDriverDashboard() {

  interface BusData {
    current_stop?: StopData;
    next_stops?: StopData[];
  }

  interface StopData {
    name?: string;
    entity?: string;
    lat?: number;
    long?: number;
  }

  const [data, setData] = useState<BusData | null>(null);  

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchData('bus/list_stops?token=driver_0');
        console.log('Data received:', fetchedData);
        setData(fetchedData);
      } catch (error) {
        console.error('Fetching data error:', error);
      }
    };

    loadData();
  }, []);

  if (!data) {
    return;
  }

  const current_stop = data.current_stop;
  const next_stops = data.next_stops;

  if (!current_stop) {
    return (
      <div id="chats-list" className="">
        <div id="chats-headline" className="flex justify-between gap-6">
          <div className="text-3xl font-bold">
            Dashboard
          </div>
          <div className="flex gap-4">
            <Button className="w-56">
              Start the bus
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div id="driver-dashboard" className="">
      <div id="bus-headline" className="flex justify-between gap-6">
        <div className="text-3xl font-bold">
          Dashboard
        </div>
        <div className="flex gap-4">
          <Button className="w-56">
            Next Stop
          </Button>
          <Button className="w-56">
            Stop the bus
          </Button>
        </div>
      </div>

      <div className="flex">

        <div className="flex flex-col mt-4 mb-4 gap-4 min-w-96">
          <div className="text-2xl font-bold mr-48">
            Current Stop
          </div>
          {current_stop ? (
            <div>
              <div className="text-2xl">
                <div>{current_stop.name}</div>
              </div>
              <div className="font-light">
                <div>{mapStopEntity(current_stop.entity)}</div>
              </div>
            </div>
          ) : (
            <div>No current stop data available</div>
          )}
        </div>

        <div className="flex flex-col mt-4 mb-4 gap-4 w-full">
          <div className="text-2xl font-bold mr-48">
            Next Stops
          </div>
          {next_stops ? (
            <div className="flex justify-between">
              <div>
                <div className="text-2xl">
                  <div>{next_stops[0].name}</div>
                </div>
                <div className="font-light">
                  <div>{mapStopEntity(next_stops[0].entity)}</div>
                </div>
              </div>
              <div>
                <div className="text-2xl">
                  <div>{next_stops[1].name}</div>
                </div>
                <div className="font-light">
                  <div>{mapStopEntity(next_stops[1].entity)}</div>
                </div>
              </div>
              <div>
                <div className="text-2xl">
                  <div>{next_stops[2].name}</div>
                </div>
                <div className="font-light">
                  <div>{mapStopEntity(next_stops[2].entity)}</div>
                </div>
              </div>
            </div>
          ) : (
            <div>No next stops data available</div>
          )}
        </div>

      </div>

    </div>
  )
}