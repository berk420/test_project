const BASE = "https://api.testprocess.com.tr";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // Categories
  getCategories: () => request("/api/categories"),

  // Clinics
  getClinics: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== "" && v !== null))
    ).toString();
    return request(`/api/clinics${qs ? "?" + qs : ""}`);
  },
  getClinic: (slug) => request(`/api/clinics/${slug}`),
  trackClick: (id) => request(`/api/clinics/${id}/click`, { method: "POST" }),

  // Leads
  createLead: (data) => request("/api/leads", { method: "POST", body: JSON.stringify(data) }),

  // Admin
  getAdminStats: () => request("/api/admin/stats"),
  getAdminClinics: () => request("/api/admin/clinics"),
  getAdminLeads: (params = {}) => {
    const qs = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v))).toString();
    return request(`/api/admin/leads${qs ? "?" + qs : ""}`);
  },
  updateLeadStatus: (id, status) =>
    request(`/api/admin/leads/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  getDynamicFields: () => request("/api/admin/dynamic-fields"),
  updateDynamicField: (id, data) =>
    request(`/api/admin/dynamic-fields/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  getFilters: () => request("/api/admin/filters"),
  updateFilter: (id, data) =>
    request(`/api/admin/filters/${id}`, { method: "PUT", body: JSON.stringify(data) }),
};
