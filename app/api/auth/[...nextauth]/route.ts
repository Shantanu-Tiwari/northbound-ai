import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import NextAuth, {type NextAuthOptions} from "next-auth";

export const authOptions: NextAuthOptions = {
    // Use JSON Web Tokens for session management
    session: {
        strategy: 'jwt',
    },

    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'Email & Password',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                // This is where you retrieve user data to verify with the credentials
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // Create a Supabase admin client to bypass RLS for user lookup
                const supabaseAdmin = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.SUPABASE_SERVICE_ROLE_KEY!
                );

                // Find the user in your 'profiles' table
                const { data: user, error } = await supabaseAdmin
                    .from('profiles')
                    .select('*')
                    .eq('email', credentials.email)
                    .single();

                if (error || !user) {
                    console.error("Error finding user or user not found:", error);
                    return null; // User not found
                }

                // Check if the user has a password (they might have signed up with Google)
                if (!user.hashed_password) {
                    return null; // Prevent login for OAuth users via credentials
                }

                // Use bcrypt to compare the provided password with the stored hash
                const passwordsMatch = await bcrypt.compare(
                    credentials.password,
                    user.hashed_password
                );

                if (!passwordsMatch) {
                    return null; // Passwords do not match
                }

                // If everything is correct, return the user object
                return {
                    id: user.id,
                    name: user.full_name,
                    email: user.email,
                };
            },
        }),
    ],

    // Point to your custom login page
    pages: {
        signIn: '/login',
    },

    // Callbacks are used to control what happens when an action is performed.
    // Inside your NextAuth({ ... }) configuration
// in app/api/auth/[...nextauth]/route.ts

    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google') {
                const supabaseAdmin = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.SUPABASE_SERVICE_ROLE_KEY!
                );

                try {
                    // Find user by email
                    const { data: dbUser } = await supabaseAdmin
                        .from('profiles')
                        .select('id, email')
                        .eq('email', user.email!)
                        .single();

                    if (dbUser) {
                        // If user exists, attach their DB id to the user object
                        user.id = dbUser.id;
                    } else {
                        // If user doesn't exist, create them
                        const { data: newUser } = await supabaseAdmin
                            .from('profiles')
                            .insert({
                                email: user.email,
                                full_name: user.name,
                            })
                            .select('id') // Return the id of the new user
                            .single();

                        if (newUser) {
                            user.id = newUser.id;
                        }
                    }
                } catch (error) {
                    console.error("Error during Google sign-in DB check:", error);
                    return false; // Prevent sign-in on error
                }
            }
            return true; // Allow sign-in
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };