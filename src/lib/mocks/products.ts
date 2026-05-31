import type { Product, ProductCommercialData, ProductWithCommercial } from "@/types/product.types";

const DEPARTMENTS = ["Bazar", "Mercearia", "FLV", "Higiene", "Bebidas"];
const SUPPLIERS = ["Unilever", "Nestlé", "Ambev", "P&G", "JBS", "BRF", "Coca-Cola FEMSA", "Pepsico"];
const FAMILIES: Record<string, string[]> = {
  Bazar: ["Limpeza Lar", "Utilidades", "Pet"],
  Mercearia: ["Massas", "Conservas", "Café"],
  FLV: ["Frutas", "Legumes", "Verduras"],
  Higiene: ["Cabelo", "Boca", "Corpo"],
  Bebidas: ["Cervejas", "Refrigerantes", "Sucos"],
};
const PRODUCT_NAMES: Record<string, string[]> = {
  Bazar: ["Detergente Líquido 500ml", "Esponja Multiuso", "Vassoura Cerdas Duras", "Ração Premium 15kg", "Sacola Reutilizável"],
  Mercearia: ["Macarrão Espaguete 500g", "Molho de Tomate 340g", "Café Torrado 500g", "Arroz Tipo 1 5kg", "Feijão Carioca 1kg"],
  FLV: ["Banana Prata kg", "Tomate Italiano kg", "Alface Crespa un", "Cenoura kg", "Batata Inglesa kg"],
  Higiene: ["Shampoo Anticaspa 400ml", "Creme Dental 90g", "Sabonete Líquido 250ml", "Desodorante Aerosol 150ml", "Condicionador 400ml"],
  Bebidas: ["Cerveja Pilsen Lata 350ml", "Refrigerante Cola 2L", "Suco Néctar Uva 1L", "Água Mineral 500ml", "Energético Lata 269ml"],
};

function pseudoRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export const mockProducts: ProductWithCommercial[] = (() => {
  const items: ProductWithCommercial[] = [];
  let idx = 0;
  for (const dept of DEPARTMENTS) {
    for (let i = 0; i < 6; i++) {
      idx++;
      const rand = pseudoRandom(idx * 31);
      const seq = String(10000000 + idx * 137).padStart(8, "0");
      const family = FAMILIES[dept][i % FAMILIES[dept].length];
      const name = PRODUCT_NAMES[dept][i % PRODUCT_NAMES[dept].length];
      const supplier = SUPPLIERS[Math.floor(rand() * SUPPLIERS.length)];
      const product: Product = {
        id: `p-${idx}`,
        seqproduto: seq,
        codProd: `CP${String(idx).padStart(5, "0")}`,
        description: name,
        descriptionErp: name.toUpperCase() + " ERP",
        familyCode: `F${String(idx).padStart(3, "0")}`,
        familyName: family,
        department: dept,
        supplier,
      };
      const pmz = +(2 + rand() * 18).toFixed(2);
      const salePrice = +(pmz * (1.2 + rand() * 0.4)).toFixed(2);
      const competitor = +(salePrice * (0.85 + rand() * 0.25)).toFixed(2);
      const commercial: ProductCommercialData = {
        productId: product.id,
        filial: "01 - Matriz BH",
        pmz,
        salePrice,
        abcCurve: (["A", "B", "C"] as const)[Math.floor(rand() * 3)],
        storeRole: rand() > 0.5 ? "Destino" : "Conveniência",
        salesTrend: rand() > 0.5 ? "Crescente" : "Estável",
        priceSensitivity: (["high", "medium", "low"] as const)[Math.floor(rand() * 3)],
        lifecycle: "Maturidade",
        stockQty: Math.floor(50 + rand() * 950),
        avgSales30d: Math.floor(20 + rand() * 400),
        lowestCompetitorPrice90d: competitor,
        competitorResearchDate: "2025-01-12",
        competitorName: ["Supermercado Verde", "Atacadão Norte", "Hiper Plus"][Math.floor(rand() * 3)],
      };
      items.push({ product, commercial });
    }
  }
  return items;
})();
