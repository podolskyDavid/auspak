"use client"

import {Button} from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { fetchData, sendData } from '../../services/apiService';


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


export default function BusDriverDashboard({ token }: { token: string }) {

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
  const [startBusClicked, setStartBusClicked] = useState(false);
  const [stopBusClicked, setStopBusClicked] = useState(false);
  const [nextStopClicked, setNextStopClicked] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const stopsResponse = await fetchData('bus/list_stops', { token: token });
      const stopsData = await stopsResponse.json();
      if (!stopsResponse.ok) {
        console.error("Couldn't fetch list of stops:", stopsData);
        return;
      }
      console.log('Data received:', stopsData);
      setData(stopsData);
    };

    loadData();
  }, [token]);

  if (!data) {
    return;
  }

  const current_stop = data.current_stop;
  const next_stops = data.next_stops;

  const handleStartBus = async (bus_id: number) => {
    try {
      const endpoint = 'bus/start';
      const params = { token: token, bus_id: bus_id };
  
      // Send POST request
      await sendData(endpoint, params);
  
      // Update state or perform other actions after a successful request
      setStartBusClicked(true);
    } catch (error) {
      console.error('Error sending POST request:', error);
    }
  }

  const handleStopBus = async () => {
    try {
      const endpoint = 'bus/stop';
      const params = { token: token };
  
      // Send POST request
      await sendData(endpoint, params);
  
      // Update state or perform other actions after a successful request
      setStopBusClicked(true);
    } catch (error) {
      console.error('Error sending POST request:', error);
    }
  }

  const handleNextStop = async () => {
    try {
      const endpoint = 'bus/next';
      const params = { token: token };
  
      // Send POST request
      await sendData(endpoint, params);
  
      // Update state or perform other actions after a successful request
      setNextStopClicked(true);
    } catch (error) {
      console.error('Error sending POST request:', error);
    }
  }

  if (!current_stop) {
    return (
      <div id="chats-list" className="">
        <div id="chats-headline" className="flex justify-between gap-6">
          <div className="text-3xl font-bold">
            Dashboard
          </div>
          <div className="flex gap-4">
            <Button onClick={() => handleStartBus(100)} disabled={startBusClicked} className="w-56">
              {startBusClicked ? "Starting the bus..." : "Start the bus"}
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
          <Button onClick={() => handleNextStop()} disabled={nextStopClicked} className="w-56">
            {nextStopClicked ? "Moving the bus..." : "Next stop"}
          </Button>
          <Button onClick={() => handleStopBus()} disabled={stopBusClicked} className="w-56">
            {stopBusClicked ? "Stopping the bus..." : "Stop the bus"}
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