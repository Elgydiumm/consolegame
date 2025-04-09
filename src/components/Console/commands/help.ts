export function call(args: string[]): string {
    const commands = [
        "help",
        "signup",
        "signin",
        "rt"
    ];

    return `Available commands: ${commands.join(", ")}`;
}