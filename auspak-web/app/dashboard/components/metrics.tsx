"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export default function Metrics() {
  return (
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
  )
}