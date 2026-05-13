export interface Collaborator {
        id: string;
        fullName: string;
        document: string;
        position: string;
        area: string;
        }

export interface EntryRecord {
        id: string;
        collaboratorId: string;
        collaboratorName: string;
        collaboratorDocument: string;
        objectName: string;
        objectDescription: string;
        category: string;
        photo?: string;
        signature: string;
        entryDate: string;
        entryTime: string;
        notes: string;
        exitDate?: string;
        exitTime?: string;
        status?: string;
}