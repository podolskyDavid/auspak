import Sidebar from "@/components/sidebard/sidebard";
import Metrics from "@/app/dashboard/components/metrics";
import InteractiveMap from "@/app/dashboard/components/interactive-map";
import ChatsList from "@/app/chats/components/chats-list";

export default function Chats() {
  return (
    <main>
      <div className="flex">
        <Sidebar/>
        <div className="bg-auspak-white h-screen w-screen p-6">
          <ChatsList/>

        </div>
      </div>
    </main>
  )
}