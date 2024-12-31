import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type FirstDemoConfig = {};

export function firstDemoConfigToCell(config: FirstDemoConfig): Cell {
    return beginCell().endCell();
}

export class FirstDemo implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new FirstDemo(address);
    }

    static createFromConfig(config: FirstDemoConfig, code: Cell, workchain = 0) {
        const data = firstDemoConfigToCell(config);
        const init = { code, data };
        return new FirstDemo(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
