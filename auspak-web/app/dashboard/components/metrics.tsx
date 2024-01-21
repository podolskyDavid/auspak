"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import React, { useEffect, useState } from 'react';
import {fetchData} from '../../services/apiService';


export default function Metrics() {

  interface MetricsData {
    parcels_delivered?: number;
    parcels_pending?: number;
    peak_hours?: number;
    passenger_transported?: number;
    passenger_transit?: number;
    capacity_utilization?: number;
    emissions?: number;
    customer_retention?: number;
    parcels_damage?: number;
  }

  const [data, setData] = useState<MetricsData | null>(null);  

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchData('statistics/?token=operator_0');
        console.log('Data received:', fetchedData);
        setData(fetchedData['data']);
      } catch (error) {
        console.error('Fetching data error:', error);
      }
    };

    loadData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }
  
  const parcels_delivered = data.parcels_delivered || 0;
  const parcels_pending = data.parcels_pending || 0;
  const peak_hours = data.peak_hours || 0;
  const passenger_transported = data.passenger_transported || 0;
  const passenger_transit = data.passenger_transit || 0;
  const capacity_utilization = data.capacity_utilization || 0;
  const emissions = data.emissions || 0;
  const customer_retention = data.customer_retention || 0;
  const parcels_damage = data.parcels_damage || 0;
  
  
  return (
    <div id="dashboard-metrics" className="">
      <div className="text-3xl font-bold">
        Metrics
      </div>
      <div className="mt-4 mb-8">
        {/* First row of cards */}
        <div className="flex justify-between space-x-6 mb-8 flex-wrap">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Parcels Delivered</CardTitle>
            </CardHeader>
            <CardContent>
              <div>{parcels_delivered}</div>
            </CardContent>
          </Card>
  
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Parcels Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div>{parcels_pending}</div>
            </CardContent>
          </Card>
  
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Peak Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div>{peak_hours}</div>
            </CardContent>
          </Card>
        </div>
  
        {/* Second row of cards */}
        <div className="flex justify-between space-x-6 mb-8 flex-wrap">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Passengers Transported</CardTitle>
            </CardHeader>
            <CardContent>
              <div>{passenger_transported}</div>
            </CardContent>
          </Card>
  
          <Card className="w-[350px]">
            <CardHeader>  
              <CardTitle>Passengers in Transit</CardTitle>
            </CardHeader>
            <CardContent>
              <div>{passenger_transit}</div>
            </CardContent>
          </Card>
  
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Capacity Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div>{capacity_utilization}</div>
            </CardContent>
          </Card>
        </div>

                {/* Third row of cards */}
                <div className="flex justify-between space-x-6 mb-8 flex-wrap">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Emissions Produced</CardTitle>
            </CardHeader>
            <CardContent>
              <div>{emissions}</div>
            </CardContent>
          </Card>
  
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Customer Retention Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div>{customer_retention}</div>
            </CardContent>
          </Card>
  
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Parcel Damage Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div>{parcels_damage}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );



}


// function SomeComponent() {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     // Replace 'some-endpoint' with your actual endpoint
//     fetchData('some-endpoint')
//       .then(data => setData(data))
//       .catch(error => console.error('Fetching data error:', error));
//   }, []);

//   if (!data) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h1>Data from FastAPI</h1>
//       <pre>{}</pre>
//     </div>
//   );
// }

//export default SomeComponent;