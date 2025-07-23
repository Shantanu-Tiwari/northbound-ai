// in app/dashboard/page.tsx
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
// Note: We need a simple button component for signing out
import SignOutButton from './SignOutButton';
import {authOptions} from "@/app/api/auth/[...nextauth]/route";


export default async function DashboardPage() {
    const session = await getServerSession(authOptions); // This is how you get session on the server

    if (!session) {
        redirect('/login');
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold">Welcome to your Dashboard</h1>
            <p className="mt-4 text-lg">Signed in as: {session.user?.email}</p>
            <div className="mt-6">
                <SignOutButton />
            </div>
        </div>
    );
}