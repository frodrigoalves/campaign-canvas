-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'BUYER',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "storeId" TEXT,
    "allowedStores" TEXT,
    "allowedClusters" TEXT,
    "allowedCategories" TEXT,
    "lastAccess" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "stores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "clusterId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "clusters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "deadlines" TEXT,
    "totalSlots" INTEGER NOT NULL DEFAULT 0,
    "filledSlots" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "campaign_buyers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "campaign_buyers_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "campaign_buyers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "pages_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "modules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pageId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "slotCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "modules_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "pages" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "slots" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "moduleId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "buyerId" TEXT,
    "categoryId" TEXT,
    "priority" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'EMPTY',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "slots_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "promotional_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "productSeqproduto" TEXT NOT NULL,
    "descriptionErp" TEXT NOT NULL,
    "descriptionNewspaper" TEXT NOT NULL,
    "offerType" TEXT NOT NULL DEFAULT 'SIMPLE_PRICE',
    "exposureType" TEXT NOT NULL DEFAULT 'SINGLE',
    "sellOutValue" REAL,
    "sellOutAgreementNumber" TEXT,
    "insertValue" REAL,
    "insertBoxAgreementNumber" TEXT,
    "promotionalPrice" REAL NOT NULL,
    "pmzNew" REAL NOT NULL,
    "offerMarginPercent" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "promotional_items_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "promotional_items_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "slots" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seqproduto" TEXT NOT NULL,
    "codProd" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionErp" TEXT NOT NULL,
    "familyCode" TEXT NOT NULL,
    "familyName" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "product_commercial_data" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "filial" TEXT NOT NULL,
    "pmz" REAL NOT NULL,
    "salePrice" REAL NOT NULL,
    "abcCurve" TEXT NOT NULL,
    "storeRole" TEXT NOT NULL,
    "salesTrend" TEXT NOT NULL,
    "priceSensitivity" TEXT NOT NULL,
    "lifecycle" TEXT NOT NULL,
    "stockQty" INTEGER NOT NULL,
    "avgSales30d" INTEGER NOT NULL,
    "lowestCompetitorPrice90d" REAL,
    "competitorResearchDate" DATETIME,
    "competitorName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "product_commercial_data_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "reason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "stores_code_key" ON "stores"("code");

-- CreateIndex
CREATE UNIQUE INDEX "clusters_code_key" ON "clusters"("code");

-- CreateIndex
CREATE UNIQUE INDEX "campaigns_code_key" ON "campaigns"("code");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_buyers_campaignId_userId_key" ON "campaign_buyers"("campaignId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "promotional_items_slotId_key" ON "promotional_items"("slotId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_seqproduto_key" ON "Product"("seqproduto");

-- CreateIndex
CREATE UNIQUE INDEX "product_commercial_data_productId_filial_key" ON "product_commercial_data"("productId", "filial");
