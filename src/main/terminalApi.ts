import { Executor } from "./execShell";
import { resolve } from "path";


export interface TerminalRecord {
    stdin: string,
    stdout: string,
    isErr: boolean,
    isUser: boolean
}

let logger = (_data: string) => {}

let callbackUpdate = (_terminalRecord: TerminalRecord) => {}

let platform = "win32";

let executor = new Executor("win32", resolve("adb/win32/platform-tools"))

export let terminalRecords: Array<TerminalRecord> = [];

export function makeRecord(terminalRecord: TerminalRecord) {
    logger("terminalApi : made terminal record: " + JSON.stringify(terminalRecord))
    terminalRecords.push(terminalRecord)
    callbackUpdate(terminalRecord)
}

export function executeCommand(stdin: string) {
    executor.execute(stdin, (stderr, stdout) => {
        makeRecord({stdin: stdin, stdout: (stderr?.message && stdin != "adb" && stdin != "./adb") ? stderr?.message : stdout, isErr: Boolean(stderr?.message && stdin != "adb" && stdin != "./adb"), isUser: true})
    })
}

export function setupTerminalApi(platform_: string, callbackUpdate_: (terminalRecord: TerminalRecord) => void, logger_: (data: string) => void, executor_: Executor) {
    callbackUpdate = callbackUpdate_;
    logger = logger_;
    platform = platform_;
    executor = executor_;
}