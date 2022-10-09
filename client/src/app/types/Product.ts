export interface Product {
  id: number;
  productName: string;
  productSlug: string;
  productDescription: string[];
  productPrice: number;
  productImage: string[];
  productCategory: string;
  productBrand: string;
  stockCount: number;
  createdAt: string;
  isStockAvailable: boolean;
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}

export interface Review {
  id: number;
  title: string;
  description: string;
  rating: string;
  createdAt: string;
  city: string;
  country: string;
}
