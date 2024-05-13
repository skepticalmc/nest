export type ExternalBot = {
    id: string;
    name: string;
    enabled: boolean;
    published: boolean;
    teamId: string;
    createdBy: string;
    createdAt: string;
    deletedAt?: any;
    userId: string;
    iconUrl: string;
    internalBotId?: any;
};

export enum ErrorType {
    VOTE_TOO_EARLY = 1,
};