import { ActionContext } from '..';
export declare const proxyMutation: ({ commit }: ActionContext, { type, payload }: {
    type: string;
    payload: any;
}) => Promise<void>;
