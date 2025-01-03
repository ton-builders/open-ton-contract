import { toNano } from '@ton/core';
import { CounterV2 } from '../wrappers/CounterV2';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    let contract = CounterV2.createFromConfig(
        {
            id: Math.floor(Math.random() * 10000),
            counter: 20000,
        },
        await compile('CounterV2'),
    );
    const opened = provider.open(contract);

    await opened.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(opened.address);

    console.log('getCounter: ', await opened.getCounter());
}
