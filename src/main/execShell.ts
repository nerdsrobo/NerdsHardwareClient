import { exec, ExecException } from "child_process";
import path from "path";
import { platform } from "process";

export class Executor {
    adbPath: string = path.resolve("adb", platform, "platform-tools");
    public execute(command: string, callback?: ((error: ExecException | null, stdout: string, stderr: string) => void) | undefined) {
        return exec(command, {cwd: this.adbPath}, callback);
    }
    public platformRelativeAdbExecute(command: string, callback?: ((error: ExecException | null, stdout: string, stderr: string) => void) | undefined) {
        return this.execute((platform != "win32" ? "./" : "") + command, callback);
    }
}

