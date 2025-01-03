import { Address, toNano } from '@ton/core';
import { CounterV1 } from '../wrappers/CounterV1';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Contract address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const opened = provider.open(CounterV1.createFromAddress(address));

    const before = await opened.getCounter();

    await opened.sendIncrease(provider.sender(), {
        increaseBy: 123,
        value: toNano('0.05'),
    });

    ui.write('Waiting for counter to increase...');

    let after = await opened.getCounter();
    let attempt = 1;
    while (after === before) {
        ui.setActionPrompt(`Attempt ${attempt}`);
        await sleep(2000);
        after = await opened.getCounter();
        attempt++;
    }

    ui.clearActionPrompt();
    ui.write('Counter increased successfully!');
    ui.write(`Counter increased from ${before} to ${after}`);
}
