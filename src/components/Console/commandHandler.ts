import { Session } from "@supabase/supabase-js";

export async function handleCommand(command: string, session: Session |  null, supabase: any, terminalId: string): Promise<string> {
    const commandParts = command.split(" ");
    const commandName = commandParts[0];
    const args = commandParts.slice(1);

    try {
        const commandModule = await import(`./commands/${commandName}.ts`)
            .catch(() => null);
        if (commandModule && typeof commandModule.call === 'function') {
            return await commandModule.call(args, session, supabase, terminalId);
        } else {
            return `Unknown command: ${commandName}`;
        }
    } catch (error) {
        return `Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
}