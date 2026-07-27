import { Spring } from "svelte/motion";


export class Tab { 

    zOrder: number = $state(3);
    spring: Spring<number>;
    show = $state(false);
    openingOrOpen = $state(false);
    shadow = $state(false);
    name: string;
    loading = $state(false);
    isIframe: boolean;

    maxTransform: () => number;

    constructor(maxTransform: () => number, name: string, isIframe: boolean) {
        this.name = name;
        this.maxTransform = maxTransform;
        this.spring = new Spring(maxTransform());
        tabsManager.tabs[name] = this;
        this.isIframe = $state(isIframe);
    }

    loaded() {
        this.loading = false;
    }

    open() {
        this.openingOrOpen = true;
        this.shadow = true;
        this.zOrder = 5;
        this.show = true;
        if ( this.isIframe ) { this.loading = true; }
        tabsManager.iAmOpening(this);
        this.spring.set(0).then(() => {this.shadow = false; tabsManager.iOpened()}, () => {});
    }

    startPreHide() {
        this.openingOrOpen = false;
        this.shadow = true;
        this.zOrder = 3;
    }

    hide() {
        tabsManager.iAmClosing();
        this.shadow = true;
        this.openingOrOpen = false;
        this.zOrder = 3;
        this.spring.set(this.maxTransform()).then(() => this.turnOffShow(), () => {});
    }

    turnOffShow() {
        this.spring.set(this.maxTransform(), {instant: true})
        this.shadow = false;
        this.show = false;
        this.zOrder = 3;
    }

    handleClick() {
        this.openingOrOpen ? this.hide() : this.open();
    }
}

class TabsManager {

    tabs: {[key: string]: Tab} = $state({});
    opened: Tab | null = $state(null);
    hiding: Set<Tab> = $state(new Set([]));

    iAmOpening(tab: Tab) {
        this.opened?.startPreHide();
        if ( this.hiding.has(tab) ) { this.hiding.delete(tab); }
        if ( this.opened ) { this.hiding.add(this.opened); }
        this.opened = tab;
    }

    iOpened() {
        this.hiding.forEach(tab => {tab.turnOffShow()});
        this.hiding.clear()
    }

    iAmClosing() {
        this.iOpened();
        this.opened = null;
    }
}

export const tabsManager = new TabsManager();