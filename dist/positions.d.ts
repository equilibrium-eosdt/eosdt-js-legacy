import BigNumber from "bignumber.js";
import { EosdtContractParameters, EosdtContractSettings, TokenRate, EosdtPosition } from "./interfaces/positions-contract";
import { EosdtConnectorInterface } from "./interfaces/connector";
export declare class PositionsContract {
    private contractName;
    private eos;
    constructor(connector: EosdtConnectorInterface);
    private getOptions;
    create(accountName: string, eosAmount: string | number | BigNumber, eosdtAmount: string | number | BigNumber): Promise<any>;
    close(senderAccount: string, positionId: number): Promise<any>;
    del(creator: string, positionId: number): Promise<any>;
    give(account: string, receiver: string, positionId: number): Promise<any>;
    addCollateral(account: string, amount: string | number | BigNumber, positionId: number): Promise<any>;
    deleteCollateral(sender: string, amount: string | number | BigNumber, positionId: number): Promise<any>;
    generateDebt(account: string, amount: string | number | BigNumber, positionId: number): Promise<any>;
    burnbackDebt(account: string, amount: string | number | BigNumber, positionId: number): Promise<any>;
    marginCall(senderAccount: string, positionId: number): Promise<any>;
    getContractEosAmount(): Promise<number>;
    getRates(): Promise<TokenRate[]>;
    getPositionById(id: number): Promise<EosdtPosition | undefined>;
    getAllUserPositions(maker: string): Promise<EosdtPosition[]>;
    getParameters(): Promise<EosdtContractParameters>;
    getSettings(): Promise<EosdtContractSettings>;
}
