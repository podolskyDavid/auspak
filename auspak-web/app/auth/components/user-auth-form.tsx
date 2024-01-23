"use client"

import * as React from "react"
import * as z from "zod"

import {cn} from "@/lib/utils"
import {Icons} from "@/components/icons"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"

import { Check, ChevronsUpDown } from "lucide-react"

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { useState } from "react";
import { sendData } from '../../services/apiService';

const roles = [
  { label: "Passenger", value: "passenger" },
  { label: "Driver", value: "driver" },
  { label: "Manager", value: "manager" },
] as const

const formSchema = z.object({
  firstName: z.string().min(1, "Name can't be empty").max(50, "Please don't exceed 50 characters"),
  lastName: z.string().min(1, "Name can't be empty").max(50, "Please don't exceed 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Please enter a password that is at least 8 characters long"),
  role: z.string({
    required_error: "Please select a role.",
  }),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RegistrationForm({className, ...props}: UserAuthFormProps) {

  const [registrationMessage, setRegistrationMessage] = useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false)


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Registration request
    setIsLoading(true)
    const registerResponse = await sendData('bus/lines', null, {
        id: 0,
        password: values.password,
        entity: values.role,
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email
      }
    );

    setRegistrationMessage("Registration successful")
    console.log(registerResponse);

    if (!registerResponse.ok) {
      const errorData = await registerResponse.json();
      setRegistrationMessage(errorData.detail);
      console.error('Registration failed');
      setIsLoading(false)
      return;
    }

    // Login request
    const loginResponse = await sendData('auth/login', { email: values.email, password: values.password });

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      setRegistrationMessage(errorData.detail);
      console.error('Login failed');
      setIsLoading(false)
      return;
    }

    const loginData = await loginResponse.json();

    // Save access token in session
    sessionStorage.setItem('access_token', loginData.access_token);

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    // Redirect to dashboard
    window.location.href = '/dashboard';
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-2">

              <FormField
                control={form.control}
                name="firstName"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

            </div>

            <FormField
              control={form.control}
              name="email"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      disabled={isLoading}
                      placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? roles.find(
                              (role) => role.value === field.value
                            )?.label
                            : "Select a role"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search role..." />
                        <CommandEmpty>No role found.</CommandEmpty>
                        <CommandGroup>
                          {roles.map((role) => (
                            <CommandItem
                              value={role.label}
                              key={role.value}
                              onSelect={() => {
                                form.setValue("role", role.value)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  role.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {role.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            {registrationMessage && <div style={{ color: 'red' }}>{registrationMessage}</div>}
            <Button>
              Register
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export function LoginForm({className, ...props}: UserAuthFormProps) {
  const [loginMessage, setLoginMessage] = useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const formSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Please enter a password that is at least 8 characters long"),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    const loginResponse = await sendData('auth/login', { email: values.email, password: values.password } );

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      setLoginMessage(errorData.detail);
      console.error('Login failed');
      setIsLoading(false)
      return;
    }

    const loginData = await loginResponse.json();

    sessionStorage.setItem('access_token', loginData.access_token);

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    window.location.href = '/dashboard';
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      disabled={isLoading}
                      placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            {loginMessage && <div style={{ color: 'red' }}>{loginMessage}</div>}
            <Button>
              Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}