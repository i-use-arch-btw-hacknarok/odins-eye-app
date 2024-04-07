import {ReadableStream} from 'web-streams-polyfill'
import Promise from 'promise';

declare var global: any;

global.Promise = Promise;
global.ReadableStream = ReadableStream;

require('promise/lib/rejection-tracking').enable({
    allRejections: true,
    onUnhandled: (id: any, error: any) => {
        // console.error("Unhandled promise rejection!", {id, error});
    },
});

if (typeof global.crypto !== 'object') {
    global.crypto = {
        getRandomValues: (array: any[]) => array.map(() => Math.floor(Math.random() * 256)),
    };
} else {
    require('react-native-get-random-values');
}
