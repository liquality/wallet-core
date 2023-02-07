export function generateAttachment({ message, priority, isError }: {
    message: any;
    priority?: number | undefined;
    isError?: boolean | undefined;
}): {
    color: string;
    fields: {
        title: string;
        value: any;
        short: boolean;
    }[];
}[];
