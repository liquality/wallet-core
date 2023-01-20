import { Token } from '@lifi/types';
import { Signer } from 'ethers';
import { RevokeTokenData } from '../types';
export interface ApproveTokenRequest {
    signer: Signer;
    token: Token;
    approvalAddress: string;
    amount: string;
    infiniteApproval?: boolean;
}
export interface RevokeApprovalRequest {
    signer: Signer;
    token: Token;
    approvalAddress: string;
}
export declare const getTokenApproval: (signer: Signer, token: Token, approvalAddress: string) => Promise<string | undefined>;
export declare const bulkGetTokenApproval: (signer: Signer, tokenData: RevokeTokenData[]) => Promise<{
    token: Token;
    approval: string | undefined;
}[]>;
export declare const approveToken: ({ signer, token, approvalAddress, amount, infiniteApproval, }: ApproveTokenRequest) => Promise<void>;
export declare const revokeTokenApproval: ({ signer, token, approvalAddress, }: RevokeApprovalRequest) => Promise<void>;
