import React, { useEffect } from "react";
import { Scale } from "lucide-react";

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <Scale className="h-8 w-8 text-[color:var(--mm-orange)]" />
            <h1 className="text-3xl font-display font-bold text-[color:var(--mm-navy)]">
              Terms & Conditions
            </h1>
          </div>
          <p className="text-sm text-slate-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">1. Service Agreement</h2>
              <p>
                By booking a repair service with MobileMistri (Ring N Relax Services Private Limited), you agree to these terms and conditions. We provide independent mobile repair services and are not affiliated with Apple, Samsung, or any other device manufacturer.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">2. "No Fix, No Fee" Policy</h2>
              <p>
                We operate on a strict "No Fix, No Fee" policy. If our technician is unable to repair your device, you will not be charged for the service. This policy does not apply if the device has underlying motherboard damage that was undisclosed prior to the repair attempt, or if the device has been tampered with previously.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">3. Warranty Policy</h2>
              <p>We provide a comprehensive warranty on our repairs:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Screen Replacements:</strong> Up to 12 months warranty against touch issues or display malfunctions (excluding physical or liquid damage after repair).</li>
                <li><strong>Battery Replacements:</strong> 6 months warranty against rapid draining or swelling.</li>
                <li><strong>Other Repairs:</strong> 3-6 months depending on the part replaced.</li>
              </ul>
              <p className="mt-3 text-sm font-medium">
                Note: The warranty is voided if the device is dropped, suffers liquid damage, or is opened by any other third-party technician after our repair.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">4. Data Loss</h2>
              <p>
                While our doorstep repair process ensures your device never leaves your sight and data is not accessed, MobileMistri cannot be held liable for any accidental data loss that may occur due to hardware failure during the repair process. We highly recommend backing up your data before the technician arrives.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">5. Independent Service Disclaimer</h2>
              <p>
                MobileMistri is an independent third-party repair service. We use high-quality, OEM-grade replacement parts. Repairing your device through us may void your official manufacturer warranty. All brand names, logos, and trademarks (including iPhone, Galaxy, OnePlus) are the property of their respective owners.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">6. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of Delhi.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
