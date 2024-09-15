-- CreateTable
CREATE TABLE "data" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    CONSTRAINT "data_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "request" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
