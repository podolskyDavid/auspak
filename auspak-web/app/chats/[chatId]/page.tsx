"use client"

import React, {useEffect, useState} from "react";
import {fetchData} from "@/app/services/apiService";
import Sidebar from "@/components/sidebar/sidebar";
import {Skeleton} from "@/components/ui/skeleton";
import {Textarea} from "@/components/ui/textarea"
import {Button} from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const FormSchema = z.object({
  bio: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(160, {
      message: "Bio must not be longer than 30 characters.",
    }),
})


interface Chat {
  chat_id: number;
  created_at: string;
  id: number;
  sender_id: number;
  text: string;
}

const tags = Array.from({length: 50}).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

export default function ChatInterface({params}: { params: { chatId: string } }) {

  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [fullName, setFullName] = useState<string>('');
  const [userEntity, setUserEntity] = useState<string>('');
  const [chatHistoryData, setChatHistoryData] = useState<any>(null);


  useEffect(() => {
    const loadData = async (storedToken: string) => {
      try {
        if (storedToken) {
          setIsLoading(true);
          // Fetch data only when token is available
          const meResponse = await fetchData('auth/me', {token: storedToken});
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

      console.log("Chat ID: ", params.chatId, "Token: ", storedToken)
      const response = await fetchData(`chats/history/${params.chatId}`, {token: storedToken});
      const data = await response.json();
      setChatHistoryData(data);
      console.log("Chat meta data:", data);

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

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("Sent message:", data)
  }


  return (
    <main>
      <div className="flex">
        <Sidebar fullName={fullName} userEntity={userEntity.charAt(0).toUpperCase() + userEntity.slice(1)}/>
        <div className="bg-auspak-white h-screen w-screen gap-4 p-6 flex flex-col justify-between">
          <div className="text-3xl font-bold">
            Chat {params.chatId}
          </div>

          <div className="flex-col">

            {isLoading ? (
              <div className="flex flex-col gap-1">
                <Skeleton className="w-[100px] h-[20px] rounded-full bg-auspak-dark-grey"/>
                <Skeleton className="w-[300px] h-[20px] rounded-full bg-auspak-dark-grey"/>
              </div>
            ) : (
              chatHistoryData && chatHistoryData.map((chat: Chat, index: number) => (
                <div key={index}>


                  <p>Chat ID: {chat.chat_id}</p>
                  <p>Created at: {chat.created_at}</p>
                  <p>ID: {chat.id}</p>
                  <p>Sender ID: {chat.sender_id}</p>
                  <p>Text: {chat.text}</p>
                </div>
              ))
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a little bit about yourself"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        You can <span>@mention</span> other users and organizations.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>


          </div>
        </div>
      </div>
    </main>
  )
}
