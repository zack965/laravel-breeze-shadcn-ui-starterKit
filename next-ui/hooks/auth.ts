import useSWR from 'swr'

import { Dispatch, SetStateAction, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { User } from '@/types/types'
import { useToast } from '@/components/ui/use-toast'
import ApiClient from '@/Api/ApiClient'
import { Errors } from '@/types/HttpErrorTypes'
interface ErrorStateType {
    setErrors: (errors: Errors | null) => void;
}
interface StatusStateType {
    setStatus: (errors: string | null) => void;
}

export const useAuth = ({ middleware, redirectIfAuthenticated }: { middleware?: string; redirectIfAuthenticated?: string } = {}) => {
    const router = useRouter()
    const params = useParams()
    const { toast } = useToast()

    const { data: user, error, mutate } = useSWR<User>('/api/user', () =>
        ApiClient
            .get('/api/user')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error

                router.push('/verify-email')
            }),
    )

    const csrf = () => ApiClient.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, ...props }: ErrorStateType & {
        name: string,
        email: string,
        password: string,
        password_confirmation: string,
    }) => {
        await csrf()

        setErrors(null)

        ApiClient
            .post('/register', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const login = async ({ setErrors, setStatus, ...props }: {
        setErrors: Dispatch<SetStateAction<Errors | null>>;
        setStatus: Dispatch<SetStateAction<string>>;
        email: string;
        password: string;
        remember: boolean;
    }) => {
        await csrf()

        setErrors(null)
        setStatus("")

        ApiClient
            .post('/login', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const forgotPassword = async ({ setErrors, setStatus, email }: {
        setErrors: Dispatch<SetStateAction<Errors | null>>;
        setStatus: Dispatch<SetStateAction<string>>;
        email: string
    }) => {
        await csrf()

        setErrors(null)
        setStatus("")

        ApiClient
            .post('/forgot-password', { email })
            .then(response => {
                toast({
                    title: "you did receive en email with reset link",

                })
                setStatus(response.data.status)
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const resetPassword = async ({ setErrors, setStatus, ...props }: {
        email: string;
        password: string;
        password_confirmation: string;
        setErrors: Dispatch<SetStateAction<Errors | null>>;
        setStatus: Dispatch<SetStateAction<string>>;
    }) => {
        await csrf()

        setErrors(null)
        setStatus("")

        ApiClient
            .post('/reset-password', { token: params.token, ...props })
            .then(response =>
                router.push('/login?reset=' + btoa(response.data.status)),
            )
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const resendEmailVerification = ({ setStatus }: {
        setStatus: Dispatch<SetStateAction<string>>;
    }) => {
        ApiClient
            .post<{ status: string; }>('/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const logout = async () => {
        if (!error) {
            await ApiClient.post('/logout').then(() => mutate())
        }

        window.location.pathname = '/login'
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)
        if (
            window.location.pathname === '/verify-email' &&
            user?.email_verified_at
        )
            router.push(redirectIfAuthenticated || "")
        if (middleware === 'auth' && error) logout()
    }, [user, error])

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
    }
}


/* const { user } = useAuth({ middleware: 'auth' })

*/
