const defaultCauses = [
  { id: 1, name: "Education Support for Children", category: "Education", location: "Vellore",
    description: "Provides educational materials, school support, and learning resources for children.",
    targetAmount: 50000, raisedAmount: 32500, urgency: "High", beneficiary: "Children", status: "VERIFIED" },
  { id: 2, name: "Medical Assistance Program", category: "Healthcare", location: "Chennai",
    description: "Supports medical treatment and healthcare expenses for people in need.",
    targetAmount: 100000, raisedAmount: 64000, urgency: "High", beneficiary: "Patients", status: "VERIFIED" },
  { id: 3, name: "Food Support for Families", category: "Food", location: "Vellore",
    description: "Provides essential food supplies to families facing financial difficulties.",
    targetAmount: 40000, raisedAmount: 28000, urgency: "Medium", beneficiary: "Families", status: "VERIFIED" },
  { id: 4, name: "Clean Water Initiative", category: "Environment", location: "Tamil Nadu",
    description: "Supports access to clean and safe drinking water in underserved communities.",
    targetAmount: 75000, raisedAmount: 41000, urgency: "Medium", beneficiary: "Communities", status: "VERIFIED" },
  { id: 5, name: "Support for Elderly People", category: "Elderly Care", location: "Bengaluru",
    description: "Provides essential supplies and support services for elderly people.",
    targetAmount: 60000, raisedAmount: 39000, urgency: "Low", beneficiary: "Elderly", status: "VERIFIED" },
];

function read(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// Always reads fresh data, so pages update after donations and approvals.
export function getCauses() {
  const charity = read("charityCauses", []).map((c) => ({
    ...c,
    status: c.status ?? "PENDING", // submitted causes wait for admin approval
  }));
  const raised = read("causeRaisedAmounts", {});

  return [...defaultCauses, ...charity].map((c) => ({
    ...c,
    raisedAmount: raised[c.id] !== undefined ? raised[c.id] : c.raisedAmount,
  }));
}

export function getVerifiedCauses() {
  return getCauses().filter((c) => c.status === "VERIFIED");
}

// Used by the collector when submitting a cause
export function addCause(cause) {
  const list = read("charityCauses", []);
  const newCause = { ...cause, id: Date.now(), raisedAmount: 0, status: "PENDING" };
  write("charityCauses", [...list, newCause]);
  return newCause;
}

// Used by the admin to approve or reject
export function updateCauseStatus(id, status, adminNote = "") {
  const list = read("charityCauses", []).map((c) =>
    c.id === id ? { ...c, status, adminNote } : c
  );
  write("charityCauses", list);
}

// Kept so old imports don't break
// All causes submitted by collectors (any status), used by the admin page
export function getSubmittedCauses() {
  const ids = new Set(read("charityCauses", []).map((c) => c.id));
  return getCauses().filter((c) => ids.has(c.id));
}
export default getCauses();