"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import React, {useEffect, useState} from 'react';
import {fetchData} from '../../services/apiService';


export default function Metrics({token}: { token: string }) {

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
      const statisticsResponse = await fetchData('statistics', {token: token});
      const statisticsData = await statisticsResponse.json();
      if (!statisticsResponse.ok) {
        console.error("Couldn't fetch statistics:", statisticsData);
        return;
      }
      console.log('Data received:', statisticsData);
      setData(statisticsData['data']);
    };

    loadData();
  }, [token]);

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

  type MetricCardProps = {
    title: string;
    content: number | string;
  };

  const MetricCard: React.FC<MetricCardProps> = ({ title, content }) => (
    <Card className="flex flex-col justify-evenly bg-auspak-light-grey/10 h-28 w-96">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div>{content}</div>
      </CardContent>
    </Card>
  );

  return (
    <div id="dashboard-metrics" className="">
      <div className="text-3xl font-bold mb-2">
        Metrics
      </div>
      <div className="flex flex-col space-y-4 gap-2">
        {/* First row of cards */}
        <div className="flex justify-between">
          <MetricCard title="Parcels Delivered" content={parcels_delivered} />
          <MetricCard title="Parcels Pending" content={parcels_pending} />
          <MetricCard title="Peak Hours" content={peak_hours} />
        </div>

        {/* Second row of cards */}
        <div className="flex justify-between">
          <MetricCard title="Passengers Transported" content={passenger_transported} />
          <MetricCard title="Passengers in Transit" content={passenger_transit} />
          <MetricCard title="Capacity Utilization" content={capacity_utilization} />
        </div>

        {/* Third row of cards */}
        <div className="flex justify-between">
          <MetricCard title="Emissions Produced" content={emissions} />
          <MetricCard title="Customer Retention Rate" content={customer_retention} />
          <MetricCard title="Parcel Damage Rate" content={parcels_damage} />
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