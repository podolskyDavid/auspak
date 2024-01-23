"use client"

import React, {useEffect, useRef, useState} from "react";
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

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import * as z from "zod"

const FormSchema = z.object({
  chatMessage: z
    .string()
    .min(1, {
      message: "The message must not be empty.",
    })
    .max(300, {
      message: "The message must not be longer than 300 characters.",
    }),
})


interface Chat {
  chat_id: number;
  created_at: string;
  id: number;
  sender_id: number;
  text: string;
}

interface UserChatCellProps {
  chat: Chat;
  myId: number;
}

const UserChatCell: React.FC<UserChatCellProps> = ({chat, myId}) => {
  return (
    <div className={`flex flex-col ${chat.sender_id == myId ? 'ml-auto w-1/2 max-w-80' : 'w-1/2 max-w-80'} gap-1`}>
      <div className={`p-2 rounded-md ${chat.sender_id == myId ? 'bg-auspak-green' : 'bg-auspak-light-grey'} text-md`}>
        {chat.text}
      </div>
      <div className={`text-xs ${chat.sender_id == myId ? 'ml-auto' : ''}`}>
        {new Date(chat.created_at).toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/\//g, '.')}
      </div>
    </div>
  )
}

export default function ChatInterface({params}: { params: { chatId: string } }) {

  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [fullName, setFullName] = useState<string>('');
  const [userEntity, setUserEntity] = useState<string>('');
  const [myId, setMyId] = useState<number>(0);
  const [chatHistoryData, setChatHistoryData] = useState<Chat[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [name, setName] = useState<string>('');

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
          setMyId(meData.id);

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
      console.log("Chat meta data:", data);
      setChatHistoryData(data.data);
      setName(data.name);
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

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (token) { // Only run this effect if the token is not null
      // Replace with your actual server URL and chat ID
      ws.current = new WebSocket(`wss://api-auspak.com/chats/${params.chatId}?token=${encodeURIComponent(token)}`);

      ws.current.onopen = () => {
        console.log('ws opened');
      };

      ws.current.onclose = () => {
        console.log('ws closed');
        // Reopen the WebSocket after a delay
        setTimeout(() => {
          ws.current = new WebSocket(`wss://api-auspak.com/chats/${params.chatId}?token=${encodeURIComponent(token)}`);
        }, 1000); // 1 second delay
      };

      ws.current.onmessage = (e) => {
        // Parse the incoming message
        const message: Chat = JSON.parse(e.data);
        // Update your chat state here
        setChatHistoryData(prevChatHistory => [...prevChatHistory, message]);
      };

      ws.current.onerror = (error) => {
        console.log('WebSocket error: ', error);
      };

      return () => {
        // Close the WebSocket connection when the component unmounts
        ws.current?.close();
      };
    }
  }, [token]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({behavior: "instant"});
    }
  }, [chatHistoryData]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(data.chatMessage);
    }
    console.log("Sent message:", data)
    form.reset({chatMessage: ''});
  }


  return (
    <main>
      <div className="flex">
        <Sidebar fullName={fullName} userEntity={userEntity.charAt(0).toUpperCase() + userEntity.slice(1)}/>
        <div className="bg-auspak-white h-screen w-screen gap-4 p-6 flex flex-col justify-between">
          <div className="text-3xl font-bold">
            Chat with {name}
          </div>

          <div className="flex flex-col gap-4 max-h-full overflow-y-auto">
            <div className="flex flex-col gap-4 max-h-full overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col gap-1">
                  <Skeleton className="w-[100px] h-[20px] rounded-full bg-auspak-dark-grey"/>
                  <Skeleton className="w-[300px] h-[20px] rounded-full bg-auspak-dark-grey"/>
                </div>
              ) : (
                chatHistoryData.map((chat, index) => (
                  <UserChatCell key={index} chat={chat} myId={myId}/>
                ))
              )}
              <div ref={messagesEndRef}/>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <FormField
                  control={form.control}
                  name="chatMessage"
                  render={({field}) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Type your message here..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage/>
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
