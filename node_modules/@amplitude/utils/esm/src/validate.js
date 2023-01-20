import { logger } from './logger';
export var isValidEvent = function (event) {
    if (typeof event.event_type !== 'string') {
        logger.warn('Invalid event: expected string for event_type field');
        return false;
    }
    var hasDeviceId = event.device_id !== undefined;
    var hasUserId = event.user_id !== undefined;
    var hasEventProperties = event.event_properties !== undefined;
    if (!hasDeviceId && !hasUserId) {
        logger.warn('Invalid event: expected at least one of device or user id');
        return false;
    }
    if (hasDeviceId && typeof event.device_id !== 'string') {
        logger.warn('Invalid event: expected device id to be a string if present');
        return false;
    }
    if (hasUserId && typeof event.user_id !== 'string') {
        logger.warn('Invalid event: expected user id to be a string if present');
        return false;
    }
    if (hasEventProperties && typeof event.event_properties !== 'object') {
        logger.warn('Invalid event properties: expected event properties to be type object');
        return false;
    }
    return true;
};
//# sourceMappingURL=validate.js.map