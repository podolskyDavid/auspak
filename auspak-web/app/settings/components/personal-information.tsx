"use client"

import { fetchData, sendData, updateData } from "@/app/services/apiService"
import { error } from "console";
import { useEffect, useState } from "react";

export default function PersonalInformation({ token }: { token: string }) {
  const [data, setData] = useState<Record<string, any>>({});
  const [private_data, setPrivateData] = useState<Record<string, any>>({});


  useEffect(() => {
    fetchData('auth/settings', { token: token })
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => {
        console.error('Error fetching data', err);
      });
  }, [token]);

  useEffect(() => {
    fetchData('auth/me', { token: token })
      .then(res => res.json())
      .then(json => setPrivateData(json))
      .catch(err => {
        console.error('Error fetching data', err);
      });
  }, [token]);




  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formProps = Object.fromEntries(formData);

    if (formProps.old_password !== private_data.password) {
      alert('Passwords do not match');
      return;
    }
    else {
      console.log('Password match');
      try{
        const response = await updateData('auth/change_password', { token, password: formProps.new_password });
        if (!response.ok) {
          throw new Error('Failed to update profile');
        }
        const result = await response.json();
        console.log('Profile updated successfully:', result);
      }
      catch(error){
        console.error('Error updating profile:', error);
      }
    }

    try {
      const response = await updateData('auth/settings', { token }, formProps);
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      const result = await response.json();
      console.log('Profile updated successfully:', result);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

return(
  <form className="space-y-6" onSubmit={handleSubmit}>
    <div className="flex justify-between items-center py-5">
      <div className="text-2xl font-bold text-gray-900">Personal Information</div>
    </div>
    <div className="flex justify-between space-x-3">
      <div className="flex-1">
        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
          First name
        </label>
        <div className="mt-1">
          <input
            id="first_name"
            name="first_name"
            type="text"
            autoComplete="given-name"
            defaultValue={data?.first_name || ''}
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-auspak-green focus:border-auspak-green sm:text-sm" />
        </div>
      </div>
      <div className="flex-1">
        <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
          Last name
        </label>
        <div className="mt-1">
          <input
            id="lastname"
            name="lastname"
            type="text"
            autoComplete="family-name"
            defaultValue={data?.last_name || ''}
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-auspak-green focus:border-auspak-green sm:text-sm" />
        </div>
      </div>
    </div>
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
        Email address
      </label>
      <div className="mt-1">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={data?.email || ''}
          required
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-auspak-green focus:border-auspak-green sm:text-sm" />
      </div>
    </div>

    <div>
      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
        Address
      </label>
      <div className="mt-1">
        <input
          id="address"
          name="address"
          type="text"
          autoComplete="address"
          defaultValue={data?.address || ''}
          required
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-auspak-green focus:border-auspak-green sm:text-sm" />
      </div>
    </div>
    <div>
      <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
        Phone number
      </label>
      <div className="mt-1">
        <input
          id="phone_number"
          name="phone_number"
          type="tel"
          autoComplete="tel"
          defaultValue={data?.phone_number || ''}
          required
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-auspak-green focus:border-auspak-green sm:text-sm" />
      </div>
    </div>
    <div className="flex justify-between items-center py-5">
      <div className="text-2xl font-bold text-gray-900">Change Password</div>
    </div>
    <div>
      <label htmlFor="old_password" className="block text-sm font-medium text-gray-700">
        Old password
      </label>
      <div className="mt-1">
        <input
          id="old_password"
          name="old_password"
          type="password"
          autoComplete="current-password"
          
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-auspak-green focus:border-auspak-green sm:text-sm" />
      </div>
    </div>
    <div>
      <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
        New password
      </label>
      <div className="mt-1">
        <input
          id="new_password"
          name="new_password"
          type="password"
          autoComplete="new-password"
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-auspak-green focus:border-auspak-green sm:text-sm" />
      </div>
    </div>
    <div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-auspak-dark-grey hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-auspak-green"
      >
        Save Settings
      </button>
    </div>
  </form>

)
}