'use client'
/* import { Button } from '@/components/ui/costom/button'; */
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { z } from "zod";
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ApiClient from '@/Api/ApiClient'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { PasswordInput } from '@/components/costom/password-input'
import { Button } from '@/components/costom/button';

/* import { useAuth } from '@/app/hooks/auth'; */
import { useRouter } from 'next/navigation'
import InputError from '@/components/costom/InputError';
import { Errors } from '@/types/HttpErrorTypes';
import { useAuth } from '@/hooks/auth';

function LoginForm() {
    const router = useRouter()
    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [isLoading, setIsLoading] = useState(false);
    const formSchema = z.object({
        email: z
            .string()
            .min(1, { message: "Please enter your email" })
            .email({ message: "Invalid email address" }),
        password: z
            .string()
            .min(7, {
                message: "Password must be at least 7 characters long",
            })
            .max(255, {
                message: "Password must be less then 255 characters long",
            }),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const [shouldRemember, setShouldRemember] = useState(false)
    const [status, setStatus] = useState("")

    const [errors, setErrors] = useState<Errors | null>(null)
    /*  useEffect(() => {
         if (router.reset?.length > 0 && errors.length === 0) {
             setStatus(atob(router.reset))
         } else {
             setStatus(null)
         }
     }, []) */

    /*   const submitForm = async event => {
          event.preventDefault()
  
        
      } */
    function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true);
        login({
            email: data.email,
            password: data.password,
            remember: shouldRemember,
            setErrors,
            setStatus,
        })
        setIsLoading(false);

    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>

                <div className="grid gap-4 ">
                    <FormField

                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel className=''>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="name@example.com" className='' {...field} />
                                </FormControl>
                                <InputError messages={errors?.email} className="mt-2" />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <FormLabel>password </FormLabel>
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm font-medium text-muted-foreground hover:opacity-75"
                                    >
                                        forget password ?
                                    </Link>
                                </div>
                                <FormControl>
                                    <PasswordInput placeholder="********" className='' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" loading={isLoading}>
                        Login
                    </Button>

                </div>
            </form>
        </Form>
    )
    /*   return (
          <div className="grid gap-4">
              <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                  />
              </div>
              <div className="grid gap-2">
                  <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link
                          href="/forgot-password"
                          className="ml-auto inline-block text-sm underline"
                      >
                          Forgot your password?
                      </Link>
                  </div>
                  <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                  Login
              </Button>
             
          </div>
      ) */
}

export default LoginForm
