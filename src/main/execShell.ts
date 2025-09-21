import { exec, ExecException } from "child_process";

export function execute(platform: string, command: string, callback?: ((error: ExecException | null, stdout: string, stderr: string) => void) | undefined) {
    return exec((platform == "win32" ? "pwsh -C \"" : "" ) + command + (platform == "win32" ? "\"" : ""), callback);
}