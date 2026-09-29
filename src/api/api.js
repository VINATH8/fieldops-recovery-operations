import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("fieldops_token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (
      typeof FormData !== "undefined" &&
      config.data instanceof FormData
    ) {
      if (config.headers) {
        delete config.headers["Content-Type"];
        delete config.headers["content-type"];
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("fieldops_token");
      localStorage.removeItem("fieldops_user");
    }

    return Promise.reject(error);
  }
);

export async function login(email, password) {
  const response = await API.post("/auth/login", {
    email,
    password,
  });

  return response.data;
}

export async function register(
  nameOrData,
  email,
  password,
  role,
  managerSignupKey
) {
  let registrationData;

  if (
    typeof nameOrData === "object" &&
    nameOrData !== null
  ) {
    registrationData = {
      name: nameOrData?.name || "",
      email: nameOrData?.email || "",
      password: nameOrData?.password || "",
      role: nameOrData?.role || "agent",
      managerSignupKey:
        nameOrData?.managerSignupKey || "",
    };
  } else {
    registrationData = {
      name: nameOrData || "",
      email: email || "",
      password: password || "",
      role: role || "agent",
      managerSignupKey: managerSignupKey || "",
    };
  }

  registrationData.name = String(
    registrationData.name || ""
  ).trim();

  registrationData.email = String(
    registrationData.email || ""
  )
    .trim()
    .toLowerCase();

  registrationData.password = String(
    registrationData.password || ""
  );

  registrationData.role =
    registrationData.role === "manager"
      ? "manager"
      : "agent";

  registrationData.managerSignupKey = String(
    registrationData.managerSignupKey || ""
  ).trim();

  if (
    !registrationData.name ||
    !registrationData.email ||
    !registrationData.password
  ) {
    throw new Error(
      "Name, email and password are required."
    );
  }

  const response = await API.post(
    "/auth/register",
    registrationData
  );

  return response.data;
}

export function saveSession(token, user) {
  localStorage.setItem("fieldops_token", token);
  localStorage.setItem(
    "fieldops_user",
    JSON.stringify(user)
  );
}

export function getSession() {
  const token =
    localStorage.getItem("fieldops_token");

  const storedUser =
    localStorage.getItem("fieldops_user");

  let user = null;

  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch {
      localStorage.removeItem("fieldops_user");
    }
  }

  return {
    token,
    user,
  };
}

export function getCurrentUser() {
  const storedUser =
    localStorage.getItem("fieldops_user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("fieldops_user");
    return null;
  }
}

export function logout() {
  localStorage.removeItem("fieldops_token");
  localStorage.removeItem("fieldops_user");
}

export async function getManagerDashboard() {
  const response = await API.get(
    "/manager/dashboard"
  );

  return response.data;
}

export async function getManagerCases() {
  const response = await API.get(
    "/manager/cases"
  );

  return response.data;
}

export const getRecoveryCases =
  getManagerCases;

export async function createRecoveryCase(caseData) {
  const payload = {
    customerName:
      caseData?.customerName || "",

    phone:
      caseData?.phone || "",

    address:
      caseData?.address || "",

    amount: Number(
      caseData?.amount || 0
    ),

    priority:
      caseData?.priority || "medium",

    status:
      caseData?.status || "new",

    agentId:
      caseData?.agentId || null,
  };

  const response = await API.post(
    "/manager/cases",
    payload
  );

  return response.data;
}

export async function deleteRecoveryCase(caseId) {
  const response = await API.delete(
    `/manager/cases/${caseId}`
  );

  return response.data;
}

export async function getManagerAgents() {
  const response = await API.get(
    "/manager/agents"
  );

  return response.data;
}

export const getFieldAgents =
  getManagerAgents;

export async function assignAgentToLocation(
  agentId,
  address
) {
  if (!agentId) {
    throw new Error("Agent ID is required.");
  }

  if (!address?.trim()) {
    throw new Error(
      "Destination address is required."
    );
  }

  const response = await API.post(
    "/manager/agent-assignments",
    {
      agentId,
      address: address.trim(),
    }
  );

  return response.data;
}

export async function getAgentLocationAssignments() {
  const response = await API.get(
    "/manager/agent-assignments"
  );

  return response.data;
}

export async function findNearestAgent(caseId) {
  const response = await API.get(
    `/manager/cases/${caseId}/nearest-agent`
  );

  return response.data;
}

export async function assignNearestAgent(caseId) {
  const response = await API.post(
    `/manager/cases/${caseId}/assign-nearest`
  );

  return response.data;
}

export async function assignAgent(
  caseId,
  agentId
) {
  if (!caseId) {
    throw new Error("Case ID is required.");
  }

  if (!agentId) {
    throw new Error("Agent ID is required.");
  }

  const response = await API.post(
    `/manager/cases/${caseId}/assign`,
    {
      agentId,
    }
  );

  return response.data;
}

export async function unassignCase(caseId) {
  const response = await API.post(
    `/manager/cases/${caseId}/unassign`
  );

  return response.data;
}

export async function getReports() {
  const response = await API.get(
    "/manager/reports"
  );

  return response.data;
}

export async function getAgentDashboard() {
  const response = await API.get(
    "/agent/dashboard"
  );

  return response.data;
}

export async function getAgentCases() {
  const response = await API.get(
    "/agent/cases"
  );

  return response.data;
}

export async function getAgentCase(caseId) {
  const response = await API.get(
    `/agent/cases/${caseId}`
  );

  return response.data;
}

export async function updateAgentLocation(
  latitude,
  longitude,
  accuracy
) {
  const response = await API.post(
    "/agent/location",
    {
      latitude,
      longitude,
      accuracy,
    }
  );

  return response.data;
}

export async function setLocationConsent(enabled) {
  const response = await API.post(
    "/agent/location/consent",
    {
      enabled,
    }
  );

  return response.data;
}

export async function getRoute(caseId) {
  const response = await API.get(
    `/agent/cases/${caseId}/route`
  );

  return response.data;
}

export async function checkIn(
  caseId,
  latitude,
  longitude
) {
  const response = await API.post(
    `/agent/cases/${caseId}/check-in`,
    {
      latitude,
      longitude,
    }
  );

  return response.data;
}

export async function createFieldUpdate(
  caseId,
  updateData
) {
  if (!caseId) {
    throw new Error("Case ID is required.");
  }

  const payload = {
    notes: updateData?.notes || "",
    outcome: updateData?.outcome || "",
  };

  const response = await API.post(
    `/agent/cases/${caseId}/updates`,
    payload
  );

  return response.data;
}

export const submitFieldUpdate =
  createFieldUpdate;

export async function uploadEvidence(
  caseId,
  file
) {
  if (!caseId) {
    throw new Error("Case ID is required.");
  }

  if (!file) {
    throw new Error(
      "Evidence file is required."
    );
  }

  if (
    typeof File !== "undefined" &&
    !(file instanceof File)
  ) {
    throw new Error(
      "Invalid evidence file."
    );
  }

  const formData = new FormData();

  formData.append(
    "evidence",
    file,
    file.name
  );

  const response = await API.post(
    `/agent/cases/${caseId}/evidence`,
    formData
  );

  return response.data;
}

export async function completeCase(
  caseId,
  outcome,
  notes
) {
  const response = await API.post(
    `/agent/cases/${caseId}/complete`,
    {
      outcome,
      notes,
    }
  );

  return response.data;
}

export async function getManagerConversations() {
  const response = await API.get(
    "/messages/conversations"
  );

  return response.data;
}

export async function getManagerMessages(agentId) {
  const response = await API.get(
    `/messages/agent/${agentId}`
  );

  return response.data;
}

export async function sendManagerMessage(
  agentId,
  message
) {
  const response = await API.post(
    `/messages/agent/${agentId}`,
    {
      message,
    }
  );

  return response.data;
}

export async function getAgentMessages() {
  const response = await API.get(
    "/messages/manager"
  );

  return response.data;
}

export async function sendAgentMessage(message) {
  const response = await API.post(
    "/messages/manager",
    {
      message,
    }
  );

  return response.data;
}

export default API;