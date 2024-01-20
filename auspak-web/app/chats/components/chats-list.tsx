import React from 'react';

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

interface ChatData {
  id: number;
  name: string;
  lastMessage: string;
  location_name: string;
  user_type: string;
  time: string;
}

const chats = [
  {
    id: 1,
    name: "John Doe",
    lastMessage: "Hello",
    location_name: "Berg am Laim",
    user_type: "Driver",
    time: "13:20",
  },
  {
    id: 2,
    name: "Amelia Smith",
    lastMessage: "When will you arrive?",
    location_name: "München Ostbahnhof",
    user_type: "Passenger",
    time: "12:45",
  },
  {
    id: 3,
    name: "John Doe",
    lastMessage: "Hello",
    location_name: "Berg am Laim",
    user_type: "Driver",
    time: "13:20",
  },
  {
    id: 4,
    name: "Amelia Smith",
    lastMessage: "When will you arrive?",
    location_name: "München Ostbahnhof",
    user_type: "Passenger",
    time: "12:45",
  },
  {
    id: 5,
    name: "John Doe",
    lastMessage: "Hello",
    location_name: "Berg am Laim",
    user_type: "Driver",
    time: "13:20",
  },
  {
    id: 6,
    name: "Amelia Smith",
    lastMessage: "When will you arrive?",
    location_name: "München Ostbahnhof",
    user_type: "Passenger",
    time: "12:45",
  },
  {
    id: 7,
    name: "John Doe",
    lastMessage: "Hello",
    location_name: "Berg am Laim",
    user_type: "Driver",
    time: "13:20",
  },
]

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
          {chat.lastMessage}
        </div>
      </div>
    </div>
  )
}

export default function ChatsList() {
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