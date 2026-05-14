import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../lib/api";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { Loader2, LockKeyhole } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminLogin(email, password);
      localStorage.setItem("mm_admin_token", res.access_token);
      localStorage.setItem("mm_admin_email", res.email);
      toast.success("Welcome back");
      navigate("/admin");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md mm-card p-8">
        <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(11,27,61,0.08)" }}>
          <LockKeyhole className="h-5 w-5 text-[color:var(--mm-navy)]" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-semibold text-[color:var(--mm-navy)]">Admin sign in</h1>
        <p className="mt-1 text-sm text-slate-500">MobileMistri internal dashboard.</p>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required data-testid="admin-login-email" />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required data-testid="admin-login-password" />
          </div>
          <Button type="submit" className="w-full mm-btn-primary justify-center" disabled={loading} data-testid="admin-login-submit">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
