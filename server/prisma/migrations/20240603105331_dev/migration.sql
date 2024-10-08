-- CreateTable
CREATE TABLE "log" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "message" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "log_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
