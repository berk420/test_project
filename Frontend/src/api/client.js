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

function qs(params = {}) {
  const str = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== "" && v !== null))
  ).toString();
  return str ? "?" + str : "";
}

export const api = {
  // ── Categories ──
  getCategories: () => request("/api/categories"),

  // ── Clinics ──
  getClinics: (params = {}) => request(`/api/clinics${qs(params)}`),
  getClinic: (slug) => request(`/api/clinics/${slug}`),
  trackClick: (id) => request(`/api/clinics/${id}/click`, { method: "POST" }),

  // ── Leads ──
  createLead: (data) => request("/api/leads", { method: "POST", body: JSON.stringify(data) }),

  // ── Reviews ──
  getReviews: (clinicId) => request(`/api/reviews${qs({ clinicId })}`),
  createReview: (data) => request("/api/reviews", { method: "POST", body: JSON.stringify(data) }),
  getCasePhotos: (params = {}) => request(`/api/reviews/case-photos${qs(params)}`),

  // ── Campaigns ──
  getCampaigns: () => request("/api/campaigns"),
  getClinicCampaigns: (clinicId) => request(`/api/campaigns/clinic/${clinicId}`),

  // ── Blog ──
  getBlogPosts: (params = {}) => request(`/api/blog${qs(params)}`),
  getBlogPost: (slug) => request(`/api/blog/${slug}`),
  getTreatmentPages: () => request("/api/blog/treatments"),
  getTreatmentPage: (slug) => request(`/api/blog/treatments/${slug}`),
  getCityPages: () => request("/api/blog/cities"),
  getCityPage: (slug) => request(`/api/blog/cities/${slug}`),

  // ── AI ──
  aiMatch: (data) => request("/api/ai/match", { method: "POST", body: JSON.stringify(data) }),
  aiMatchScore: (data) => request("/api/ai/match-score", { method: "POST", body: JSON.stringify(data) }),
  priceEstimate: (data) => request("/api/ai/price-estimate", { method: "POST", body: JSON.stringify(data) }),
  secondOpinion: (data) => request("/api/ai/second-opinion", { method: "POST", body: JSON.stringify(data) }),
  onboarding: (data) => request("/api/ai/onboarding", { method: "POST", body: JSON.stringify(data) }),

  // ── Users ──
  register: (data) => request("/api/users/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data) => request("/api/users/login", { method: "POST", body: JSON.stringify(data) }),
  getProfile: (id) => request(`/api/users/${id}`),
  updateProfile: (id, data) => request(`/api/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  getFavorites: (id) => request(`/api/users/${id}/favorites`),
  toggleFavorite: (userId, clinicId) => request(`/api/users/${userId}/favorites/${clinicId}`, { method: "POST" }),
  getUserLeads: (id) => request(`/api/users/${id}/leads`),
  getNotifications: (id) => request(`/api/users/${id}/notifications`),

  // ── Clinic Panel ──
  getClinicDashboard: (id) => request(`/api/clinic-panel/${id}/dashboard`),
  getClinicLeads: (id, params = {}) => request(`/api/clinic-panel/${id}/leads${qs(params)}`),
  updateClinicProfile: (id, data) => request(`/api/clinic-panel/${id}/profile`, { method: "PUT", body: JSON.stringify(data) }),
  getClinicPriceRanges: (id) => request(`/api/clinic-panel/${id}/price-ranges`),

  // ── Admin ──
  getAdminStats: () => request("/api/admin/stats"),
  getAdminClinics: () => request("/api/admin/clinics"),
  getAdminLeads: (params = {}) => request(`/api/admin/leads${qs(params)}`),
  updateLeadStatus: (id, status) =>
    request(`/api/admin/leads/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  assignLead: (id, data) =>
    request(`/api/admin/leads/${id}/assign`, { method: "POST", body: JSON.stringify(data) }),
  addLeadNote: (id, data) =>
    request(`/api/admin/leads/${id}/notes`, { method: "POST", body: JSON.stringify(data) }),
  getLeadNotes: (id) => request(`/api/admin/leads/${id}/notes`),
  updateLeadTags: (id, tags) =>
    request(`/api/admin/leads/${id}/tags`, { method: "PATCH", body: JSON.stringify({ tags }) }),
  getAdminPerformance: () => request("/api/admin/performance"),
  getAdminBilling: (params = {}) => request(`/api/admin/billing${qs(params)}`),
  getAdminCampaigns: () => request("/api/admin/campaigns"),
  createAdminCampaign: (data) => request("/api/admin/campaigns", { method: "POST", body: JSON.stringify(data) }),
  getDynamicFields: () => request("/api/admin/dynamic-fields"),
  updateDynamicField: (id, data) =>
    request(`/api/admin/dynamic-fields/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  getFilters: () => request("/api/admin/filters"),
  updateFilter: (id, data) =>
    request(`/api/admin/filters/${id}`, { method: "PUT", body: JSON.stringify(data) }),
};
