import { useState } from "react";
import { submitEnquiry } from "../lib/api";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { useContent } from "../lib/content";

export default function InlineEnquiryForm() {
  const { content } = useContent();
  const [form, setForm] = useState({ name: "", phone: "", brand: "", model: "", issue: "", custom_model: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const selectedBrand = content?.brands?.find((b) => b.slug === form.brand);
  const isOtherModel = form.model === "Other model (specify)";

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Name and phone are required"); return;
    }
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      toast.error("Enter a valid 10-digit Indian mobile number"); return;
    }
    setSubmitting(true);
    try {
      await submitEnquiry({
        name: form.name,
        phone: form.phone,
        brand: form.brand,
        model: isOtherModel && form.custom_model ? form.custom_model : form.model,
        issue: form.issue,
        source: "hero-inline",
      });
      setDone(true);
      toast.success("Request received. We'll call you in minutes.");
      setTimeout(() => {
        const text = `*Hi MobileMistri, I need a repair.*\n
*Name:* ${form.name}
*Phone:* ${form.phone}
*Device:* ${form.brand} ${isOtherModel && form.custom_model ? form.custom_model : form.model}
*Issue:* ${form.issue}`;
        window.location.href = `https://wa.me/919650061347?text=${encodeURIComponent(text)}`;
      }, 1500);
    } catch {
      toast.error("Could not submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-xl bg-green-50 border border-green-200 p-5 text-sm text-green-900" data-testid="inline-enquiry-success">
        ✓ Got it, {form.name.split(" ")[0] || "there"}! A MobileMistri expert will call you on <b>+91 {form.phone}</b> within minutes.
      </div>
    );
  }

  return (
    <form className="grid grid-cols-1 sm:grid-cols-2 gap-3" onSubmit={submit} data-testid="inline-enquiry-form">
      <input
        className="h-12 px-4 border border-zinc-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#002FA7] transition-colors"
        placeholder="Your Name *" required
        data-testid="inline-inquiry-name"
        value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="h-12 px-4 border border-zinc-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#002FA7] transition-colors"
        placeholder="Phone Number *" required type="tel" maxLength={10}
        data-testid="inline-inquiry-phone"
        value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <select
        className="h-12 px-4 border border-zinc-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#002FA7] transition-colors"
        value={form.brand}
        onChange={(e) => setForm({ ...form, brand: e.target.value, model: "" })}
        data-testid="inline-inquiry-brand"
      >
        <option value="">Select Brand</option>
        {content?.brands?.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}
      </select>
      <select
        className="h-12 px-4 border border-zinc-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#002FA7] transition-colors disabled:opacity-60"
        value={form.model}
        disabled={!selectedBrand}
        onChange={(e) => setForm({ ...form, model: e.target.value })}
        data-testid="inline-inquiry-model"
      >
        <option value="">Select Model</option>
        {selectedBrand?.models?.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
      {isOtherModel && (
        <input
          className="sm:col-span-2 h-12 px-4 border border-zinc-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#002FA7] transition-colors"
          placeholder="Type your model (e.g. Vivo V30 Pro) *"
          data-testid="inline-inquiry-custom-model"
          value={form.custom_model}
          onChange={(e) => setForm({ ...form, custom_model: e.target.value })}
        />
      )}
      <select
        className="sm:col-span-2 h-12 px-4 border border-zinc-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#002FA7] transition-colors"
        value={form.issue}
        onChange={(e) => setForm({ ...form, issue: e.target.value })}
        data-testid="inline-inquiry-issue"
      >
        <option value="">Select the problem</option>
        {content?.issues?.map((i) => <option key={i} value={i}>{i}</option>)}
      </select>
      <button type="submit" disabled={submitting}
        className="sm:col-span-2 h-12 bg-[#002FA7] hover:bg-[#00227A] text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        data-testid="inline-inquiry-submit">
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Request a Callback — It's Free <ArrowRight className="w-4 h-4" /></>}
      </button>
    </form>
  );
}
