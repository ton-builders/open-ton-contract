import { toNano } from '@ton/core';
import { CounterTolk } from '../wrappers/CounterTolk';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const opened = provider.open(
        CounterTolk.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                counter: 0,
            },
            await compile('CounterTolk'),
        ),
    );

    await opened.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(opened.address);

    console.log('ID', await opened.getID());
}
