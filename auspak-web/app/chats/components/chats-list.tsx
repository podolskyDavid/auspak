"use client"

import React, {useEffect, useState} from 'react';

import {Button} from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {Separator} from "@/components/ui/separator";
import {List} from "postcss/lib/list";
import fetchData from "@/app/services/apiService";

interface ChatData {
  id: number;
  name: string;
  last_message: string;
  user_type: string;
  time: string;
}

interface ChatTableCellProps {
  chat: ChatData;
}

const ChatTableCell: React.FC<ChatTableCellProps> = ({chat}) => {
  return (
    <div className="flex flex-col gap-2 mb-2">
      <Separator className="bg-auspak-dark-grey"/>
      <div className="flex flex-col">
        <div className="flex justify-between gap-4">
          <div className="text-xl font-bold">
            {chat.name}
          </div>
          <div className="flex gap-8">
            <div className="font-light">
              {chat.user_type}
            </div>
            <div className="font-light mr-2">
              {chat.time}
            </div>
          </div>
        </div>
        <div className="font-light">
          {chat.last_message}
        </div>
      </div>
    </div>
  )
}

export default function ChatsList() {

  const [data, setData] = useState<Array<ChatData> | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchData('chats/?token=driver_0');
        console.log('Data received:', fetchedData);
        setData(fetchedData);
      } catch (error) {
        console.error('Fetching data error:', error);
      }
    };

    loadData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  const chats = data || []

  return (
    <div id="chats-list" className="">
      <div id="chats-headline" className="flex justify-between gap-6">
        <div className="text-3xl font-bold">
          Chats
        </div>
        <div className="">
          <Button className="w-56">
            Create new chat
          </Button>
        </div>
      </div>

      <div id="chats-table" className="mt-6">
        {chats.map((chat) => (
          <ChatTableCell key={chat.id} chat={chat}/>
        ))}

      </div>
    </div>
  )
}