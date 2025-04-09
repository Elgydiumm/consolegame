import { setSession } from '../sessionManager' // We'll create this file next

export async function call(args: string[], session: any, supabase: any): Promise<string> {
  try {
    if (args.length === 2) {
      const [email, password] = args;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          emailRedirectTo: 'https://example.com/welcome',
        },
      });
      
      if (error) {
        return `Errm... They have a firewall we can't breach: ${error.message}`;
      }
      
      // Store the session if we got one
      if (data.session) {
        setSession(data.session);
      }
        return 'Aaaaaand.... We\'re in!.';
    }
    
    return 'Usage: signin <email> <password>';
  } catch (error) {
    return `Error during sign-in: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}