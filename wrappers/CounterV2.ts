import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender } from '@ton/core';
import { SendMode } from '@ton/core/src/types/SendMode';

export type CounterV2Config = {
    id: number;
    counter: number;
};

export function config2Cell(config: CounterV2Config): Cell {
    return beginCell().storeUint(config.id, 32).storeUint(config.counter, 32).endCell();
}

export const Opcodes = {
    increase: 0x7e8764ef,
    decrease: 0xe78525c4,
};

export class CounterV2 implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new CounterV2(address);
    }

    static createFromConfig(config: CounterV2Config, code: Cell, workchain = 0) {
        const data = config2Cell(config);
        const init = { code, data };
        return new CounterV2(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        // args: {
        // value: bigint | string,
        // bounce?: Maybe<boolean>,
        // sendMode?: SendMode,
        // body?: Maybe<Cell | string>
        // }
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });

        // Note：
        //
        // 在 blueprint 的源代码 WrappedContractProvider 中
        // 会把合约的 init(code,data) 附带上去，从而可以部署合约。
        //
        //  如何合约已经部署，这个方法就是一个普通的转账。
        //
        // return await via.send({
        //     to: this.#address,
        //     value: typeof args.value === 'string' ? toNano(args.value) : args.value,
        //     sendMode: args.sendMode,
        //     bounce: args.bounce,
        //     init,
        //     body: typeof args.body === 'string' ? comment(args.body) : args.body,
        // });
        //
    }

    async sendIncrease(
        provider: ContractProvider,
        via: Sender,
        opts: {
            increaseBy: number;
            value: bigint;
            queryID?: number;
        },
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.increase, 32)
                .storeUint(opts.queryID ?? 0, 64)
                .storeUint(opts.increaseBy, 32)
                .endCell(),
        });
    }

    async getCounter(provider: ContractProvider) {
        let result = await provider.get('get_counter', []);
        return result.stack.readNumber();
    }

    async getId(provider: ContractProvider) {
        let result = await provider.get('get_id', []);
        return result.stack.readNumber();
    }
}
