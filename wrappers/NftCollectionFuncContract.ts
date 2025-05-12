import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type NftConnectionConfig = {
    owner_address: Address;
    next_item_index: number;
    content: Cell;
    nft_item_code: Cell;
    royalty_params: Cell;
};

export function configToCell(config: NftConnectionConfig): Cell {
    // TODO
    return beginCell()
        .endCell();
}

export class NftCollectionFuncContract implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new NftCollectionFuncContract(address);
    }

    static createFromConfig(config: NftConnectionConfig, code: Cell, workchain = 0) {
        const data = configToCell(config);
        const init = { code, data };
        return new NftCollectionFuncContract(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
