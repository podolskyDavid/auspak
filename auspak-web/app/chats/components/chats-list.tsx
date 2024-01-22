"use client"

import React, {useEffect, useState} from 'react';

import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Skeleton} from "@/components/ui/skeleton"
import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"

import {Check, ChevronsUpDown} from "lucide-react"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import {fetchData} from "@/app/services/apiService";
import Link from "next/link";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";
import {cn} from "@/lib/utils";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

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
          <div className="text-xl font-bold hover:underline">
            {chat.name}
          </div>
          <div className="flex gap-8 right-0">
            <div className="font-light">
              {chat.user_type}
            </div>
            {chat.time ?
              <div className="font-light mr-2">
                {chat.time}
              </div> : null
            }
          </div>
        </div>
        <div className="font-light">
          {chat.last_message}
        </div>
      </div>
    </div>
  )
}

interface UserData {
  first_name: string;
  last_name: string;
  entity: string;
}

interface SearchUserCellProps {
  user: UserData;
}

const SearchUserCell: React.FC<SearchUserCellProps> = ({user}) => {
  return (
    <div>
      <Separator/>
      <Link href="/">
        <div className="flex justify-between py-2">
          <div className="font-bold text-xl hover:underline">
            {user.first_name} {user.last_name}
          </div>

          <div className="font-light">
            {user.entity}
          </div>
        </div>
      </Link>
    </div>
  )
}

const roles = [
  {
    value: "driver",
    label: "Driver",
  },
  {
    value: "manager",
    label: "Manager",
  },
  {
    value: "passenger",
    label: "Passenger",
  },
]

export default function ChatsList({ token }: { token: string }) {

  const [chatData, setChatData] = useState<Array<ChatData> | null>(null);
  const [usersData, setUsersData] = useState<Array<UserData> | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const chatsResponse = await fetchData('chats', { token: token });
      const chatsData = await chatsResponse.json();
      if (!chatsResponse.ok) {
        console.error("Couldn't fetch list of chats:", chatsData);
        return;
      }
      console.log('Chats data received:', chatsData);
      setChatData(chatsData);
    };

    loadData();
  }, [token]);

  useEffect(() => {
    const loadData = async () => {
      const usersResponse = await fetchData('bus/users', { token: token });
      const usersData = await usersResponse.json();
      if (!usersResponse.ok) {
        console.error("Couldn't fetch list of users:", usersData);
        return;
      }
      console.log('Users data received:', usersData.users);
      setUsersData(usersData.users);
      setFilteredUsers(usersData.users)
    };

    loadData();
  }, [token]);

  const chats = chatData || []
  const users = usersData || []

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const [filteredUsers, setFilteredUsers] = useState<Array<UserData> | null>();

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const searchText = event.target.value.toLowerCase();
    const filtered = usersData?.filter(user =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchText)
    );
    // @ts-ignore
    setFilteredUsers(filtered);
  }

  return (
    <div id="chats-list" className="">
      <div id="chats-headline" className="flex justify-between gap-6">
        <div className="text-3xl font-bold">
          Chats
        </div>
        <div className="">
          <Sheet>
            <SheetTrigger asChild>
              <Button>Create new chat</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Create new chat</SheetTitle>
                <SheetDescription>
                  Text the other side
                </SheetDescription>
              </SheetHeader>

              <div className="flex gap-2 py-2">
                <Input onChange={handleInputChange}/>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[150px] justify-between"
                    >
                      {value
                        ? roles.find((role) => role.value === value)?.label
                        : "Select role..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search role..."/>
                      <CommandEmpty>No role found.</CommandEmpty>
                      <CommandGroup>
                        {roles.map((role) => (
                          <CommandItem
                            key={role.value}
                            value={role.value}
                            onSelect={(currentValue) => {
                              setValue(currentValue === value ? "" : currentValue)
                              setOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                value === role.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {role.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-2 py-4">
                {filteredUsers ? (
                  filteredUsers.map((user) => (
                    <SearchUserCell key={user.first_name} user={user}/>
                  ))
                ) : (
                  <div className="flex flex-col gap-1">
                    <Skeleton className="w-[70px] h-[20px] rounded-full bg-auspak-dark-grey"/>
                    <Skeleton className="w-[155px] h-[20px] rounded-full bg-auspak-dark-grey"/>
                  </div>
                )
                }
              </div>
              <SheetFooter>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div id="chats-table" className="mt-6">
        {chatData ? (
          chats.map((chat) => (
            <Link href={`/chats/${chat.id}`}>
              <ChatTableCell key={chat.id} chat={chat}/>
            </Link>
          ))
        ) : (
          <div className="flex flex-col gap-1">
            <Skeleton className="w-[100px] h-[20px] rounded-full bg-auspak-dark-grey"/>
            <Skeleton className="w-[300px] h-[20px] rounded-full bg-auspak-dark-grey"/>
          </div>
        )}
      </div>
    </div>
  )
}