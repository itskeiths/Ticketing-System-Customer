"use client"
import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { signinSchema } from "../../validators/auth-validator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { redirect, useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import { useToast } from "@/components/ui/use-toast"



type Input = z.infer<typeof signinSchema>;

export default function Login() {
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<Input>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(data: Input) {
    
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => { 
        const user = userCredential.user;
        const uid = user.uid
        toast(
          {
              title: "Signed-in successfully!",
          });
          console.log('User UID:', uid);
        router.push('/dashboard') })
      .catch((error) => { 
        toast(
          {
              title: "Something went wrong:(",
              variant: "destructive",
          });
          console.log(error); })
  }

  return (
    <main>
      <div className='min-h-screen'>
        <Card className="w-[350px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <h1 className="text-3xl font-bold mb-4 text-center m-3">HelpHub</h1>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Solve your problem</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">

              <img src="https://img.freepik.com/free-vector/organic-flat-customer-support-illustration_23-2148899174.jpg" alt="Customer Support" className="w-full mb-4" />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Password */}
                <FormField
                  control={form.control}

                  name="password"
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your password..." type="password"  {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col space-y-4">
                  <div >
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => router.push('/authentication/register')}
                    >
                      New User?</Button>
                    <Button
                      type="button"
                      className="float-right"
                      variant="link"
                      onClick={() => router.push('/authentication/forgot-password')}
                    >
                      Forgot Password?</Button>
                  </div>

                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Toaster />
      </div>

    </main>



  )
}