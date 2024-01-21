import Link from 'next/link'
import {Button} from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-auspak-white gap-2">
      <div className="text-3xl font-bold">Not Found</div>
      <div className="text-lg font-bold">Could not find the page :/</div>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}