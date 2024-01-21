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

import Link from "next/link";
import Metrics from "@/app/dashboard/components/metrics";
import InteractiveMap from "@/app/dashboard/components/interactive-map";
import Sidebar from "@/components/sidebard/sidebard";
import BusDriverDashboard from "@/app/dashboard/components/bus-driver-component";

export default function Dashboard() {
  return (
    <main>
      <div className="flex">
        <Sidebar/>
        <div className="flex flex-col bg-auspak-white h-screen w-screen p-6 gap-6">
          <Metrics/>
          <BusDriverDashboard/>
          <InteractiveMap/>
        </div>
      </div>
    </main>
  )
}