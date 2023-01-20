import { Response } from '@amplitude/types';
import { IncomingMessage } from 'http';
/**
 * Collects the invalid event indices off a HTTP API v2 response
 * and returns them in increasing order.
 *
 * @param response A Response from sending an event payload
 * @returns An concatenated array of indices
 */
export declare const collectInvalidEventIndices: (response: Response) => number[];
/**
 * Converts a http.IncomingMessage object into a Response object.
 *
 * @param httpRes The http response from the HTTP API.
 * @returns Response a nicely typed and cased response object.
 */
export declare const mapHttpMessageToResponse: (httpRes: IncomingMessage) => Response;
/**
 * Converts the response from the HTTP V2 API into a Response object.
 * Should be used only if we are pointed towards the v2 api.
 *
 * @param responseJSON The response body from the HTTP V2 API, as a JSON blob
 * @returns Response a nicely typed and cased response object.
 */
export declare const mapJSONToResponse: (responseJSON: any) => Response | null;
//# sourceMappingURL=response.d.ts.map