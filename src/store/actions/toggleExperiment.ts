import { ActionContext, rootActionContext } from '..';
import { ExperimentType } from '../types';

export const toggleExperiment = (context: ActionContext, { name }: { name: ExperimentType }) => {
  const { commit } = rootActionContext(context);
  commit.TOGGLE_EXPERIMENT({ name });
};
