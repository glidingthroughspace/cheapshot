// This must be imported before `nanoid`
import "react-native-get-random-values";
// All other imports
import { useSQLiteContext } from "expo-sqlite";
import { customAlphabet } from "nanoid";

const generateDeviceId = customAlphabet(
  "aBcDeFgHiJkLmNoPqRsTuVwXyZ01234567890",
  5
);

type Metadata = {
  schema_version: number;
  device_id: string;
};

export function useDeviceId() {
  const db = useSQLiteContext();
  db.execSync(`CREATE TABLE IF NOT EXISTS metadata (
      schema_version INTEGER,
      device_id TEXT);
  `);
  const metadata = db.getFirstSync<Metadata>("SELECT * FROM metadata;");
  if (!metadata) {
    const newId = generateDeviceId();
    db.execSync(
      `INSERT INTO metadata (schema_version, device_id) VALUES (1, '${newId}');`
    );
    return newId;
  }
  return metadata["device_id"];
}
