import React from "react";
//import {Sidebar} from "@/components/sidebar/sidebar";
import {fetchData} from "@/app/services/apiService";

export default function ChatInterface({params}: {params: {chatId: string}}) {

  const chatMetaData = fetchData("chats/history/`{")

  return (
    <main>
      <div className="flex">
        {/* <Sidebar/> */}
        <div className="bg-auspak-white h-screen w-screen p-6">
          <div className="text-3xl font-bold">
            Chat {params.chatId}
          </div>

        </div>
      </div>
    </main>
  )
}
