// in app/create/CreateCampaignForm.tsx
'use client';

// Make sure to import useFormStatus from 'react-dom'
import { useFormStatus } from 'react-dom';
import { createCampaignAction } from "@/app/create/actions";

// Step 1: Create a new component for the submit button
function SubmitButton() {
    // useFormStatus gives us the pending state of the form
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending} // Disable the button when pending is true
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
            {/* Change the text when the form is submitting */}
            {pending ? 'Generating Campaign...' : 'Generate Campaign'}
        </button>
    );
}


export default function CreateCampaignForm() {
    return (
        <form action={createCampaignAction} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
            <div>
                <label htmlFor="product_name" className="block text-sm font-medium text-gray-700">
                    Product or Service Name
                </label>
                <input
                    type="text"
                    name="product_name"
                    id="product_name"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="e.g., Handmade Leather Wallets"
                />
            </div>

            <div>
                <label htmlFor="product_description" className="block text-sm font-medium text-gray-700">
                    Product Description
                </label>
                <textarea
                    name="product_description"
                    id="product_description"
                    rows={4}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Describe what you're selling, its key features, and benefits."
                ></textarea>
            </div>

            <div>
                <label htmlFor="target_audience" className="block text-sm font-medium text-gray-700">
                    Target Audience
                </label>
                <textarea
                    name="target_audience"
                    id="target_audience"
                    rows={3}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Describe your ideal customer in plain English (e.g., 'Professionals aged 30-45 who value quality craftsmanship')."
                ></textarea>
            </div>

            <div>
                {/* Step 2: Use the new SubmitButton component here */}
                <SubmitButton />
            </div>
        </form>
    );
}