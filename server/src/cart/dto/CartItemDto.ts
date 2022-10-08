import { IsNotEmpty, IsNumber } from "class-validator";

export class CartItemDto{
    
    @IsNotEmpty()
    @IsNumber()
    id: number

    @IsNotEmpty()
    productName: string

    @IsNotEmpty()
    @IsNumber()
    productPrice: number

    @IsNotEmpty()
    productImage: string
    @IsNotEmpty()
    productSlug: string
}