import React, { useEffect } from "react";
import { Shield } from "lucide-react";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-8 w-8 text-[color:var(--mm-orange)]" />
            <h1 className="text-3xl font-display font-bold text-[color:var(--mm-navy)]">
              Privacy Policy
            </h1>
          </div>
          <p className="text-sm text-slate-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">1. Introduction</h2>
              <p>
                Welcome to MobileMistri. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">2. Data We Collect</h2>
              <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Identity Data:</strong> includes first name, last name.</li>
                <li><strong>Contact Data:</strong> includes delivery address, email address, and telephone numbers.</li>
                <li><strong>Device Data:</strong> includes device model, repair requirements, and condition.</li>
              </ul>
              <p className="mt-3 text-sm italic">
                * We do not access or collect any personal files, photos, or data stored on your device during the repair process. Our doorstep repair model ensures your phone remains in your sight at all times.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">3. How We Use Your Data</h2>
              <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>To register you as a new customer and schedule appointments.</li>
                <li>To process and deliver your repair service.</li>
                <li>To manage our relationship with you, including asking you to leave a review or take a survey.</li>
                <li>To contact you regarding warranty claims or service updates.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">4. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">5. Contact Details</h2>
              <p>If you have any questions about this privacy policy or our privacy practices, please contact us at:</p>
              <p className="mt-2 font-medium">Email: info@mobilemistri.com</p>
              <p className="font-medium">Phone: +91 96500 61347</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
