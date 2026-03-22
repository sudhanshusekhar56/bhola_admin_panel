import { api } from "./api"

import type {
  CouponRequest,
  MandirRequest,
  NewsletterRequest,
  PujaRequest,
  SettlementRequest,
} from "@/types/admin.types"

/* Dashboard */

export const getDashboard = async () => {
  const res = await api.get("/dashboard")
  return res.data
}

/* Bookings */

export const getBookings = async () => {
  const res = await api.get("/bookings")
  return res.data
}

export const assignPandit = async (bookingId: string, panditId: string) => {
  const res = await api.patch(`/bookings/${bookingId}/assign-pandit`, {
    panditId,
  })

  return res.data
}

/* Users */

export const getUsers = async () => {
  const res = await api.get("/users")
  return res.data
}

export const getUserBookings = async (userId: string) => {
  const res = await api.get(`/users/${userId}/bookings`)
  return res.data
}

export const blockUser = async (userId: string) => {
  const res = await api.patch(`/users/${userId}/block`, {})
  return res.data
}

export const unblockUser = async (userId: string) => {
  const res = await api.patch(`/users/${userId}/unblock`, {})
  return res.data
}

/* Pandits */

export const getPandits = async () => {
  const res = await api.get("/pandits")
  return res.data
}

export const approvePandit = async (panditId: string) => {
  const res = await api.patch(`/pandits/${panditId}/approve`, {})
  return res.data
}

export const rejectPandit = async (panditId: string) => {
  const res = await api.patch(`/pandits/${panditId}/reject`, {})
  return res.data
}

/* Mandirs */

export const createMandir = async (payload: MandirRequest) => {
  const res = await api.post("/mandirs", payload)
  return res.data
}

export const updateMandir = async (
  mandirId: string,
  payload: MandirRequest
) => {
  const res = await api.patch(`/mandirs/${mandirId}`, payload)
  return res.data
}

export const removeMandir = async (mandirId: string) => {
  const res = await api.delete(`/mandirs/${mandirId}`)
  return res.data
}

/* Pujas */

export const createPuja = async (payload: PujaRequest) => {
  const res = await api.post("/pujas", payload)
  return res.data
}

export const updatePuja = async (pujaId: string, payload: PujaRequest) => {
  const res = await api.patch(`/pujas/${pujaId}`, payload)
  return res.data
}

/* Finance */

export const getFinanceSummary = async () => {
  const res = await api.get("/finance/summary")
  return res.data
}

export const createSettlement = async (payload: SettlementRequest) => {
  const res = await api.post("/finance/settlements", payload)
  return res.data
}

export const createRefund = async (bookingId: string) => {
  const res = await api.post(`/finance/refunds/${bookingId}`, {})
  return res.data
}

/* Coupons */

export const getCoupons = async () => {
  const res = await api.get("/coupons")
  return res.data
}

export const createCoupon = async (payload: CouponRequest) => {
  const res = await api.post("/coupons", payload)
  return res.data
}

/* Catalog */

export const getMandirsCatalog = async () => {
  const res = await api.get("/mandirs/catalog")
  return res.data
}

export const getPujasCatalog = async () => {
  const res = await api.get("/pujas/catalog")
  return res.data
}

/* Analytics */

export const exportAnalytics = async (format: "csv" | "excel") => {
  const res = await api.get("/analytics/export", {
    params: { format },
    responseType: "blob",
  })

  return res.data
}

/* Marketing */

export const createNewsletter = async (payload: NewsletterRequest) => {
  const res = await api.post("/marketing/newsletter", payload)
  return res.data
}

/* Virtual Darshan */

export const closeVirtualOrder = async (bookingId: string) => {
  const res = await api.patch(`/virtual-darshan/${bookingId}/close`, {})
  return res.data
}
