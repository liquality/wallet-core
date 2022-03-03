import { emitter } from '../utils';

export const replyPermission = async ({ dispatch }, { request, allowed }) => {
  const response = { allowed };
  if (allowed) {
    try {
      // @ts-ignore
      response.result = await dispatch('executeRequest', { request });
    } catch (error) {
      // @ts-ignore
      response.error = error.message;
    }
  }

  emitter.$emit(`permission:${request.id}`, response);

  return response;
};
