-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_request" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "request" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "request_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_request" ("clientId", "date", "id", "request") SELECT "clientId", "date", "id", "request" FROM "request";
DROP TABLE "request";
ALTER TABLE "new_request" RENAME TO "request";
PRAGMA foreign_key_check("request");
PRAGMA foreign_keys=ON;
