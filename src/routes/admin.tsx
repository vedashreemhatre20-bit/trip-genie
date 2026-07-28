import { createFileRoute } from "@tanstack/react-router";
import { AdminRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import {
  Shield,
  Users,
  MapPin,
  TrendingUp,
  Search,
  RefreshCw,
  Loader2,
  LogOut,
  Home,
  ChevronRight,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Super Admin — TripAI" },
      { name: "description", content: "TripAI Super Admin Panel" },
    ],
  }),
});

type UserRecord = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  user_metadata: {
    full_name?: string;
    role?: string;
  };
};

function AdminPage() {
  return (
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  );
}

function AdminDashboard() {
  const { user, signOut } = useAuth();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "users">("overview");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Note: This requires admin privileges or a server-side function
      // For now, we'll use the auth admin API if available
      const { data, error } = await supabase.auth.admin.listUsers();
      if (error) {
        console.error("Error fetching users:", error);
        // Fallback: show current user only
        if (user) {
          setUsers([
            {
              id: user.id,
              email: user.email || "",
              created_at: user.created_at,
              last_sign_in_at: user.last_sign_in_at || null,
              user_metadata: user.user_metadata as UserRecord["user_metadata"],
            },
          ]);
        }
      } else {
        setUsers(
          (data?.users || []).map((u) => ({
            id: u.id,
            email: u.email || "",
            created_at: u.created_at,
            last_sign_in_at: u.last_sign_in_at || null,
            user_metadata: u.user_metadata as UserRecord["user_metadata"],
          }))
        );
      }
    } catch {
      // If admin API is not available, show current user
      if (user) {
        setUsers([
          {
            id: user.id,
            email: user.email || "",
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at || null,
            user_metadata: user.user_metadata as UserRecord["user_metadata"],
          },
        ]);
      }
    }
    setLoading(false);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.user_metadata?.full_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalUsers: users.length,
    activeToday: users.filter((u) => {
      if (!u.last_sign_in_at) return false;
      const today = new Date().toDateString();
      return new Date(u.last_sign_in_at).toDateString() === today;
    }).length,
    newThisWeek: users.filter((u) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(u.created_at) > weekAgo;
    }).length,
    admins: users.filter((u) => u.user_metadata?.role === "super_admin").length,
  };

  return (
    <div className="min-h-screen">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary shadow-glow">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Super Admin</h1>
              <p className="text-xs text-muted-foreground">TripAI Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-xl glass px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Home className="h-4 w-4" /> App
            </Link>
            <button
              onClick={signOut}
              className="flex items-center gap-2 rounded-xl glass px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-6 md:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">Admin Dashboard</span>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "overview"
                ? "bg-gradient-primary text-white shadow-glow"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "users"
                ? "bg-gradient-primary text-white shadow-glow"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            Users
          </button>
        </div>

        {activeTab === "overview" && (
          <>
            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={<Users className="h-5 w-5" />}
                label="Total Users"
                value={stats.totalUsers}
                color="primary"
              />
              <StatCard
                icon={<TrendingUp className="h-5 w-5" />}
                label="Active Today"
                value={stats.activeToday}
                color="gold"
              />
              <StatCard
                icon={<MapPin className="h-5 w-5" />}
                label="New This Week"
                value={stats.newThisWeek}
                color="primary"
              />
              <StatCard
                icon={<Shield className="h-5 w-5" />}
                label="Admins"
                value={stats.admins}
                color="gold"
              />
            </div>

            {/* Recent Users */}
            <div className="mt-8">
              <h2 className="mb-4 text-xl font-bold">Recent Signups</h2>
              <div className="glass-strong rounded-2xl overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {users.slice(0, 5).map((u) => (
                      <div key={u.id} className="flex items-center gap-4 px-5 py-4">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5 text-sm font-bold">
                          {(u.user_metadata?.full_name || u.email)[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium">
                            {u.user_metadata?.full_name || "No name"}
                          </div>
                          <div className="truncate text-xs text-muted-foreground">{u.email}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(u.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                    {users.length === 0 && (
                      <div className="px-5 py-10 text-center text-muted-foreground">
                        No users found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "users" && (
          <div>
            {/* Search & Refresh */}
            <div className="mb-4 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users by name or email..."
                  className="w-full rounded-xl glass px-10 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/60 placeholder:text-muted-foreground"
                />
              </div>
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="grid h-11 w-11 place-items-center rounded-xl glass hover:bg-accent/40"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>

            {/* Users Table */}
            <div className="glass-strong rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-5 py-3 text-left font-medium text-muted-foreground">User</th>
                      <th className="px-5 py-3 text-left font-medium text-muted-foreground">Email</th>
                      <th className="px-5 py-3 text-left font-medium text-muted-foreground">Role</th>
                      <th className="px-5 py-3 text-left font-medium text-muted-foreground">Joined</th>
                      <th className="px-5 py-3 text-left font-medium text-muted-foreground">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-10 text-center">
                          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-white/5">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/5 text-xs font-bold">
                                {(u.user_metadata?.full_name || u.email)[0]?.toUpperCase()}
                              </div>
                              <span className="font-medium">
                                {u.user_metadata?.full_name || "No name"}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                          <td className="px-5 py-3">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                u.user_metadata?.role === "super_admin"
                                  ? "bg-gradient-gold text-[oklch(0.15_0.05_265)]"
                                  : "bg-white/10 text-muted-foreground"
                              }`}
                            >
                              {u.user_metadata?.role === "super_admin" ? "Admin" : "User"}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-muted-foreground">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-3 text-muted-foreground">
                            {u.last_sign_in_at
                              ? new Date(u.last_sign_in_at).toLocaleDateString()
                              : "Never"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "primary" | "gold";
}) {
  return (
    <div className="glass-strong rounded-2xl p-5">
      <div className="flex items-center gap-3">
        <div
          className={`grid h-10 w-10 place-items-center rounded-xl ${
            color === "primary" ? "bg-gradient-primary shadow-glow" : "bg-gradient-gold"
          }`}
        >
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </div>
    </div>
  );
}