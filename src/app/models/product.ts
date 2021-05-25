export class Product{
    constructor(
        public IdProduct: number,
        public Code: string,
        public Name: string,
        public Price: number,
        public CreatedAt: string,
        public ModifiedAt: string
    ){}
}