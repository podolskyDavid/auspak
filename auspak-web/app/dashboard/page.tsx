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

import { GoogleMap, LoadScript } from '@react-google-maps/api';
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
        <div className="flex flex-col justify-between bg-auspak-green h-screen w-1/4 p-6">
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
          <div className="">
            <div className="text-3xl font-bold">
              John Doe
            </div>
            <div>
              Regional Logistic Strategist
            </div>
          </div>
          <div>
            3
          </div>
        </div>

        <div className="bg-auspak-white h-screen w-3/4 p-6">
          <div id="dashboard-metrics" className="">
            <div className="text-3xl font-bold">
              Metrics
            </div>
            <div className="flex justify-between space-x-6 mt-4 mb-8">
              <Card className="w-[350px]">
                <CardHeader>
                  <CardTitle>Saved Distance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>1</div>
                </CardContent>
              </Card>

              <Card className="w-[350px]">
                <CardHeader>
                  <CardTitle>Vehicle Utilization Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>2</div>
                </CardContent>
              </Card>

              <Card className="w-[350px]">
                <CardHeader>
                  <CardTitle>Average Delivery Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>3</div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div id="dashboard-map">
            <div className="flex flex-col">
              <div className="text-3xl font-bold">
                Interactive Map
              </div>
              <div>
                City-Label
              </div>
              <div>

              </div>
            </div>
            <div>

            </div>
          </div>
        </div>

      </div>
    </main>
  )
}