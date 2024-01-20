"use client"

import * as React from "react"

import {cn} from "@/lib/utils"
import {Icons} from "@/components/icons"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
}

export function UserAuthForm({className, ...props}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="sr-only" htmlFor="first-name">
                First name
              </Label>
              <Input
                id="first-name"
                placeholder="First name"
                type="text"
                autoCapitalize="none"
                autoComplete="given-name"
                autoCorrect="off"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label className="sr-only" htmlFor="last-name">
                Last name
              </Label>
              <Input
                id="last-name"
                placeholder="Last name"
                type="text"
                autoCapitalize="none"
                autoComplete="family-name"
                autoCorrect="off"
                disabled={isLoading}
              />
            </div>
          </div>

          <Label className="sr-only" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
          />

          <Label className="sr-only" htmlFor="password">
            Password
          </Label>
          <Input
            id="password"
            placeholder="Password"
            type="password"
            autoComplete="current-password"
            disabled={isLoading}
          />



          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
            )}
            Register
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"/>
        </div>
      </div>
    </div>
  )
}