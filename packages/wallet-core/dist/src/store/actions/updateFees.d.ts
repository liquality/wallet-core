import { FeeDetails } from '@chainify/types';
import { ActionContext } from '..';
import { Asset } from '../types';
export declare const updateFees: (context: ActionContext, { asset }: {
    asset: Asset;
}) => Promise<FeeDetails>;
