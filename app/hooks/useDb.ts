import { useSQLiteContext } from "expo-sqlite";

type Migration = {
  id: number;
  name: string;
  up: string;
  down: string;
};

const migrations: Migration[] = [
  {
    id: 1,
    name: "initial",
    up: `CREATE TABLE IF NOT EXISTS "deviceMetadata" (
      "key" TEXT PRIMARY KEY,
      "value" TEXT NOT NULL
      );`,
    down: `DROP TABLE "deviceMetadata";`,
  },
];

export function useDb() {
  const db = useSQLiteContext();
  const table = "migrations";

  // Create a database table for migrations meta data if it doesn't exist
  db.execSync(`CREATE TABLE IF NOT EXISTS "${table}" (
    id   INTEGER PRIMARY KEY,
    name TEXT    NOT NULL,
    up   TEXT    NOT NULL,
    down TEXT    NOT NULL
  )`);

  // Get the list of already applied migrations
  let dbMigrations = db.getAllSync<Migration>(
    `SELECT id, name, up, down FROM "${table}" ORDER BY id ASC`,
  );

  // Undo migrations that exist only in the database but not in the code.
  const lastMigration = migrations[migrations.length - 1];
  for (const migration of dbMigrations
    .slice()
    .sort((a, b) => Math.sign(b.id - a.id))) {
    if (!migrations.some((x) => x.id === migration.id)) {
      db.execSync("BEGIN");
      try {
        db.execSync(migration.down);
        db.runSync(`DELETE FROM "${table}" WHERE id = ?`, migration.id);
        db.execSync("COMMIT");
        dbMigrations = dbMigrations.filter((x) => x.id !== migration.id);
      } catch (err) {
        db.execSync("ROLLBACK");
        throw err;
      }
    } else {
      break;
    }
  }

  // Apply pending migrations
  const lastMigrationId = dbMigrations.length
    ? dbMigrations[dbMigrations.length - 1].id
    : 0;
  for (const migration of migrations) {
    if (migration.id > lastMigrationId) {
      db.execSync("BEGIN");
      try {
        db.execSync(migration.up);
        db.runSync(
          `INSERT INTO "${table}" (id, name, up, down) VALUES (?, ?, ?, ?)`,
          migration.id,
          migration.name,
          migration.up,
          migration.down,
        );
        db.execSync("COMMIT");
      } catch (err) {
        db.execSync("ROLLBACK");
        throw err;
      }
    }
  }
  return db;
}
