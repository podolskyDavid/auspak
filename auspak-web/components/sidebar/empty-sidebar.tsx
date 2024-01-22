"use client"

import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";

export default function EmptySidebar() {
  return (
    <div className="flex flex-col bg-auspak-green h-screen w-1/4 max-w-80 min-w-64 p-6 justify-between">
      <div>
        <div id="logo-top" className="flex">
          <Link href="/">
              <Image
                src="/auspak-name-logo.svg"
                width={125}
                height={125}
                alt="auspak-name-logo"
              />
          </Link>
          <Badge className="ml-2 mt-1.5 mb-1.5 bg-auspak-white text-auspak-dark-grey">
            beta
          </Badge>
        </div>
      </div>
    </div>
  )
}