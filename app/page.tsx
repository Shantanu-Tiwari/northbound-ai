// in app/page.tsx

import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
            <div className="w-full max-w-2xl">
                <h1 className="text-5xl font-bold text-gray-900 tracking-tight sm:text-6xl">
                    Northbound AI
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                    Your AI co-pilot for advertising. Go from idea to a complete, high-performance ad campaign in minutes.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        href="/login"
                        className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        Get Started
                    </Link>
                    <Link
                        href="/dashboard"
                        className="text-sm font-semibold leading-6 text-gray-900"
                    >
                        Go to Dashboard <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}