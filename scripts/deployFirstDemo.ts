import { toNano } from '@ton/core';
import { FirstDemo } from '../wrappers/FirstDemo';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const firstDemo = provider.open(FirstDemo.createFromConfig({}, await compile('FirstDemo')));

    await firstDemo.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(firstDemo.address);

    // run methods on `firstDemo`
}
