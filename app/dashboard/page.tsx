// in app/dashboard/page.tsx

import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js'; // Import the core client
import { authOptions } from '../api/auth/[...nextauth]/route';
import SignOutButton from './SignOutButton';

// This function will fetch all campaigns for the logged-in user
async function getUserCampaigns(userId: string) {
    // Create an admin client to bypass RLS
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabaseAdmin
        .from('generated_campaigns')
        .select('id, ad_headline, created_at')
        .eq('user_id', userId) // We still enforce security in our code
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching campaigns:', error);
        return [];
    }
    return data;
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect('/login');
    }

    const campaigns = await getUserCampaigns(session.user.id);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Your Dashboard</h1>
                    <SignOutButton />
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">My Campaigns</h2>
                        <Link href="/create" passHref>
              <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                + Create New Campaign
              </span>
                        </Link>
                    </div>

                    {/* Campaign List */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul role="list" className="divide-y divide-gray-200">
                            {campaigns && campaigns.length > 0 ? (
                                campaigns.map((campaign) => (
                                    <li key={campaign.id}>
                                        <Link href={`/campaign/${campaign.id}`} passHref>
                      <span className="block hover:bg-gray-50 cursor-pointer">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-md font-medium text-blue-600 truncate">{campaign.ad_headline}</p>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                Generated on {new Date(campaign.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </span>
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                                    You haven't created any campaigns yet.
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}