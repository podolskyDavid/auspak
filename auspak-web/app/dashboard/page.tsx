import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {GoogleMap, LoadScript} from '@react-google-maps/api';
import Link from "next/link";
import Metrics from "@/app/dashboard/components/metrics";
import InteractiveMap from "@/app/dashboard/components/interactive-map";

const googleMapsApiKey = process.env.PUBLIC_GOOGLE_MAPS_API_KEY;


const mapStyles = {
  height: "50vh",
  width: "100%"
};

const defaultCenter = {
  lat: 41.3851, lng: 2.1734
}


export default function Dashboard() {
  return (
    <main>
      <div className="flex">
        <div className="flex flex-col bg-auspak-green h-screen w-1/4 p-6">
          <div id="logo-top" className="flex">
            <Image
              src="/auspak-name-logo.svg"
              width={125}
              height={125}
              alt="auspak-name-logo"
            />
            <Badge className="ml-2 mt-1.5 mb-1.5 bg-auspak-white text-auspak-dark-grey">
              beta
            </Badge>
          </div>
          <div id="functionality-list" className="mt-[16.66vh]">

            <div className="pb-6">
              <div className="text-3xl font-bold">
                John Doe
              </div>
              <div>
                Regional Logistic Strategist
              </div>
            </div>
            <div className="">
              <Link
                href=""
                className="hover:underline"
              >
                button 1
              </Link>
              <br/>
              <Link
                href=""
                className="hover:underline"
              >
                button 1
              </Link>
              <br/>
              <Link
                href=""
                className="hover:underline"
              >
                button 1
              </Link>

            </div>

          </div>
          <div id="bottom-functionality" className="absolute bottom-6">
            3
          </div>
        </div>
        <div className="bg-auspak-white h-screen w-3/4 p-6">
          <Metrics/>
          <InteractiveMap/>
        </div>
      </div>
    </main>
  )
}