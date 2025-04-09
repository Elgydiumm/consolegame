import { createClient, Session } from '@supabase/supabase-js';
import { setSession } from '../sessionManager' // We'll create this file next

export async function call(args: string[], session: Session | null, supabase: any): Promise<string> {
  try {
    if (args.length === 2) {
      const [email, password] = args;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://example.com/welcome',
        },
      });
      
      if (error) {
        return `Something got fucked on the way there: ${error.message}`;
      }
      
      if (data.session) {
        setSession(data.session);
      }
      
      return 'Aaaaaand.... now we just need to verify our email and we\'re in!.';
    }
    
    return 'Usage: signup <email> <password>';
  } catch (error) {
    return `Error during sign-up: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}