// This must be imported before `nanoid`
import "react-native-get-random-values";
// All other imports
import { useSQLiteContext } from "expo-sqlite";
import { customAlphabet } from "nanoid";
import { useDb } from "./useDb";

const generateDeviceId = customAlphabet(
  "aBcDeFgHiJkLmNoPqRsTuVwXyZ01234567890",
  5,
);

type Metadata = {
  key: string;
  value: string;
};

export function useDeviceId() {
  const db = useDb();
  const deviceMetadata = db.getAllSync<Metadata>(
    "SELECT * FROM deviceMetadata;",
  );
  const metadata = Object.fromEntries(
    deviceMetadata.map(({ key, value }) => [key, value]),
  );
  if (!metadata || !metadata.deviceId) {
    const newId = generateDeviceId();
    db.execSync(
      `INSERT INTO deviceMetadata (key, value) VALUES ("deviceId", '${newId}');`,
    );
    return newId;
  }
  return metadata.deviceId;
}
