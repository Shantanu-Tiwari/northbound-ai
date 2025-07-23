import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// No need for 'export const dynamic' with this approach

export async function POST(request: Request) {
    const { name, email, password } = await request.json();

    if (!email || !password || !name) {
        return new NextResponse('Name, email, and password are required', { status: 400 });
    }

    // Use the basic Supabase client, which doesn't rely on cookies
    // This client uses the public 'anon' key for safe operations
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Check if user already exists
    const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

    if (existingUser) {
        return new NextResponse('User with this email already exists', { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user
    const { error } = await supabase
        .from('profiles')
        .insert({ full_name: name, email, hashed_password: hashedPassword });

    if (error) {
        console.error('Error signing up:', error);
        return new NextResponse('Could not sign you up. Please try again.', { status: 500 });
    }

    return new NextResponse('User created successfully', { status: 201 });
}