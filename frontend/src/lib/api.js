import axios from "axios";

export const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// attach admin token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mm_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchContent = () => api.get("/content").then((r) => r.data);
export const submitEnquiry = (payload) => api.post("/enquiries", payload).then((r) => r.data);
export const submitBooking = (payload) => api.post("/bookings", payload).then((r) => r.data);

export const adminLogin = (email, password) =>
  api.post("/admin/login", { email, password }).then((r) => r.data);
export const adminMe = () => api.get("/admin/me").then((r) => r.data);
export const adminEnquiries = () => api.get("/admin/enquiries").then((r) => r.data);
export const adminBookings = () => api.get("/admin/bookings").then((r) => r.data);
export const adminStats = () => api.get("/admin/stats").then((r) => r.data);
export const updateEnquiryStatus = (id, status) =>
  api.patch(`/admin/enquiries/${id}/status`, { status }).then((r) => r.data);
export const updateBookingStatus = (id, status) =>
  api.patch(`/admin/bookings/${id}/status`, { status }).then((r) => r.data);
