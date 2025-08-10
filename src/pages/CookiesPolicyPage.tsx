import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const CookiesPolicyPage = () => {
  return (
    <>
      <div className="min-h-screen bg-brand-dark-gradient pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <div className="mb-8">
            <Link 
              to="/"
              className="inline-flex items-center space-x-2 text-brand-orange hover:text-brand-yellow transition-colors duration-300 font-body"
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              Cookies Policy
            </h1>
            <p className="text-lg text-gray-300 font-body">
              Last updated: January 2025
            </p>
          </div>

          {/* Content */}
          <div className="bg-black/30 rounded-2xl border border-gray-800 p-8 md:p-12 space-y-8">
            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">1. What Are Cookies?</h2>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                Cookies are small text files that are stored on your device when you visit a website. They help websites remember your preferences and understand how you interact with the site.
              </p>
              <p className="text-gray-300 leading-relaxed font-body">
                This Cookies Policy explains how PlayEola uses cookies and similar technologies on our website to provide you with a better experience and improve our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">2. Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-heading font-semibold text-white mb-3">2.1 Essential Cookies</h3>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas. The website cannot function properly without these cookies.
              </p>
              <ul className="list-disc list-inside text-gray-300 font-body mb-4 space-y-2">
                <li><strong>Session Management:</strong> Maintains your session while browsing our site</li>
                <li><strong>Security:</strong> Protects against cross-site request forgery and other security threats</li>
                <li><strong>Accessibility:</strong> Remembers accessibility preferences you've set</li>
              </ul>

              <h3 className="text-xl font-heading font-semibold text-white mb-3">2.2 Analytics Cookies</h3>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. We only collect this data when you have given your explicit consent.
              </p>
              <ul className="list-disc list-inside text-gray-300 font-body mb-4 space-y-2">
                <li><strong>Page Views:</strong> Which pages you visit and how long you spend on them</li>
                <li><strong>User Interactions:</strong> What buttons you click and forms you submit</li>
                <li><strong>Session Data:</strong> How you navigate through our site and where you enter/exit</li>
                <li><strong>Device Information:</strong> Browser type, screen resolution, and device type (for responsive design)</li>
                <li><strong>Performance Metrics:</strong> Page load times and scroll depth to improve user experience</li>
              </ul>

              <h3 className="text-xl font-heading font-semibold text-white mb-3">2.3 Preference Cookies</h3>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                These cookies remember your choices and preferences to provide you with a more personalized experience.
              </p>
              <ul className="list-disc list-inside text-gray-300 font-body mb-4 space-y-2">
                <li><strong>Cookie Consent:</strong> Remembers your cookie preferences for one year</li>
                <li><strong>Age Verification:</strong> Remembers that you've confirmed you're over 18</li>
                <li><strong>Language Preferences:</strong> Stores your preferred language settings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">3. Specific Cookies We Use</h2>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-700 rounded-lg overflow-hidden">
                  <thead className="bg-black/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-brand-orange font-heading font-semibold">Cookie Name</th>
                      <th className="px-4 py-3 text-left text-brand-orange font-heading font-semibold">Purpose</th>
                      <th className="px-4 py-3 text-left text-brand-orange font-heading font-semibold">Type</th>
                      <th className="px-4 py-3 text-left text-brand-orange font-heading font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300 font-body">
                    <tr className="border-t border-gray-700">
                      <td className="px-4 py-3">playeola_cookie_consent</td>
                      <td className="px-4 py-3">Stores your cookie consent preferences</td>
                      <td className="px-4 py-3">Essential</td>
                      <td className="px-4 py-3">1 year</td>
                    </tr>
                    <tr className="border-t border-gray-700">
                      <td className="px-4 py-3">playeola_consent_timestamp</td>
                      <td className="px-4 py-3">Records when you gave consent</td>
                      <td className="px-4 py-3">Essential</td>
                      <td className="px-4 py-3">1 year</td>
                    </tr>
                    <tr className="border-t border-gray-700">
                      <td className="px-4 py-3">session_*</td>
                      <td className="px-4 py-3">Tracks user sessions for analytics</td>
                      <td className="px-4 py-3">Analytics</td>
                      <td className="px-4 py-3">Session</td>
                    </tr>
                    <tr className="border-t border-gray-700">
                      <td className="px-4 py-3">age_verified</td>
                      <td className="px-4 py-3">Remembers age verification status</td>
                      <td className="px-4 py-3">Functional</td>
                      <td className="px-4 py-3">Session</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">4. What Data We Collect</h2>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                When you consent to analytics cookies, we collect the following information to improve our website:
              </p>
              
              <h3 className="text-xl font-heading font-semibold text-white mb-3">4.1 Page View Data</h3>
              <ul className="list-disc list-inside text-gray-300 font-body mb-4 space-y-2">
                <li>Pages visited and time spent on each page</li>
                <li>Page titles and URLs</li>
                <li>Referrer information (where you came from)</li>
                <li>Screen resolution and viewport size</li>
                <li>Scroll depth (how far you scroll down pages)</li>
                <li>Time on page and session duration</li>
              </ul>

              <h3 className="text-xl font-heading font-semibold text-white mb-3">4.2 Interaction Data</h3>
              <ul className="list-disc list-inside text-gray-300 font-body mb-4 space-y-2">
                <li>Button clicks and link interactions</li>
                <li>Form submissions (contact forms, career applications)</li>
                <li>Download actions</li>
                <li>Navigation patterns</li>
                <li>Click positions and element interactions</li>
              </ul>

              <h3 className="text-xl font-heading font-semibold text-white mb-3">4.3 Technical Information</h3>
              <ul className="list-disc list-inside text-gray-300 font-body mb-4 space-y-2">
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Device type (mobile, desktop, tablet)</li>
                <li>IP address (anonymized for privacy)</li>
                <li>General location (country level only)</li>
              </ul>

              <h3 className="text-xl font-heading font-semibold text-white mb-3">4.4 Session Information</h3>
              <ul className="list-disc list-inside text-gray-300 font-body mb-4 space-y-2">
                <li>Entry and exit pages</li>
                <li>Total pages viewed per session</li>
                <li>Session duration and bounce rate</li>
                <li>UTM parameters (marketing campaign tracking)</li>
                <li>Conversion events (form submissions, demo requests)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">5. Third-Party Services</h2>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                Currently, we use our own analytics system and do not rely on third-party analytics services like Google Analytics. All data is collected and stored on our secure servers. However, our website may use the following third-party services:
              </p>
              <ul className="list-disc list-inside text-gray-300 font-body mb-4 space-y-2">
                <li><strong>Supabase:</strong> For secure data storage and user authentication</li>
                <li><strong>Content Delivery Networks (CDNs):</strong> For faster loading of fonts and assets</li>
                <li><strong>Email Services:</strong> For processing contact form submissions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">6. Managing Your Cookie Preferences</h2>
              
              <h3 className="text-xl font-heading font-semibold text-white mb-3">6.1 Our Cookie Banner</h3>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                When you first visit our website, you'll see a cookie consent banner at the bottom of the page. You can:
              </p>
              <ul className="list-disc list-inside text-gray-300 font-body mb-4 space-y-2">
                <li><strong>Accept All:</strong> Consent to all cookies including analytics</li>
                <li><strong>Decline:</strong> Only essential cookies will be used</li>
                <li><strong>Learn More:</strong> View detailed information about cookie types</li>
              </ul>

              <h3 className="text-xl font-heading font-semibold text-white mb-3">6.2 Browser Settings</h3>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                You can also control cookies through your browser settings:
              </p>
              <ul className="list-disc list-inside text-gray-300 font-body mb-4 space-y-2">
                <li>View and delete individual cookies</li>
                <li>Block cookies from specific sites</li>
                <li>Block all cookies (may affect site functionality)</li>
                <li>Set cookies to be deleted when you close your browser</li>
              </ul>

              <h3 className="text-xl font-heading font-semibold text-white mb-3">6.3 Changing Your Preferences</h3>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                Your cookie preferences are remembered for one year. After this time, you'll be asked to confirm your preferences again. You can also change your preferences at any time by:
              </p>
              <ul className="list-disc list-inside text-gray-300 font-body mb-4 space-y-2">
                <li>Clearing your browser's cookies and revisiting our site</li>
                <li>Using your browser's privacy settings</li>
                <li>Contacting us directly at info@playeola.com</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">7. Impact of Disabling Cookies</h2>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                While you can disable cookies, please note that doing so may affect your experience on our website:
              </p>
              
              <h3 className="text-xl font-heading font-semibold text-white mb-3">7.1 Essential Cookies</h3>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                Disabling essential cookies may result in:
              </p>
              <ul className="list-disc list-inside text-gray-300 font-body mb-4 space-y-2">
                <li>Repeated age verification prompts</li>
                <li>Loss of session data when navigating</li>
                <li>Reduced security features</li>
              </ul>

              <h3 className="text-xl font-heading font-semibold text-white mb-3">7.2 Analytics Cookies</h3>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                Declining analytics cookies means:
              </p>
              <ul className="list-disc list-inside text-gray-300 font-body mb-4 space-y-2">
                <li>We cannot track how you use our site</li>
                <li>We cannot improve user experience based on usage data</li>
                <li>We cannot measure the effectiveness of our content</li>
                <li>All core website functionality remains available</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">8. Data Security and Privacy</h2>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                We take the security of your data seriously:
              </p>
              <ul className="list-disc list-inside text-gray-300 font-body mb-4 space-y-2">
                <li>All analytics data is anonymized and cannot be used to identify you personally</li>
                <li>Data is stored securely using industry-standard encryption</li>
                <li>We do not sell or share your data with third parties for marketing purposes</li>
                <li>IP addresses are anonymized to protect your privacy</li>
                <li>Session data is automatically cleaned up after a reasonable period</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">9. Updates to This Policy</h2>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                We may update this Cookies Policy from time to time to reflect changes in our practices, technology, or legal requirements. When we make significant changes, we will:
              </p>
              <ul className="list-disc list-inside text-gray-300 font-body mb-4 space-y-2">
                <li>Update the "Last updated" date at the top of this policy</li>
                <li>Notify you through our cookie banner if consent requirements change</li>
                <li>Post the updated policy on our website</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">10. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                If you have any questions about our use of cookies or this Cookies Policy, please contact us:
              </p>
              <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                <p className="text-white font-body mb-2">
                  <strong>Email:</strong> info@playeola.com
                </p>
                <p className="text-white font-body">
                  <strong>Subject:</strong> Cookie Policy Inquiry
                </p>
              </div>
              <p className="text-gray-400 text-sm font-body mt-4">
                For more information about how we handle your personal data, please see our{' '}
                <Link to="/privacy-policy" className="text-brand-orange hover:text-brand-yellow transition-colors duration-200 underline">
                  Privacy Policy
                </Link>.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CookiesPolicyPage;