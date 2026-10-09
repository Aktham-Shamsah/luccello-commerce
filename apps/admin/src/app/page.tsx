import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminDashboard } from "../components/AdminDashboard";
import { ADMIN_COOKIE, isValidAdminSession } from "../lib/admin-auth";

export default async function AdminHome() {
  const cookieStore = await cookies();
  if (!isValidAdminSession(cookieStore.get(ADMIN_COOKIE)?.value)) redirect("/login");
  return <AdminDashboard />;
}
