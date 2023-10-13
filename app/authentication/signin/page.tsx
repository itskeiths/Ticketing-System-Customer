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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { redirect, useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

// Type definition for form input
type Input = z.infer<typeof signinSchema>;

// Login component
export default function Login() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<Input>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Function to handle form submission
  function onSubmit(data: Input) {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;
        toast({
          title: "Signed-in successfully!",
        });
        console.log('User UID:', uid);
        router.push('/Main_page');
      })
      .catch((error) => {
        toast({
          title: "Something went wrong:(",
          variant: "destructive",
        });
        console.log(error);
      });
  }

  return (
    <main className="flex justify-center items-center h-screen bg-gray-100 relative overflow-hidden">

      

      {/* Card for login */}
      <Card className="w-[350px] md:w-[400px] lg:w-[450px] xl:w-[500px] mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold mb-4">HelpHub</CardTitle>
          <CardDescription className="text-center">Solve your problem</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Form for login */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your password..." type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Buttons */}
              <div className="flex flex-col space-y-4">
                <div>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => router.push('/authentication/register')}
                  >
                    New User?
                  </Button>
                  <Button
                    type="button"
                    className="float-right"
                    variant="link"
                    onClick={() => router.push('/authentication/forgot-password')}
                  >
                    Forgot Password?
                  </Button>
                </div>
                <Button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Toast notifications */}
      <Toaster />
    </main>
  );
}