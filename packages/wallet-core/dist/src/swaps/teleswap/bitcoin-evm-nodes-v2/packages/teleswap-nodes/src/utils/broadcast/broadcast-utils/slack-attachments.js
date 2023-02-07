"use strict";
function generateAttachment({ message, priority = 1, isError = false }) {
    const PRIORITY = ['Not Important', 'Normal', 'Warning', 'High', 'Very High'];
    const PRIORITY_COLOR = ['#B3B6B5', '#9FFF33', '#ffd400', '#FF9933', '#ff0000'];
    return [
        {
            color: PRIORITY_COLOR[priority],
            fields: [
                {
                    title: 'Priority',
                    value: PRIORITY[priority],
                    short: false,
                },
                {
                    title: isError ? 'Error' : 'Message',
                    value: message,
                    short: false,
                },
            ],
        },
    ];
}
module.exports = { generateAttachment };
//# sourceMappingURL=slack-attachments.js.map