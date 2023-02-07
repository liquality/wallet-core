import { ActionContext } from '..';
import { ExperimentType } from '../types';
export declare const toggleExperiment: (context: ActionContext, { name }: {
    name: ExperimentType;
}) => void;
