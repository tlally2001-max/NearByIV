import Link from "next/link";
import { Header } from "@/components/header";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── Navbar ── */}
      <Header />

      {/* ── Content ── */}
      <div className="flex-1 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12 sm:py-16">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Agreement to Terms</h2>
            <p>
              By accessing and using this website (nearbyiv.com), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Use License</h2>
            <p className="mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on NearbyIV's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile or reverse engineer any software contained on the website</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transmitting the materials over a network</li>
              <li>Disrupting the normal flow of dialogue within our website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. Disclaimer</h2>
            <p>
              The materials on NearbyIV's website are provided on an 'as is' basis. NearbyIV makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Limitations</h2>
            <p>
              In no event shall NearbyIV or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on NearbyIV's website, even if NearbyIV or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Accuracy of Materials</h2>
            <p>
              The materials appearing on NearbyIV's website could include technical, typographical, or photographic errors. NearbyIV does not warrant that any of the materials on the website are accurate, complete, or current. NearbyIV may make changes to the materials contained on the website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Links</h2>
            <p>
              NearbyIV has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by NearbyIV of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Modifications</h2>
            <p>
              NearbyIV may revise these terms of service for the website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">9. User Responsibilities</h2>
            <p className="mb-4">By using NearbyIV, you agree to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the confidentiality of your account information</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Not use the website for illegal or unauthorized purposes</li>
              <li>Not transmit viruses, malware, or any code of destructive nature</li>
              <li>Not engage in harassment, abuse, or threatening behavior</li>
              <li>Not attempt to gain unauthorized access to the website or its systems</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">10. Provider Information</h2>
            <p>
              NearbyIV provides a platform to connect users with IV therapy providers. We do not directly provide medical services. The information about providers, treatments, and services is provided for informational purposes only. Always consult with qualified healthcare professionals before undergoing any medical treatment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">11. Medical Disclaimer</h2>
            <p>
              The content on NearbyIV is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified healthcare provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">12. Appointment and Payment Terms</h2>
            <p className="mb-4">
              When booking an appointment with an IV therapy provider through our platform:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You are responsible for confirming all appointment details with the provider</li>
              <li>Cancellation policies are determined by individual providers</li>
              <li>Payment terms and methods are agreed upon between you and the provider</li>
              <li>NearbyIV is not responsible for payment disputes or service issues</li>
              <li>Contact the provider directly for appointment changes or cancellations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">13. Intellectual Property Rights</h2>
            <p>
              All content on NearbyIV, including but not limited to text, graphics, logos, images, and software, is the property of NearbyIV or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, or transmit any content without our prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">14. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, NearbyIV shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, even if advised of the possibility of such damages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">15. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless NearbyIV and its officers, directors, employees, agents, and successors from any claim, demand, loss, or liability arising from your use of the website or your violation of these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">16. Termination</h2>
            <p>
              NearbyIV may terminate or suspend your account and access to the website at any time, for any reason, including if we believe you have violated these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">17. Severability</h2>
            <p>
              If any part of these terms of service is found to be invalid or unenforceable, the remaining portions shall continue in full force and effect, and the invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">18. Entire Agreement</h2>
            <p>
              These terms of service, together with our Privacy Policy, constitute the entire agreement between you and NearbyIV regarding your use of the website and supersede all prior agreements and understandings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">19. Contact Information</h2>
            <p>
              If you have any questions about these terms of service, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold mb-2">NearbyIV</p>
              <p>Email: nearbyiv@gmail.com</p>
              <p>Website: https://nearbyiv.com</p>
            </div>
          </section>

          <section className="border-t pt-8 mt-8">
            <p className="text-sm text-gray-500">
              <strong>Last Updated:</strong> February 26, 2026
            </p>
          </section>
        </div>
      </div>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-gray-950 text-gray-500 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center gap-6 text-center">
          <div className="text-sm">
            <span className="text-white font-semibold">NearbyIV.com</span>
            <span className="text-gray-600"> — Mobile IV and Hangover Recovery Directory</span>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <a href="mailto:NearByIV@gmail.com" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-xs text-gray-700">&copy; 2026 NearbyIV.com. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
