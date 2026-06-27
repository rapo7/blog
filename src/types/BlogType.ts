export interface Blog {
    id: string;
    body: string;
    data: {
        title: string;
        description: string;
        datetime: Date;
        image?: string;
    }
}
