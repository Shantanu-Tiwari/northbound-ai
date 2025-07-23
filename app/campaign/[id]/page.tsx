export const dynamic = 'force-dynamic'; // This line is still a best practice

import { getServerSession } from 'next-auth/next';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// We have removed the separate getCampaignData function.
// All logic is now handled directly within the page component.

export default async function CampaignResultsPage({ params }: { params: Promise<{ id: string }> }) {
    // Step 1: Await the params object
    const resolvedParams = await params;

    // Step 2: Get the user's session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect('/login');
    }

    // Step 3: Create the Supabase client using environment variables
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for server-side
    );

    // Step 4: Fetch the campaign data, ensuring the user owns it
    const { data: campaign, error } = await supabase
        .from('generated_campaigns')
        .select('*')
        .eq('id', resolvedParams.id)
        .eq('user_id', session.user.id)
        .single();

    // Step 5: If no campaign is found, show a 404 page
    if (error || !campaign) {
        notFound();
    }

    // Step 6: Render the page with the fetched data
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
            <div className="w-full max-w-3xl px-8 space-y-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">✨ Your AI-Generated Campaign</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Here are the assets for your new campaign. You can copy and paste them into your ad platform.
                    </p>
                </div>

                {/* Ad Headline */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Ad Headline</h2>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{campaign.ad_headline}</p>
                </div>

                {/* Ad Copy */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Ad Copy</h2>
                    <p className="mt-2 text-lg text-gray-700 whitespace-pre-wrap">{campaign.ad_copy}</p>
                </div>

                {/* Targeting Suggestions */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Targeting Keywords/Interests</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {campaign.targeting_details?.keywords?.map((keyword: string) => (
                            <span key={keyword} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {keyword}
              </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}