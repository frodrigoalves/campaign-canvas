import { mockRequest } from "@/lib/api/client";
import { mockProducts } from "@/lib/mocks/products";
import type { ProductWithCommercial } from "@/types/product.types";

export const productService = {
  async searchBySeq(seq: string): Promise<ProductWithCommercial> {
    const cleaned = seq.trim();
    if (!cleaned) throw new Error("Informe um SEQPRODUTO ou COD PROD.");
    const match = mockProducts.find(
      (p) =>
        p.product.seqproduto === cleaned ||
        p.product.codProd.toLowerCase() === cleaned.toLowerCase(),
    );
    if (!match) {
      await mockRequest(null, 400);
      throw new Error(`Nenhum produto encontrado para "${cleaned}".`);
    }
    return mockRequest(match, 400);
  },
  async sample(): Promise<ProductWithCommercial[]> {
    return mockRequest(mockProducts.slice(0, 8));
  },
};
