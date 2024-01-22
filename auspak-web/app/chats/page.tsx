"use client"

import Sidebar from "@/components/sidebard/sidebard";
import Metrics from "@/app/dashboard/components/metrics";
import InteractiveMap from "@/app/dashboard/components/interactive-map";
import ChatsList from "@/app/chats/components/chats-list";
import BusDriverDashboard from "@/app/dashboard/components/bus-driver-component";
import { fetchData } from '../services/apiService';
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";

export default function Chats() {
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
    return (
      <div className="flex flex-col bg-auspak-green h-screen w-1/4 max-w-80 min-w-64 p-6 justify-between">
      <div>
        <div id="logo-top" className="flex">
          <Link href="/">
              <Image
                src="/auspak-name-logo.svg"
                width={125}
                height={125}
                alt="auspak-name-logo"
              />
          </Link>
          <Badge className="ml-2 mt-1.5 mb-1.5 bg-auspak-white text-auspak-dark-grey">
            beta
          </Badge>
        </div>
      </div>
    </div>
    )
  }

  return (
    <main>
      <div className="flex">
        <Sidebar fullName={fullName} userEntity={userEntity.charAt(0).toUpperCase() + userEntity.slice(1)}/>
        <div className="bg-auspak-white h-screen w-screen p-6">
          <ChatsList token={token!}/>
        </div>
      </div>
    </main>
  )
}