import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

const dbPath =
  path.join(
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

const rahulPassword =
  await bcrypt.hash(
    "rahul123",
    10
  );

const arjunPassword =
  await bcrypt.hash(
    "arjun123",
    10
  );


const now =
  new Date().toISOString();


const database = {

  users: [

    {
      id:
        "user_manager_001",

      name:
        "Operations Manager",

      email:
        "manager@fieldops.local",

      passwordHash:
        managerPassword,

      role:
        "manager",
    },

    {
      id:
        "user_agent_001",

      name:
        "Field Agent",

      email:
        "agent@fieldops.local",

      passwordHash:
        agentPassword,

      role:
        "agent",
    },

    {
      id:
        "user_agent_002",

      name:
        "Rahul Kumar",

      email:
        "rahul@fieldops.local",

      passwordHash:
        rahulPassword,

      role:
        "agent",
    },

    {
      id:
        "user_agent_003",

      name:
        "Arjun Rao",

      email:
        "arjun@fieldops.local",

      passwordHash:
        arjunPassword,

      role:
        "agent",
    },
  ],


  agents: [

    {
      id:
        "agent_001",

      userId:
        "user_agent_001",

      name:
        "Field Agent",

      email:
        "agent@fieldops.local",

      status:
        "available",

      latitude:
        12.9716,

      longitude:
        77.5946,

      locationConsent:
        true,

      lastLocationAt:
        now,
    },

    {
      id:
        "agent_002",

      userId:
        "user_agent_002",

      name:
        "Rahul Kumar",

      email:
        "rahul@fieldops.local",

      status:
        "available",

      latitude:
        12.9352,

      longitude:
        77.6245,

      locationConsent:
        true,

      lastLocationAt:
        now,
    },

    {
      id:
        "agent_003",

      userId:
        "user_agent_003",

      name:
        "Arjun Rao",

      email:
        "arjun@fieldops.local",

      status:
        "busy",

      latitude:
        12.9850,

      longitude:
        77.5630,

      locationConsent:
        true,

      lastLocationAt:
        now,
    },
  ],


  cases: [

    {
      id:
        "case_001",

      caseNumber:
        "FO-1001",

      customerName:
        "Ramesh Enterprises",

      phone:
        "+91 9000000001",

      address:
        "Koramangala, Bengaluru",

      latitude:
        12.9352,

      longitude:
        77.6245,

      amount:
        185000,

      priority:
        "high",

      status:
        "pending",

      assignedAgentId:
        null,

      checkedInAt:
        null,

      startedAt:
        null,

      completedAt:
        null,

      outcome:
        null,

      createdAt:
        now,

      updatedAt:
        now,
    },

    {
      id:
        "case_002",

      caseNumber:
        "FO-1002",

      customerName:
        "Priya Textiles",

      phone:
        "+91 9000000002",

      address:
        "Indiranagar, Bengaluru",

      latitude:
        12.9784,

      longitude:
        77.6408,

      amount:
        92000,

      priority:
        "medium",

      status:
        "pending",

      assignedAgentId:
        null,

      checkedInAt:
        null,

      startedAt:
        null,

      completedAt:
        null,

      outcome:
        null,

      createdAt:
        now,

      updatedAt:
        now,
    },

    {
      id:
        "case_003",

      caseNumber:
        "FO-1003",

      customerName:
        "Kumar Auto Works",

      phone:
        "+91 9000000003",

      address:
        "Rajajinagar, Bengaluru",

      latitude:
        12.9910,

      longitude:
        77.5520,

      amount:
        245000,

      priority:
        "critical",

      status:
        "pending",

      assignedAgentId:
        null,

      checkedInAt:
        null,

      startedAt:
        null,

      completedAt:
        null,

      outcome:
        null,

      createdAt:
        now,

      updatedAt:
        now,
    },
  ],


  assignments: [],

  locations: [],

  fieldUpdates: [],

  evidence: [],

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
  "======================================"
);

console.log(
  " FieldOps database seeded"
);

console.log(
  "======================================"
);

console.log(
  "Manager:"
);

console.log(
  "manager@fieldops.local / manager123"
);

console.log("");

console.log(
  "Agents:"
);

console.log(
  "agent@fieldops.local / agent123"
);

console.log(
  "rahul@fieldops.local / rahul123"
);

console.log(
  "arjun@fieldops.local / arjun123"
);

console.log("");

console.log(
  "Cases: 3"
);

console.log(
  "Agents: 3"
);

console.log(
  "======================================"
);