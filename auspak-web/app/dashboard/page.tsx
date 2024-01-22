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
import InteractiveMapOperator from "@/app/dashboard/components/interactive-map-operator";
import InteractiveMapDriver from "@/app/dashboard/components/interactive-map-driver";
import InteractiveMapPassenger from "@/app/dashboard/components/interactive-map-passenger";
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
          <InteractiveMapDriver/>
        </div>
      </div>
    </main>
  )
}