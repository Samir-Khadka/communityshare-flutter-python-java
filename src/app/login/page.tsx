'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Wrench, Mail, Lock } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // Use Firebase Authentication (same as Flutter app)
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            // Get Firebase ID token
            const token = await user.getIdToken()

            // Fetch user role from Python backend
            let role = 'user'
            try {
                const roleResponse = await fetch(`http://localhost:8000/api/v1/users/${user.uid}`)
                if (roleResponse.ok) {
                    const userData = await roleResponse.json()
                    role = userData.role || 'user'
                } else if (roleResponse.status === 404) {
                    // Create user if missing
                    const createResponse = await fetch(`http://localhost:8000/api/v1/users?user_id=${user.uid}&email=${user.email}&display_name=${user.displayName || user.email?.split('@')[0]}`, {
                        method: 'POST'
                    })
                    if (createResponse.ok) {
                        const newUser = await createResponse.json()
                        role = newUser.user?.role || 'user'
                    }
                }
            } catch (roleErr) {
                console.error('Failed to fetch/sync user role:', roleErr)
            }

            // Force admin role for ram123 if fallback failed
            if (user.email === 'ram123@gmail.com') {
                role = 'admin'
            }

            // Store token and user data
            localStorage.setItem('authToken', token)
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                name: user.displayName || user.email?.split('@')[0],
                role: role
            }))

            // Redirect to dashboard
            router.push('/dashboard')
        } catch (err: any) {
            console.error('Login error:', err)
            setError(err.message || 'Login failed. Please check your credentials.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <div className="flex items-center space-x-2">
                            <Wrench className="h-8 w-8 text-green-600" />
                            <span className="text-2xl font-bold">Community Share</span>
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
                    <CardDescription className="text-center">
                        Login to start sharing tools with your community
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-green-600 hover:underline font-medium">
                            Sign up
                        </Link>
                    </div>

                    <div className="mt-4 text-center">
                        <Link href="/" className="text-sm text-gray-600 hover:underline">
                            Back to Home
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
