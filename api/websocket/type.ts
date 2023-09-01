export namespace TypeWebSocket {
    export interface UploadAvatar {
        file: File;
        filename: string;
    }

    export interface Join {
        name: string;
        pos: number;
        cash: number;
        avatar: string;
    }

    export interface PutOther {
        putId: string;
        putCash: number;
    }

    export interface ChangePos {
        pos: number;
    }

    export interface SendOther {
        recipientId: string;
        recipientCash: number;
    }
}
