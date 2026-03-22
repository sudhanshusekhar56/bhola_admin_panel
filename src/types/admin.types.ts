export interface AdminLoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken?: string
  token?: string
  user?: {
    id: string
    email?: string
    role?: string
  }
}

export interface DashboardSummary {
  users: number
  revenue: number
  realTimeBookings: number
  virtualBookings: number
}

export interface SettlementRequest {
  panditId: string
  amount: number
}

export interface CouponRequest {
  code: string
  discountPercent: number
}

export interface NewsletterRequest {
  message: string
}

export interface MandirRequest {
  name: string
  city: string
  state: string
  description: string
  howToReach?: string
}

export interface PujaRequest {
  mandirId: string
  name: string
  description: string
  amount: number
  isVirtualAvailable: boolean
}
