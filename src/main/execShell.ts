import { exec, ExecException } from "child_process";
import path from "path";

export class Executor {
    platform: string = "win32";
    adbPath: string = path.resolve("adb", "win32", "platform-tools");
    constructor(platform_: string, adbPath_: string) {
        this.platform = platform_;
        this.adbPath = adbPath_;
    }
    public execute(command: string, callback?: ((error: ExecException | null, stdout: string, stderr: string) => void) | undefined) {
        console.log(command, this.platform, this.adbPath)
        return exec(command, {cwd: this.adbPath}, callback);
    }
}

