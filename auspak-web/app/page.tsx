import Image from 'next/image'
import {SpeedInsights} from "@vercel/speed-insights/next"
import {Analytics} from '@vercel/analytics/react';
import {Button} from "@/components/ui/button";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {
  return (

    <main
      className="main-gradient flex flex-col justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center h-screen">

        <Card className="w-96">
          <CardHeader>
            <Image
              src="/auspak-name-logo.svg"
              width={125}
              height={125}
              alt="auspak-name-logo"
            />
            <CardDescription>Your Communication assistant</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center gap-2">
            <Button asChild className="w-full">
              <Link href="/auth">Login or Register</Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/chats">Chats</Link>
            </Button>
          </CardContent>
        </Card>

      </div>
    </main>

  )
}
