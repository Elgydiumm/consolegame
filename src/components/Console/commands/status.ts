import { Session, SupabaseClient } from '@supabase/supabase-js';

export async function call(args: string[], session: Session | null, supabase: SupabaseClient): Promise<string> {
    try {
        // If we have a session, the user is logged in
        if (session) {
            const { data: user } = await supabase.auth.getUser();

            if (user && user.user) {
                return `
Status: LOGGED IN
User: ${user.user.email}
ID: ${user.user.id}
Last Sign-In: ${new Date(user.user.last_sign_in_at || '').toLocaleString() || 'Unknown'}
Created: ${new Date(user.user.created_at).toLocaleString()}
`;
            }

            return `Status: LOGGED IN (Session exists but user details unavailable)`;
        } else {
            // If no session, user is not logged in
            return `
Status: NOT LOGGED IN
Use 'signin <email> <password>' to log in
Or 'signup <email> <password>' to create a new account
`;
        }
    } catch (error) {
        return `Error retrieving status: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
}