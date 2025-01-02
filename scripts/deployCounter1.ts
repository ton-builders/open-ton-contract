import { toNano } from '@ton/core';
import { Counter1 } from '../wrappers/Counter1';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const secondContract = provider.open(
        Counter1.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                counter: 0,
            },
            await compile('Counter1'),
        ),
    );

    await secondContract.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(secondContract.address);

    console.log('ID', await secondContract.getID());
}
