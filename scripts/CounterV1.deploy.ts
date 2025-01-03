import { toNano } from '@ton/core';
import { CounterV1 } from '../wrappers/CounterV1';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const secondContract = provider.open(
        CounterV1.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                counter: 0,
            },
            await compile('CounterV1'),
        ),
    );

    await secondContract.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(secondContract.address);

    console.log('ID', await secondContract.getID());
}
