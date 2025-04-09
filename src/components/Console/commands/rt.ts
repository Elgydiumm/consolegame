import { Session } from "@supabase/supabase-js";
import { Terminal } from "lucide-react";

export async function call(args: string[], session: Session | null, supabase: any, terminalId: string): Promise<string> {
    if (args.length === 0) return "Usage: rt <new-terminal-name>";
  
    if (!terminalId) return "Error: Could not identify terminal";
  
    const newTitle = args.join(" ");
    
    if (newTitle.length > 50) return "Error: Terminal name too long (max 50 characters)";
  
    if (newTitle.trim().length === 0) return "Error: Terminal name cannot be empty";
  
    console.log(`Dispatching title change for terminal ${terminalId}: ${newTitle}`);
    
    window.dispatchEvent(
      new CustomEvent("terminalTitleChanged", {
        detail: { title: newTitle, terminalId }
      })
    );
    
    return `Terminal renamed to: ${newTitle}`;
  }