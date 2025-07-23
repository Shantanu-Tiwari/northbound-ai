'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [mode, setMode] = useState('login'); // 'login' or 'signup'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSignIn = async () => {
        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            setError('Invalid email or password.');
            setIsLoading(false);
        } else if (result?.ok) {
            router.push('/dashboard');
        }
    };

    const handleSignUp = async () => {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        if (res.ok) {
            // Automatically sign them in after successful signup
            await handleSignIn();
        } else {
            const text = await res.text();
            setError(text || 'Sign up failed.');
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (mode === 'signup') {
            await handleSignUp();
        } else {
            await handleSignIn();
        }
    };

    const buttonText = mode === 'login' ? 'Sign in' : 'Create Account';
    const loadingText = mode === 'login' ? 'Signing in...' : 'Creating Account...';

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                {/* === Welcome Header === */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome to Northbound AI
                    </h1>
                    <p className="mt-2 text-gray-600">
                        {mode === 'login' ? 'Sign in to access your dashboard' : 'Create an account to get started'}
                    </p>
                </div>

                {/* === Google Sign-in Button === */}
                <button
                    onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                    className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
                        <path fill="#4285F4" d="M24 9.5c3.9 0 6.9 1.6 9 3.8l6.9-6.9C35.4 2.8 30.1 0 24 0 14.5 0 6.5 5.6 2.8 13.9l7.7 6C12.2 13.4 17.6 9.5 24 9.5z"></path><path fill="#34A853" d="M46.2 25.4c0-1.7-.2-3.4-.4-5H24v9.5h12.5c-.5 3.1-2.1 5.7-4.5 7.4l7.7 6c4.5-4.1 7.1-10.2 7.1-17.9z"></path><path fill="#FBBC05" d="M10.5 27.8c-.5-1.5-.8-3.1-.8-4.8s.3-3.3.8-4.8l-7.7-6C1.2 15.6 0 19.7 0 24s1.2 8.4 2.8 11.8l7.7-6z"></path><path fill="#EA4335" d="M24 48c6.1 0 11.4-2 15.4-5.9l-7.7-6c-2.4 1.6-5.4 2.6-9.7 2.6-6.4 0-11.8-3.9-13.7-9.4l-7.7 6C6.5 42.4 14.5 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                    Sign in with Google
                </button>

                {/* === Separator === */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                {/* === Email & Password Form === */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'signup' && (
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input id="name" name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                                   placeholder="John Doe" />
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                        <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                               placeholder="you@example.com" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                               placeholder="••••••••" />
                    </div>

                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                    <div>
                        <button type="submit" disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? loadingText : buttonText}
                        </button>
                    </div>
                </form>

                {/* === Toggle between Login and Signup === */}
                <p className="text-center text-sm text-gray-600">
                    {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} className="ml-1 font-medium text-blue-600 hover:text-blue-500">
                        {mode === 'login' ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>
    );
}