import React from "react";
import Sidebar from "@/components/sidebard/sidebard";
import {fetchData} from "@/app/services/apiService";

export default function ChatInterface({params}: {params: {chatId: string}}) {

  const chatMetaData = await fetchData("chats/history/`{")

  return (
    <main>
      <div className="flex">
        <Sidebar/>
        <div className="bg-auspak-white h-screen w-screen p-6">
          <div className="text-3xl font-bold">
            Chat {params.chatId}
          </div>

        </div>
      </div>
    </main>
  )
}
