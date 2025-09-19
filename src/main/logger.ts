import { appendFile, mkdir, writeFileSync } from "fs";

let ts: string = ((date => {return date.toLocaleDateString().replace("/", ".").replace("/", ".").replace("/", ".") + '-' + date.toLocaleTimeString().replace(":", ".").replace(":", ".")})(new Date()));

let order: Array<string> = [];
let isBusy = false;

export let logsRecords: Array<string> = [];

let callbackUpdate = (_log: string) => {}

function handleOrder() {
    if ( order.length === 0 ) {
        isBusy = false;
        return;
    }
    const data = order.shift();
    data ? addToRecords(data) : '';
    appendFile("./logs/" + ts + ".log", data + "\n", _err => {handleOrder()})
}

function addToRecords(log: string) {
    logsRecords.push(log);
    callbackUpdate(log);
}

export function loggerInit() {
    mkdir("./logs", () => {});
    ts = (date => {return date.toLocaleDateString().replace("/", ".").replace("/", ".").replace("/", ".") + '-' + date.toLocaleTimeString().replace(":", ".").replace(":", ".")})(new Date());
    console.log(ts)
    // writeFile("./logs/" + ts + ".log", new Date().toTimeString() + " : " + "loggerInited" + "\n", { flag: 'w+' }, _err => {console.log(_err)});
    writeFileSync("./logs/" + ts + ".log", new Date().toLocaleTimeString() + " : " + "logger inited" + "\n", { flag: 'w+' })//, _err => {handleOrder()});
}

export function logger(data: string) {
    if ( !isBusy ) { isBusy = true; addToRecords(new Date().toLocaleTimeString() + " : " + data); appendFile("./logs/" + ts + ".log", new Date().toLocaleTimeString() + " : " + data + "\n", _err => {handleOrder()}); }
    else { order.push(new Date().toLocaleTimeString() + " : " + data); }
}

export function setCallbackUpdate(callbackUpdate_: (log: string) => void) {
    callbackUpdate = callbackUpdate_;
}

