import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);


const dbPath =
  path.join(
    __dirname,
    "..",
    "data",
    "db.json"
  );


export function readDatabase() {

  if (
    !fs.existsSync(
      dbPath
    )
  ) {

    throw new Error(
      "Database file not found."
    );

  }


  const database =
    JSON.parse(
      fs.readFileSync(
        dbPath,
        "utf-8"
      )
    );


  /* =====================================================
     ALWAYS ENSURE COLLECTIONS EXIST
  ===================================================== */

  const collections = [
    "users",
    "agents",
    "cases",
    "assignments",
    "locations",
    "fieldUpdates",
    "evidence",
    "activity",
    "messages",
  ];


  for (
    const collection of collections
  ) {

    if (
      !Array.isArray(
        database[collection]
      )
    ) {

      database[collection] =
        [];

    }

  }


  return database;
}


export function writeDatabase(
  database
) {

  fs.writeFileSync(
    dbPath,
    JSON.stringify(
      database,
      null,
      2
    ),
    "utf-8"
  );

}


export function generateId(
  prefix
) {

  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 8)}`;

}