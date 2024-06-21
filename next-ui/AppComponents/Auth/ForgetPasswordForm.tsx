"use client"
import { useAuth } from '@/hooks/auth';
import InputError from '@/components/costom/InputError';
import { Button } from '@/components/costom/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { Errors } from '@/types/HttpErrorTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

function ForgetPasswordForm() {
    const { forgotPassword } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Errors | null>(null)
    const [status, setStatus] = useState<string>("")
    const formSchema = z.object({
        email: z
            .string()
            .min(1, { message: "Please enter your email" })
            .email({ message: "Invalid email address" }),

    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",

        },
    });

    function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true);


        forgotPassword({ email: data.email, setErrors, setStatus })

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

                    <Button type="submit" className="w-full" loading={isLoading}>
                        Submit Email
                    </Button>

                </div>
            </form>
            <Toaster />
        </Form>
    )
}

export default ForgetPasswordForm
