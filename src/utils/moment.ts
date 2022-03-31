import moment from 'moment';

// @ts-ignore
// TODO: Does this work on react native?
const locale = window.navigator.userLanguage || window.navigator.language;
moment.locale(locale);

export default moment;
