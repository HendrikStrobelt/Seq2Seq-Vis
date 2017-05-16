/**
 * Created by hen on 5/15/17.
 */
class SimpleEventHandler {
    constructor(element) {
        this.element = element;
        this.eventListeners = []
    }


    bind(eventNames, eventFunction) {
        for (const eventName of eventNames.split(' ')) {
            this.eventListeners.push({eventName, eventFunction});
            const eventFunctionWrap = e => eventFunction(e.detail, e);
            this.element.addEventListener(eventName, eventFunctionWrap, false);
        }
    }

    getListeners() {
        return this.eventListeners;
    }

    trigger(eventName, detail) {
        this.element.dispatchEvent(new CustomEvent(eventName, {detail}));
    }

}