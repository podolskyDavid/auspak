"use client"

import {useState} from "react"
import {Metadata} from "next"
import Image from "next/image"
import Link from "next/link"

import {cn} from "@/lib/utils"
import {Button, buttonVariants} from "@/components/ui/button"
import {LoginForm, RegistrationForm} from "@/app/auth/components/user-auth-form";

export default function AuthenticationPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <div
        className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Button
          className={cn(
            buttonVariants({variant: "ghost"}),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
          onClick={(e) => {
            e.preventDefault();
            setIsLogin(!isLogin);
          }}
        >
          {isLogin ? 'Register' : 'Login'}
        </Button>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <Image
            src="/parcel-auth-1.jpg"
            width={1280}
            height={843}
            alt="AuthBackground"
            className="absolute inset-0 h-screen w-full object-cover"
          />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Image
              src="/auspak-name-logo.svg"
              width={125}
              height={125}
              alt="auspak-name-logo"
              className="rounded-lg p-2"
              style={{backgroundColor: 'rgba(255, 255, 255, 0.9)'}}
            />
          </div>
          {/* <div className="relative z-20 mt-auto rounded-lg p-4 " style={{backgroundColor: 'rgba(255, 255, 255, 0.9)'}}>
            <blockquote className="space-y-2">
              <p className="text-lg text-auspak-dark-grey">
                &ldquo;Solving public transportation and parcels delivery.&rdquo;
              </p>
              <footer className="text-sm text-auspak-dark-grey">Sofia Davis</footer>
            </blockquote>
          </div> */}
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                {isLogin ? 'Login to your account' : 'Create an account'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isLogin ? 'Enter your credentials below to login' : 'Enter your information below to create your account'}
              </p>
            </div>
            {isLogin ? <LoginForm/> : <RegistrationForm/>}
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  )
}