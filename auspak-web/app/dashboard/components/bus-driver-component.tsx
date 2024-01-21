import {Button} from "@/components/ui/button";
import React from "react";

export default function BusDriverDashboard() {
  return (
    <div id="chats-list" className="">
      <div id="chats-headline" className="flex justify-between gap-6">
        <div className="text-3xl font-bold">
          Dashboard
        </div>
        <div className="flex gap-4">
          <Button className="w-56">
            Next Stop
          </Button>
          <Button variant="destructive" className="w-56">
            Stop the bus
          </Button>
        </div>
      </div>

      <div className="flex">

        <div className="flex flex-col mt-4 mb-4 gap-4 min-w-96">
          <div className="text-2xl font-bold mr-48">
            Current Stop
          </div>
          <div>
            <div className="text-2xl">
              Echaring West
            </div>
            <div className="font-light">
              Picking up passengers
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-4 mb-4 gap-4 w-full">
          <div className="text-2xl font-bold mr-48">
            Next Stops
          </div>

          <div className="flex justify-between">
            <div>
              <div className="text-2xl">
                Echaring West
              </div>
              <div className="font-light">
                Picking up passengers
              </div>
            </div>
            <div>
              <div className="text-2xl">
                Echaring West
              </div>
              <div className="font-light">
                Picking up passengers
              </div>
            </div>
            <div>
              <div className="text-2xl">
                Echaring West
              </div>
              <div className="font-light">
                Picking up passengers
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}