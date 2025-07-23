// in app/create/actions.ts

'use server';

import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { generateCampaign } from '@/lib/ai'; // Import our new AI function

export async function createCampaignAction(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error('User is not authenticated.');
    }
    const userId = session.user.id;

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // --- Step 1: Save the user's input ---
    const product_name = formData.get('product_name') as string;
    const product_description = formData.get('product_description') as string;
    const target_audience = formData.get('target_audience') as string;

    const { data: inputData, error: inputError } = await supabaseAdmin
        .from('campaign_inputs')
        .insert({
            user_id: userId,
            product_name,
            product_description,
            target_audience,
        })
        .select()
        .single();

    if (inputError) {
        console.error('Error creating campaign input:', inputError);
        throw new Error('Failed to save campaign details.');
    }

    // --- Step 2: Call the AI to generate the campaign ---
    const aiResult = await generateCampaign({
        productName: product_name,
        productDescription: product_description,
        targetAudience: target_audience,
    });

    // --- Step 3: Save the AI's output ---
    const { data: campaignData, error: campaignError } = await supabaseAdmin
        .from('generated_campaigns')
        .insert({
            user_id: userId,
            input_id: inputData.id,
            ad_headline: aiResult.headline,
            ad_copy: aiResult.copy,
            targeting_details: { keywords: aiResult.targeting },
        })
        .select('id') // Select the ID of the new campaign
        .single();

    if (campaignError) {
        console.error('Error saving generated campaign:', campaignError);
        throw new Error('Failed to save AI-generated campaign.');
    }

    // --- Step 4: Redirect to the new results page ---
    redirect(`/campaign/${campaignData.id}`);
}