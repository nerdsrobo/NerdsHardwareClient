import { is } from "@electron-toolkit/utils";
import { exec, ExecException } from "child_process";
import { join, resolve } from "path";
import { platform } from "process";

export function getPathToAdbExec() {
    if ( process.platform == "darwin" && !is.dev ) { return join(process.resourcesPath, 'adb', 'darwin', 'platform-tools') + '/' }
    return resolve("adb/" + process.platform + "/platform-tools/");
}

export class Executor {
    adbPath: string = getPathToAdbExec();
    public execute(command: string, callback?: ((error: ExecException | null, stdout: string, stderr: string) => void) | undefined) {
        return exec(command, {cwd: this.adbPath}, callback);
    }
    public platformRelativeAdbExecute(command: string, callback?: ((error: ExecException | null, stdout: string, stderr: string) => void) | undefined) {
        return this.execute((platform != "win32" ? "./" : "") + command, callback);
    }
}

