"use client"

import {Button} from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { fetchData, sendData } from '../../services/apiService';
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";
import { set } from "zod";
import { useBusContext } from "./bus-context";


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

const formSchema = z.object({
  busLine: z.number({
    required_error: "Please select a bus line.",
  }),
})

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

  const busContext = useBusContext();
  const [startBusClicked, setStartBusClicked] = [busContext.startBusClicked, busContext.setStartBusClicked];
  const [stopBusClicked, setStopBusClicked] = [busContext.stopBusClicked, busContext.setStopBusClicked];
  const [nextStopClicked, setNextStopClicked] = [busContext.nextStopClicked, busContext.setNextStopClicked];

  const [busLines, setBusLines] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setStartBusClicked(true);

    const endpoint = 'bus/start';
    const params = { token: token, bus_id: values.busLine };

    // Send POST request
    const initialStopsResponse = await sendData(endpoint, params);
    const initialStopsData = await initialStopsResponse.json();

    if (!initialStopsResponse.ok) {
      console.error("Couldn't fetch list of stops:", initialStopsData);
      return;
    }
    console.log('Data received:', initialStopsData);
    setData(initialStopsData);
    setStartBusClicked(false);


  }

  useEffect(() => {
    const loadData = async () => {
      const busLinesResponse = await fetchData('bus/lines', { token: token });
      const busLinesData = await busLinesResponse.json();
      if (!busLinesResponse.ok) {
        console.error("Couldn't fetch list of bus lines:", busLinesData);
        return;
      }
      console.log('Data received:', busLinesData);
      if (Array.isArray(busLinesData.lines)) {
        setBusLines(busLinesData.lines);
      } else {
        console.error("Received data is not an array:", busLinesData);
      }
    };

    loadData();
  }, [token]);

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
  }, [token, startBusClicked, stopBusClicked, nextStopClicked]);

  if (!data) {
    return;
  }

  const current_stop = data.current_stop;
  const next_stops = data.next_stops;

  const handleStartBus = async (bus_id: number) => {
    setStartBusClicked(true);
    try {
      const endpoint = 'bus/start';
      const params = { token: token, bus_id: bus_id };

      // Send POST request
      await sendData(endpoint, params);

      // Update state or perform other actions after a successful request
      setStartBusClicked(false);

    } catch (error) {
      console.error('Error sending POST request:', error);
    }
  }

  const handleStopBus = async () => {
    setStopBusClicked(true);
    try {
      const endpoint = 'bus/stop';
      const params = { token: token };
  
      // Send POST request
      await sendData(endpoint, params);
  
      // Update state or perform other actions after a successful request
      setStopBusClicked(false);

      //window.location.reload();
    } catch (error) {
      console.error('Error sending POST request:', error);
    }
  }

  const handleNextStop = async () => {
    setNextStopClicked(true);
    try {
      const endpoint = 'bus/next';
      const params = { token: token };
  
      // Send POST request
      await sendData(endpoint, params);
  
      // Update state or perform other actions after a successful request
      setNextStopClicked(false);

      //window.location.reload();
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

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex gap-4">

                <FormField
                  control={form.control}
                  name="busLine"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-56">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? busLines.find(
                                  (busLine) => busLine === field.value
                                )?.toString()
                                : "Select a line"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Command>
                            <CommandInput placeholder="Search a line..." />
                            <CommandEmpty>No bus line found.</CommandEmpty>
                            <CommandGroup>
                              {busLines.map((busLine) => (
                                <CommandItem
                                  value={busLine}
                                  key={busLine}
                                  onSelect={() => {
                                    form.setValue("busLine", busLine)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      busLine === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {busLine}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/*{registrationMessage && <div style={{ color: 'red' }}>{registrationMessage}</div>}*/}
                <Button className="w-56">
                  {startBusClicked ? "Starting the bus..." : "Start the bus"}
                </Button>
              </div>
            </form>
          </Form>

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
          <Button onClick={() => handleNextStop()} className="w-56" disabled={nextStopClicked}>
            {nextStopClicked ? "Moving the bus...":"Next stop"}
          </Button>
          <Button onClick={() => handleStopBus()} className="w-56" disabled={stopBusClicked}>
            {stopBusClicked ? "Stopping the bus...":"Stop the bus"}
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