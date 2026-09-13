import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      <AdminSidebar userName={session.user.name ?? "Admin"} />
      <main className="flex-1 bg-ocean-50/50 p-5 dark:bg-ocean-950 sm:p-8">{children}</main>
    </div>
  );
}
