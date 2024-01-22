"use client"

import Sidebar from "@/components/sidebar/sidebar";
import Metrics from "@/app/dashboard/components/metrics";
import ChatsList from "@/app/chats/components/chats-list";
import { fetchData } from '../services/apiService';
import React, { useEffect, useState } from 'react';
import EmptySidebar from "@/components/sidebar/empty-sidebar";

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
    return (<EmptySidebar />)
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