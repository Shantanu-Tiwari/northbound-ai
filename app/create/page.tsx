import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import CreateCampaignForm from './CreateCampaignForm'; // We will create this component next

export default async function CreatePage() {
    const session = await getServerSession();

    // If the user is not logged in, redirect them to the login page
    if (!session) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
            <div className="w-full max-w-2xl px-8">
                <h1 className="text-4xl font-bold text-gray-900">Create a New Campaign</h1>
                <p className="mt-2 text-lg text-gray-600">
                    Provide the details below and let our AI do the rest.
                </p>
                <div className="mt-8">
                    <CreateCampaignForm />
                </div>
            </div>
        </div>
    );
}