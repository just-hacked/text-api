-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "model" TEXT NOT NULL,
    "update" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "number" TEXT NOT NULL,
    "ip" TEXT NOT NULL DEFAULT 'Unknown',
    "zone" TEXT NOT NULL DEFAULT 'Unknown'
);
INSERT INTO "new_client" ("id", "model", "number", "update") SELECT "id", "model", "number", "update" FROM "client";
DROP TABLE "client";
ALTER TABLE "new_client" RENAME TO "client";
PRAGMA foreign_key_check("client");
PRAGMA foreign_keys=ON;
