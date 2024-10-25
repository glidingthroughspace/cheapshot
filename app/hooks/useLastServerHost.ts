// This must be imported before `nanoid`
import "react-native-get-random-values";
// All other imports
import { useSQLiteContext } from "expo-sqlite";
import { customAlphabet } from "nanoid";

const generateDeviceId = customAlphabet(
  "aBcDeFgHiJkLmNoPqRsTuVwXyZ01234567890",
  5
);

type Settings = {
  last_server_host: string;
};

export function useLastServerHost(): [string, (host: string) => void] {
  const db = useSQLiteContext();
  function setLastServerHost(host: string) {
    db.execSync(
      `INSERT OR REPLACE INTO settings (last_server_host) VALUES ('${host}');`
    );
  }
  db.execSync(`CREATE TABLE IF NOT EXISTS settings (
      last_server_host TEXT);
  `);
  const settings = db.getFirstSync<Settings>("SELECT * FROM settings;");
  if (!settings) {
    return ["", setLastServerHost];
  }
  return [settings["last_server_host"], setLastServerHost];
}
