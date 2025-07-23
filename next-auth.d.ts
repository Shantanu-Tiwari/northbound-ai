import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    /**
     * Extends the built-in session.user object to include your custom properties.
     */
    interface Session {
        user: {
            id: string; // This is the user ID from your database
        } & DefaultSession['user'];
    }
}