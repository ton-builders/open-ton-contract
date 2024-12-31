import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { FirstDemo } from '../wrappers/FirstDemo';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('FirstDemo', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('FirstDemo');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let firstDemo: SandboxContract<FirstDemo>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        firstDemo = blockchain.openContract(FirstDemo.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await firstDemo.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: firstDemo.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and firstDemo are ready to use
    });
});
