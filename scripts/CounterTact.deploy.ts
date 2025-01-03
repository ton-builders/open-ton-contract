import { toNano } from '@ton/core';
import { CounterTact } from '../wrappers/CounterTact';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const counterTact = provider.open(await CounterTact.fromInit(BigInt(Math.floor(Math.random() * 10000))));

    await counterTact.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(counterTact.address);

    console.log('ID', await counterTact.getId());
}
