// Weights from the project report (sum = 1.0). Change them here only.
export const WEIGHTS = {
  category: 0.30,
  budget: 0.20,
  location: 0.20,
  urgency: 0.15,
  beneficiary: 0.15,
};

const LEVEL = { low: 1, medium: 2, high: 3 };

// City to state, so "same state" can score 0.5
const CITY_STATE = {
  vellore: "tamil nadu",
  chennai: "tamil nadu",
  bengaluru: "karnataka",
  bangalore: "karnataka",
};

const stateOf = (place) => {
  const p = (place || "").trim().toLowerCase();
  return CITY_STATE[p] || p;
};

function categoryScore(pref, cause) {
  return pref === cause.category ? 1 : 0;
}

function budgetScore(budget, cause) {
  const remaining = Math.max(cause.targetAmount - cause.raisedAmount, 1);
  return Math.min(budget, remaining) / Math.max(budget, remaining);
}

function locationScore(pref, cause) {
  const a = pref.trim().toLowerCase();
  const b = (cause.location || "").trim().toLowerCase();
  if (!a || !b) return 0;
  if (a === b || b.includes(a) || a.includes(b)) return 1;
  return stateOf(a) === stateOf(b) ? 0.5 : 0;
}

function urgencyScore(pref, cause) {
  const diff = Math.abs(
    (LEVEL[pref.toLowerCase()] || 0) - (LEVEL[(cause.urgency || "").toLowerCase()] || 0)
  );
  return diff === 0 ? 1 : diff === 1 ? 0.5 : 0;
}

function beneficiaryScore(pref, cause) {
  return pref === cause.beneficiary ? 1 : 0;
}

/**
 * prefs: { category, budget, location, urgency, beneficiary }
 * Blank preferences are ignored and the remaining weights are
 * rescaled, so skipping a field never inflates or hurts the score.
 */
export function matchCauses(prefs, causes) {
  const budget = Number(prefs.budget);

  const active = {
    category: !!prefs.category,
    budget: budget > 0,
    location: !!prefs.location.trim(),
    urgency: !!prefs.urgency,
    beneficiary: !!prefs.beneficiary,
  };

  const totalWeight = Object.keys(active)
    .filter((k) => active[k])
    .reduce((sum, k) => sum + WEIGHTS[k], 0);

  if (totalWeight === 0) return [];

  return causes
    .map((cause) => {
      const parts = {
        category: active.category ? categoryScore(prefs.category, cause) : null,
        budget: active.budget ? budgetScore(budget, cause) : null,
        location: active.location ? locationScore(prefs.location, cause) : null,
        urgency: active.urgency ? urgencyScore(prefs.urgency, cause) : null,
        beneficiary: active.beneficiary ? beneficiaryScore(prefs.beneficiary, cause) : null,
      };

      const weighted = Object.keys(parts)
        .filter((k) => parts[k] !== null)
        .reduce((sum, k) => sum + WEIGHTS[k] * parts[k], 0);

      return {
        ...cause,
        matchScore: Math.round((weighted / totalWeight) * 100),
        breakdown: parts, // each value 0 to 1, or null if not used
      };
    })
    .filter((c) => c.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}