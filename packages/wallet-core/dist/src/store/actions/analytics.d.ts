import amplitude from 'amplitude-js';
import { ActionContext } from '..';
import { AnalyticsState } from '../types';
export interface AmplitudeProperties {
    category?: string;
    action?: string;
    label?: string;
    [key: string]: any;
}
export declare const initializeAnalyticsPreferences: (context: ActionContext, { accepted }: {
    accepted: boolean;
}) => void;
export declare const updateAnalyticsPreferences: (context: ActionContext, payload: AnalyticsState) => void;
export declare const setAnalyticsResponse: (context: ActionContext, { accepted }: {
    accepted: boolean;
}) => Promise<void>;
export declare const initializeAnalytics: (context: ActionContext) => Promise<boolean>;
export declare const trackAnalytics: (context: ActionContext, { event, properties }: {
    event: string;
    properties: AmplitudeProperties;
}) => amplitude.LogReturn;
