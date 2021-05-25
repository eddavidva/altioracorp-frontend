
export class Order{
    constructor(
        public IdOrder: number,
        public IdClient: number,
        public CreatedAt: string,
        public ModifiedAt: string
    ){}
}