"use client"

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
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
import Sidebar from "@/components/sidebar/sidebar";
import BusDriverDashboard from "@/app/dashboard/components/bus-driver-component";
import { fetchData } from '../services/apiService';
import React, { useEffect, useState } from 'react';
import EmptySidebar from "@/components/sidebar/empty-sidebar";
import { BusProvider } from "./components/bus-context";


export default function Dashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [fullName, setFullName] = useState<string>('');
  const [userEntity, setUserEntity] = useState<string>('');
  
  useEffect(() => {
    const loadData = async (storedToken: string) => {
      try {
        if (storedToken) {
          setIsLoading(true);
          // Fetch data only when token is available
          const meResponse = await fetchData('auth/me', { token: storedToken });
          const meData = await meResponse.json();
  
          if (!meResponse.ok) {
            console.error("Couldn't fetch personal data:", meData);
            return;
          }
          if (!meData) {
            // Redirect logic if data is not available
            if (typeof window !== 'undefined') {
              window.location.href = '/auth';
            }
            return;
          }
  
          // Set full name and entity based on fetched data
          setFullName(`${meData.first_name} ${meData.last_name}`);
          setUserEntity(`${meData.entity}`);
  
          console.log('Data received:', meData);
        }
      } catch (error) {
        console.error('Error fetching or processing data:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    // Check if running in the browser environment
    if (typeof window !== 'undefined') {
      const storedToken = sessionStorage.getItem('access_token');
      if (!token && storedToken) {
        setToken(storedToken);
        console.log('Token:', storedToken);
        loadData(storedToken);
      } else if (!storedToken) {
        // Redirect logic if token is not set
        window.location.href = '/auth';
      }
    }
  }, [token]);

  // // Render content conditionally based on loading state
  if (isLoading) {
    return (<EmptySidebar />)
  }

  return (
    <main>
      <div className="flex">
        <Sidebar fullName={fullName} userEntity={userEntity.charAt(0).toUpperCase() + userEntity.slice(1)}/>
        <div className="flex flex-col bg-auspak-white h-screen w-screen p-6 gap-6">
          {userEntity === 'manager' ? (
            <>
              <Metrics token={token!}/>
              <InteractiveMapOperator token={token!} />
            </>
          ) : userEntity === 'driver' ? (
            <BusProvider>
              <BusDriverDashboard token={token!}/>
              <InteractiveMapDriver token={token!}/>
            </BusProvider>
            
          ) : (
            <>
              {/* <BusDriverDashboard token={token!}/> */}
              <InteractiveMapPassenger token={token!}/>
            </>
          )}
        </div>
      </div>
    </main>
  )
}