import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(
  __dirname,
  "data",
  "db.json"
);


const managerPassword =
  await bcrypt.hash(
    "manager123",
    10
  );

const agentPassword =
  await bcrypt.hash(
    "agent123",
    10
  );


const database = {
  users: [
    {
      id: "user_manager_001",
      name: "Operations Manager",
      email: "manager@fieldops.local",
      passwordHash: managerPassword,
      role: "manager",
    },

    {
      id: "user_agent_001",
      name: "Field Agent",
      email: "agent@fieldops.local",
      passwordHash: agentPassword,
      role: "agent",
    },
  ],

  agents: [],

  cases: [],

  assignments: [],

  locations: [],

  fieldUpdates: [],

  activity: [],
};


fs.writeFileSync(
  dbPath,
  JSON.stringify(
    database,
    null,
    2
  )
);


console.log(
  "Demo users created successfully."
);

console.log(
  "Manager: manager@fieldops.local / manager123"
);

console.log(
  "Agent: agent@fieldops.local / agent123"
);