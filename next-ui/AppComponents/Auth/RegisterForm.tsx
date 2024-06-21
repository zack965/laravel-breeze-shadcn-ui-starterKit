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

import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/navigation'
import InputError from '@/components/costom/InputError';
import { Errors } from '@/types/HttpErrorTypes';

function RegisterForm() {
    const router = useRouter()
    const { register } = useAuth({
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
        name: z
            .string()
            .min(1, {
                message: "name required",
            })
            .max(255, {
                message: "name must be less then 255 characters long",
            }),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
        },
    });
    const [shouldRemember, setShouldRemember] = useState(false)
    const [status, setStatus] = useState(null)

    const [errors, setErrors] = useState<Errors | null>(null)
    /*  useEffect(() => {
         if (router.reset?.length > 0 && errors.length === 0) {
             setStatus(atob(router.reset))
         } else {
             setStatus(null)
         }
     }, []) */


    function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true);
        register({
            name: data.name,
            email: data.email,
            password: data.password,
            password_confirmation: data.password,
            setErrors,
        })


        setIsLoading(false);

    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>

                <div className="grid gap-4 ">
                    <FormField

                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel className=''>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="....." className='' {...field} />
                                </FormControl>
                                <InputError messages={errors?.name} className="mt-2" />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                                    <FormLabel className='py-2'>password </FormLabel>

                                </div>
                                <FormControl>
                                    <PasswordInput placeholder="********" className='' {...field} />
                                </FormControl>
                                <InputError messages={errors?.password} className="mt-2" />

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" loading={isLoading}>
                        Register
                    </Button>

                </div>
            </form>
        </Form>
    )

}

export default RegisterForm
