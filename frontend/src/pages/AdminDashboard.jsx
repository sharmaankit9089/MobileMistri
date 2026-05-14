import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminBookings, adminEnquiries, adminMe, adminStats, updateEnquiryStatus, updateBookingStatus } from "../lib/api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { LogOut, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const STATUS_OPTIONS = ["new", "contacted", "converted", "lost"];
const STATUS_COLOR = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  contacted: "bg-amber-50 text-amber-700 border-amber-200",
  converted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  lost: "bg-zinc-100 text-zinc-600 border-zinc-200",
};

function StatusCell({ value, onChange, testid }) {
  return (
    <select
      value={value || "new"}
      onChange={(e) => onChange(e.target.value)}
      data-testid={testid}
      className={`text-xs px-2.5 py-1 rounded-full border font-semibold capitalize cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#002FA7] ${STATUS_COLOR[value] || STATUS_COLOR.new}`}
    >
      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}

function Table({ items, cols, testidPrefix, onStatusChange }) {
  if (!items?.length) return <div className="p-10 text-center text-slate-500">No records yet.</div>;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
            {cols.map((c) => <th key={c.key} className="px-4 py-3 text-left font-semibold">{c.label}</th>)}
            <th className="px-4 py-3 text-left font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {items.map((it) => (
            <tr key={it.id} className="hover:bg-slate-50" data-testid={`${testidPrefix}-row-${it.id}`}>
              {cols.map((c) => (
                <td key={c.key} className="px-4 py-3 align-top text-slate-700">
                  {c.render ? c.render(it) : (it[c.key] || "-")}
                </td>
              ))}
              <td className="px-4 py-3 align-top">
                <StatusCell
                  value={it.status}
                  testid={`${testidPrefix}-status-${it.id}`}
                  onChange={(v) => onStatusChange(it.id, v)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [stats, setStats] = useState({ enquiries: 0, bookings: 0, new_enquiries: 0 });
  const [enquiries, setEnquiries] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const [m, s, e, b] = await Promise.all([adminMe(), adminStats(), adminEnquiries(), adminBookings()]);
      setMe(m); setStats(s); setEnquiries(e); setBookings(b);
    } catch (err) {
      localStorage.removeItem("mm_admin_token");
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const logout = () => {
    localStorage.removeItem("mm_admin_token");
    localStorage.removeItem("mm_admin_email");
    navigate("/admin/login");
  };

  const changeEnquiryStatus = async (id, status) => {
    setEnquiries((arr) => arr.map((x) => (x.id === id ? { ...x, status } : x)));
    try {
      await updateEnquiryStatus(id, status);
      toast.success(`Enquiry marked as ${status}`);
    } catch {
      toast.error("Could not update status");
      load();
    }
  };

  const changeBookingStatus = async (id, status) => {
    setBookings((arr) => arr.map((x) => (x.id === id ? { ...x, status } : x)));
    try {
      await updateBookingStatus(id, status);
      toast.success(`Booking marked as ${status}`);
    } catch {
      toast.error("Could not update status");
      load();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="label-kicker">Control room</div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-[color:var(--mm-navy)] mt-1">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Signed in as {me?.email || "…"}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} disabled={loading} data-testid="admin-refresh-btn"><RefreshCw className="h-4 w-4 mr-1" /> Refresh</Button>
          <Button variant="outline" onClick={logout} data-testid="admin-logout-btn"><LogOut className="h-4 w-4 mr-1" /> Log out</Button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { k: "enquiries", l: "Total enquiries" },
          { k: "bookings", l: "Total bookings" },
          { k: "new_enquiries", l: "New enquiries" },
        ].map((s) => (
          <div key={s.k} className="mm-card p-6">
            <div className="label-kicker">{s.l}</div>
            <div className="mt-2 font-display text-4xl font-semibold text-[color:var(--mm-navy)]">{stats[s.k]}</div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Tabs defaultValue="enquiries">
          <TabsList>
            <TabsTrigger value="enquiries" data-testid="admin-tab-enquiries">Enquiries ({enquiries.length})</TabsTrigger>
            <TabsTrigger value="bookings" data-testid="admin-tab-bookings">Bookings ({bookings.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="enquiries" className="mt-6 mm-card p-0 overflow-hidden">
            <Table
              items={enquiries}
              testidPrefix="admin-enq"
              onStatusChange={changeEnquiryStatus}
              cols={[
                { key: "created_at", label: "When", render: (x) => new Date(x.created_at).toLocaleString("en-IN") },
                { key: "name", label: "Name" },
                { key: "phone", label: "Phone" },
                { key: "city", label: "City" },
                { key: "brand", label: "Brand" },
                { key: "model", label: "Model" },
                { key: "issue", label: "Issue" },
                { key: "source", label: "Source" },
              ]}
            />
          </TabsContent>
          <TabsContent value="bookings" className="mt-6 mm-card p-0 overflow-hidden">
            <Table
              items={bookings}
              testidPrefix="admin-book"
              onStatusChange={changeBookingStatus}
              cols={[
                { key: "created_at", label: "When", render: (x) => new Date(x.created_at).toLocaleString("en-IN") },
                { key: "name", label: "Name" },
                { key: "phone", label: "Phone" },
                { key: "pincode", label: "Pincode" },
                { key: "city", label: "City" },
                { key: "brand", label: "Brand" },
                { key: "model", label: "Model" },
                { key: "issue", label: "Issue" },
                { key: "preferred_slot", label: "Slot" },
              ]}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
