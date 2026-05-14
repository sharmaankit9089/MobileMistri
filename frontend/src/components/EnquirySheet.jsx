import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { ArrowRight, Check, Loader2, MessageCircle } from "lucide-react";
import { submitEnquiry } from "../lib/api";
import { useContent } from "../lib/content";

export default function EnquirySheet({ trigger, defaultValues = {}, source = "website" }) {
  const { content } = useContent();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", city: "", brand: "", model: "", issue: "", message: "", custom_model: "",
    ...defaultValues,
  });

  const update = (k) => (v) => setForm((f) => ({ ...f, [k]: typeof v === "object" ? v.target.value : v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Name and phone are required");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      toast.error("Enter a valid 10-digit Indian mobile number");
      return;
    }
    setSubmitting(true);
    try {
      const isOther = form.model === "Other model (specify)";
      await submitEnquiry({
        ...form,
        model: isOther && form.custom_model ? form.custom_model : form.model,
        source,
      });
      setDone(true);
      toast.success("Enquiry received. We'll call you in 15 mins.");
      setTimeout(() => {
        const text = `*Hi MobileMistri, I need a repair quote.*\n
*Name:* ${form.name}
*Phone:* ${form.phone}
*City:* ${form.city}
*Device:* ${form.brand} ${isOther && form.custom_model ? form.custom_model : form.model}
*Issue:* ${form.issue}
*Message:* ${form.message}`;
        window.location.href = `https://wa.me/919650061347?text=${encodeURIComponent(text)}`;
      }, 1500);
    } catch (err) {
      toast.error("Something went wrong. Try WhatsApp instead.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setDone(false);
    setForm({ name: "", phone: "", city: "", brand: "", model: "", issue: "", message: "" });
  };

  const selectedBrand = content?.brands?.find((b) => b.slug === form.brand);

  return (
    <Sheet open={open} onOpenChange={(o) => { setOpen(o); if (!o) setTimeout(reset, 300); }}>
      <SheetTrigger asChild>
        {trigger || (
          <button data-testid="open-enquiry-trigger" className="mm-btn-primary text-sm">
            <MessageCircle className="h-4 w-4" /> Get free quote
          </button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto" data-testid="enquiry-sheet">
        <SheetHeader className="pb-4">
          <div className="label-kicker">Free doorstep quote</div>
          <SheetTitle className="font-display text-2xl" style={{ color: "var(--mm-navy)" }}>
            {done ? "We'll call you shortly" : "Tell us what's broken"}
          </SheetTitle>
          <SheetDescription>
            {done
              ? "A MobileMistri expert will reach out within 15 minutes with a transparent fix quote."
              : "Fill this in under 30 seconds. No obligation. Zero spam."}
          </SheetDescription>
        </SheetHeader>

        {done ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3">
              <Check className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div className="text-sm text-emerald-900">
                Enquiry received. Save <b>+91 96500 61347</b> on WhatsApp for faster chats.
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => setOpen(false)} data-testid="enquiry-close-btn">
              Close
            </Button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="enq-name">Your name *</Label>
                <Input id="enq-name" data-testid="enquiry-name-input" value={form.name} onChange={update("name")} placeholder="Rahul Sharma" />
              </div>
              <div>
                <Label htmlFor="enq-phone">Mobile number *</Label>
                <Input id="enq-phone" data-testid="enquiry-phone-input" value={form.phone} onChange={update("phone")} placeholder="96500 61347" maxLength={10} />
              </div>
              <div>
                <Label>City</Label>
                <Select value={form.city} onValueChange={update("city")}>
                  <SelectTrigger data-testid="enquiry-city-select"><SelectValue placeholder="Select your city" /></SelectTrigger>
                  <SelectContent>
                    {content?.cities?.map((c) => (
                      <SelectItem key={c.slug} value={c.name} data-testid={`enquiry-city-opt-${c.slug}`}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Brand</Label>
                  <Select value={form.brand} onValueChange={(v) => setForm((f) => ({ ...f, brand: v, model: "" }))}>
                    <SelectTrigger data-testid="enquiry-brand-select"><SelectValue placeholder="Pick brand" /></SelectTrigger>
                    <SelectContent>
                      {content?.brands?.map((b) => (
                        <SelectItem key={b.slug} value={b.slug} data-testid={`enquiry-brand-opt-${b.slug}`}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Model</Label>
                  <Select value={form.model} onValueChange={update("model")} disabled={!selectedBrand}>
                    <SelectTrigger data-testid="enquiry-model-select"><SelectValue placeholder="Pick model" /></SelectTrigger>
                    <SelectContent>
                      {selectedBrand?.models?.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {form.model === "Other model (specify)" && (
                <div>
                  <Label>Specify your model *</Label>
                  <Input data-testid="enquiry-custom-model" value={form.custom_model} onChange={update("custom_model")} placeholder="e.g. Vivo V30 Pro" />
                </div>
              )}
              <div>
                <Label>Issue</Label>
                <Select value={form.issue} onValueChange={update("issue")}>
                  <SelectTrigger data-testid="enquiry-issue-select"><SelectValue placeholder="What's the problem?" /></SelectTrigger>
                  <SelectContent>
                    {content?.issues?.map((i) => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="enq-msg">Anything else? (optional)</Label>
                <Textarea id="enq-msg" data-testid="enquiry-message-input" rows={3} value={form.message} onChange={update("message")} placeholder="e.g. Dropped it yesterday, display has vertical lines..." />
              </div>
            </div>
            <Button type="submit" className="w-full mm-btn-primary justify-center" data-testid="enquiry-submit-btn" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Get free quote <ArrowRight className="h-4 w-4" /></>}
            </Button>
            <p className="text-xs text-slate-500 text-center">
              By submitting you agree to be contacted via call / WhatsApp. We don't spam.
            </p>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
