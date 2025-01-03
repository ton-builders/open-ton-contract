import { NetworkProvider, sleep } from '@ton/blueprint';
import { Address, toNano } from '@ton/core';
import { CounterV2 } from '../wrappers/CounterV2';

// EQAM8QqkBeiFJqsS3NPJe_jh9IqCetEMncSkFrBVmHU3qAiw
export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    let address = Address.parse(args.length > 0 ? args[0] : await ui.input('Contract address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write('Error, contract not found.');
        return;
    }

    // 如果不是部署，不需要合约代码，只需要 address 就好
    let opened = provider.open(CounterV2.createFromAddress(address));

    let before = await opened.getCounter();

    await opened.sendIncrease(provider.sender(), { increaseBy: 100, value: toNano('0.05') });

    ui.write('增加 100 ');

    let after = await opened.getCounter();

    let attempt = 1;
    while (after === before) {
        ui.setActionPrompt(`Attempt ${attempt}`);
        await sleep(2000);
        after = await opened.getCounter();
        attempt++;
    }

    ui.clearActionPrompt();
    ui.write(`Counter increased from ${before} to ${after}`);
}
