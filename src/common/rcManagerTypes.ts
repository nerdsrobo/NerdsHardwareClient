

export interface RevHubInfo {
    firmwareVersion: string,
    imuType: string,
    moduleAddress: number,
    name: string,
    parentSerial: string,
    revProductNumber: number
}
export interface WiFiChannel {
    band: string,
    displayName: string,
    name: string,
    overlapsWithOtherChannels: boolean
}
export interface RcInfo {
    activeConfigName: string,
    appUpdateRequiresReboot: boolean,
    availableChannels: Array<WiFiChannel>,
    chOsVersion: string,
    currentChannel: WiFiChannel,
    deviceName: string,
    ftcUserAgentCategory: string,
    includedFirmwareFileVersion: string,
    isREVControlHub: boolean,
    networkName: string,
    passphrase: string,
    rcVersion: string,
    revHubNamesAndVersions: Array<RevHubInfo>,
    sdkVersion: string,
    serialNumber: string,
    serverIsAlive: boolean,
    serverUrl: string,
    supports5GhzAp: boolean,
    supportsOtaUpdate: boolean,
    webSocketApiVersion: number
}