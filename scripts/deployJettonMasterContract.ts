import { compile, NetworkProvider } from '@ton/blueprint';
import { JettonMasterFuncContract } from '../wrappers/JettonMasterFuncContract';
import { Address, beginCell, toNano } from '@ton/core';

const contentUrl = 'https://raw.githubusercontent.com/ton-builders/open-ton-contract/refs/heads/main/master.json';
const formatUrl =
    'https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#jetton-metadata-example-offchain';
const exampleContent = {
    name: 'Sample Jetton',
    description: 'Sample of Jetton',
    symbol: 'JTN',
    decimals: 0,
    image: 'https://www.svgrepo.com/download/483336/coin-vector.svg',
};

export type JettonMinterContent = {
    // 0 onchain  1: offchain
    type: 0 | 1;
    uri: string;
};
export function jettonContentToCell(content: JettonMinterContent) {
    return beginCell()
        .storeUint(content.type, 8)
        .storeStringTail(content.uri) //Snake logic under the hood
        .endCell();
}

export async function run(provider: NetworkProvider) {
    let admin = Address.parse('0QAAQ3X8LZ3qmwnIgaXwgysWnBBBE8T26G8B4iQ4-PHDGHQC');

    const content = jettonContentToCell({ type: 1, uri: contentUrl });

    const master_code = await compile('JettonMasterFuncContract');
    const wallet_code = await compile('JettonWalletFuncContract');

    let master = provider.open(JettonMasterFuncContract.createFromConfig({ admin, content, wallet_code }, master_code));

    await master.sendDeploy(provider.sender(), toNano('0.05'));
    await provider.waitForDeploy(master.address);
}
