'use client'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import AuthSessionStatus from "@/AppComponents/Auth/AuthSessionStatus"
import InputError from "@/components/costom/InputError"
import { Button } from "@/components/costom/button"
import { Input } from "@/components/ui/input"
import { Errors } from "@/types/HttpErrorTypes"
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "@radix-ui/react-label"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { PasswordInput } from '@/components/costom/password-input'
import { useAuth } from '@/hooks/auth'



const PasswordResetForm = () => {
    const searchParams = useSearchParams()

    const { resetPassword } = useAuth({ middleware: 'guest' })
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState<Errors | null>(null)
    const [status, setStatus] = useState<string>("")

    /*   const submitForm = event => {
          event.preventDefault()
  
          
      } */
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
        password_confirmation: z
            .string()
            .min(7, {
                message: "Password must be at least 7 characters long",
            })
            .max(255, {
                message: "Password must be less then 255 characters long",
            }),
    }).refine(data => data.password === data.password_confirmation, {
        message: 'Passwords do not match',
        path: ['password_confirmation'], // Path of the error field
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: searchParams.get('email') || "",
            password: "",
            password_confirmation: "",
        },
    });
    /*


    */
    function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true);
        resetPassword({
            email: data.email,
            password: data.password,
            password_confirmation: data.password_confirmation,
            setErrors,
            setStatus,
        })
        setIsLoading(false);

    }
    useEffect(() => {
        setEmail(searchParams.get('email') || "")
    }, [searchParams.get('email')])
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
                                {/* <div className="flex items-center justify-between">
                                    <FormLabel>password </FormLabel>
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm font-medium text-muted-foreground hover:opacity-75"
                                    >
                                        forget password ?
                                    </Link>
                                </div> */}
                                <FormControl>
                                    <PasswordInput placeholder="********" className='' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password_confirmation"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                {/* <div className="flex items-center justify-between">
                                    <FormLabel>password </FormLabel>
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm font-medium text-muted-foreground hover:opacity-75"
                                    >
                                        forget password ?
                                    </Link>
                                </div> */}
                                <FormControl>
                                    <PasswordInput placeholder="********" className='' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" loading={isLoading}>
                        Reset
                    </Button>

                </div>
            </form>
        </Form>
    )
    /*  return (
         <>
           
             <AuthSessionStatus className="mb-4" status={status || ""} />
 
             <form onSubmit={submitForm}>
                 <div>
                     <Label htmlFor="email">Email</Label>
 
                     <Input
                         id="email"
                         type="email"
                         value={email}
                         className="block mt-1 w-full"
                         onChange={event => setEmail(event.target.value)}
                         required
                         autoFocus
                     />
 
                     <InputError messages={errors?.email} className="mt-2" />
                 </div>
 
                 <div className="mt-4">
                     <Label htmlFor="password">Password</Label>
                     <Input
                         id="password"
                         type="password"
                         value={password}
                         className="block mt-1 w-full"
                         onChange={event => setPassword(event.target.value)}
                         required
                     />
 
                     <InputError
                         messages={errors?.password}
                         className="mt-2"
                     />
                 </div>
 
                 <div className="mt-4">
                     <Label htmlFor="passwordConfirmation">
                         Confirm Password
                     </Label>
 
                     <Input
                         id="passwordConfirmation"
                         type="password"
                         value={passwordConfirmation}
                         className="block mt-1 w-full"
                         onChange={event =>
                             setPasswordConfirmation(event.target.value)
                         }
                         required
                     />
 
                     <InputError
                         messages={errors?.password_confirmation}
                         className="mt-2"
                     />
                 </div>
 
                 <div className="flex items-center justify-end mt-4">
                     <Button>Reset Password</Button>
                 </div>
             </form>
         </>
     ) */
}

export default PasswordResetForm
