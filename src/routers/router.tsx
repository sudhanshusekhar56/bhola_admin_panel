import { Routes, Route } from "react-router-dom";

import LoginPage from "@/pages/auth/loginPage";

import CouponsPage from "@/pages/coupons/CouponsPage";
import FinancePage from "@/pages/finance/FinancePage";
import MandirsPage from "@/pages/mandirs/MandirsPage";
import UsersPage from "@/pages/users/UsersPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import BookingsPage from "@/pages/bookings/BookingsPage";
import PanditsPage from "@/pages/pandits/PanditsPage";
import PujasPage from "@/pages/pujas/PujasPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={<DashboardPage />} />
      <Route path="/mandirs" element={<MandirsPage />} />
      <Route path="/coupons" element={<CouponsPage />} />
      <Route path="/finance" element={<FinancePage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/bookings" element={<BookingsPage />} />
      <Route path="/pandits" element={<PanditsPage />} />
      <Route path="/pujas" element={<PujasPage />} />
    </Routes>
  );
}
