
import { WebSocketLink } from '@apollo/client/link/ws';
import {
    createClient,
    defaultExchanges,
    subscriptionExchange
} from 'urql';

const url = 'https://react.eogresources.com/graphql';
const wsUrl = 'wss://react.eogresources.com/graphql';

const ws = new WebSocketLink({
    uri: wsUrl,
    options: {
        reconnect: true,
        timeout: 1000
    }
});

export const client = createClient({
    url,
    exchanges: [
        ...defaultExchanges,
        subscriptionExchange({
            forwardSubscription: (op: any) => ws.request(op) as any
        })
    ]
});
