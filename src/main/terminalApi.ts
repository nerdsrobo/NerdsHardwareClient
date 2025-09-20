import { exec } from "child_process";


export interface TerminalRecord {
    stdin: string,
    stdout: string,
    isErr: boolean,
    isUser: boolean
}

let logger = (_data: string) => {}

let callbackUpdate = (_terminalRecord: TerminalRecord) => {}

export let terminalRecords: Array<TerminalRecord> = [];

export function makeRecord(terminalRecord: TerminalRecord) {
    logger("terminalApi : made terminal record: " + JSON.stringify(terminalRecord))
    terminalRecords.push(terminalRecord)
    callbackUpdate(terminalRecord)
}

export function executeCommand(stdin: string) {
    exec(stdin, (stderr, stdout) => {
        makeRecord({stdin: stdin, stdout: stderr?.message ? stderr?.message : stdout, isErr: stderr?.message ? true : false, isUser: true})
    })
}

export function setupTerminalApi(callbackUpdate_: (terminalRecord: TerminalRecord) => void, logger_: (data: string) => void) {
    callbackUpdate = callbackUpdate_;
    logger = logger_;
}