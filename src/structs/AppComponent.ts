import { Component } from 'vue';

import { event } from '@/structs/logEvents';

type AppComponent = Component & {
    emitLogEvent: (event: event) => void;
}

export default AppComponent;
