
let updateCallback = (_status: string) => {};
let logger = (_data: string) => {};

export let statusInfo = "Started"
export let isConnected = false;
export let isNewNetwork = true;

export function updateStatus(status: string) {
    logger("statusApi : update status to: " + status);
    statusInfo = status;
    if ( status == "Connected" ) { isConnected = true; isNewNetwork = false; }
    else if ( status == "Disconnected" ) { isConnected = false; }
    else if ( status == "Network not found" || status == "Connecting" || status == "Failed" ) { isNewNetwork = false; }
    else if ( status == "Network changed" ) { isNewNetwork = true; }
    updateCallback(status);
}

export function setupStatusApi(updateCallback_: (status: string) => void, logger_: (data: string) => void) {
    updateCallback = updateCallback_;
    logger = logger_;
}