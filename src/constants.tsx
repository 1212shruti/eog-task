
import { Provider, createClient, useQuery } from 'urql';

export const client = createClient({
    url: 'https://react.eogresources.com/graphql',
});
