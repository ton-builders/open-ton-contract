import { toNano } from '@ton/core';
import { CounterV1 } from '../wrappers/CounterV1';
import { compile, NetworkProvider } from '@ton/blueprint';

// EQD2nDqPncJyho6YAUHbvsOuQOFo-5kO7ShfYjbqdLmaP3Ni
export async function run(provider: NetworkProvider) {
    const opened = provider.open(
        CounterV1.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                counter: 10000,
            },
            await compile('CounterV1'),
        ),
    );

    await opened.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(opened.address);

    console.log('ID', await opened.getID());
}
