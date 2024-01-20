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
import Sidebar from "@/components/sidebard/sidebard";

export default function Dashboard() {
  return (
    <main>
      <div className="flex">
        <Sidebar/>
        <div className="bg-auspak-white h-screen w-screen p-6">
          <Metrics/>
          <InteractiveMap/>
        </div>
      </div>
    </main>
  )
}