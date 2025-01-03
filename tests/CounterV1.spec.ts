import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { CounterV1 } from '../wrappers/CounterV1';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('Counter1', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('CounterV1');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let counterV1SandBoxWrapped: SandboxContract<CounterV1>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        counterV1SandBoxWrapped = blockchain.openContract(
            CounterV1.createFromConfig(
                {
                    id: 0,
                    counter: 0,
                },
                code,
            ),
        );

        deployer = await blockchain.treasury('deployer');

        const deployResult = await counterV1SandBoxWrapped.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: counterV1SandBoxWrapped.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and counterV2 are ready to use
    });

    it('should increase counter', async () => {
        const increaseTimes = 1;
        for (let i = 0; i < increaseTimes; i++) {
            console.log(`increase ${i + 1}/${increaseTimes}`);

            const operator = await blockchain.treasury('operator' + i);

            const counterBefore = await counterV1SandBoxWrapped.getCounter();

            console.log('counter before increasing', counterBefore);

            const increaseBy = Math.floor(Math.random() * 100);

            console.log('increasing by', increaseBy);

            const increaseResult = await counterV1SandBoxWrapped.sendIncrease(operator.getSender(), {
                increaseBy,
                value: toNano('0.05'),
            });

            console.info(increaseResult.transactions);

            expect(increaseResult.transactions).toHaveTransaction({
                from: operator.address,
                to: counterV1SandBoxWrapped.address,
                success: true,
            });

            const counterAfter = await counterV1SandBoxWrapped.getCounter();

            console.log('counter after increasing', counterAfter);

            expect(counterAfter).toBe(counterBefore + increaseBy);
        }
    });
});
