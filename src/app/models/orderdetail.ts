export class OrderDetail{
    constructor(
        public IdOrderDetail: number,
        public IdOrder: number,
        public IdProduct: number,
        public Amount: number,
        public Total: number
    ){}
}