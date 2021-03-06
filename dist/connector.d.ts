import { Eos } from "./";
import { PositionsContract } from "./positions";
import { BalanceGetter } from "./balance";
import { GovernanceContract } from "./governance";
export declare class EosdtConnector {
    readonly eos: ReturnType<typeof Eos>;
    constructor(nodeAddress: string, privateKeys: string[]);
    getPositions(): PositionsContract;
    getBalances(): BalanceGetter;
    getGovernance(): GovernanceContract;
}
