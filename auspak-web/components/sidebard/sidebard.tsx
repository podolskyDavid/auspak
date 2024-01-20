import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function Sidebar() {
  return (
    <div className="flex flex-col bg-auspak-green h-screen w-1/4 max-w-80 min-w-64 p-6">
      <div id="logo-top" className="flex">
        <Image
          src="/auspak-name-logo.svg"
          width={125}
          height={125}
          alt="auspak-name-logo"
        />
        <Badge className="ml-2 mt-1.5 mb-1.5 bg-auspak-white text-auspak-dark-grey">
          beta
        </Badge>
      </div>
      <div id="functionality-list" className="mt-[16.66vh]">

        <div className="pb-6">
          <div className="text-3xl font-bold">
            John Doe
          </div>
          <div>
            Regional Logistic Strategist
          </div>
        </div>
        <div className="">
          <Link
            href=""
            className="hover:underline"
          >
            button 1
          </Link>
          <br/>
          <Link
            href=""
            className="hover:underline"
          >
            button 1
          </Link>
          <br/>
          <Link
            href=""
            className="hover:underline"
          >
            button 1
          </Link>

        </div>

      </div>
      <div id="bottom-functionality" className="absolute flex justify-center bottom-6">
        <Button className="w-full">
          Hi
        </Button>
      </div>
    </div>
  )
}