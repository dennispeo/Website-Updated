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
                Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners about how users interact with their sites.
              </p>
              <p className="text-gray-300 leading-relaxed font-body">
                This Cookies Policy explains how Play E Ola uses cookies and similar technologies on our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">2. Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-heading font-semibold text-white mb-3">2.1 Essential Cookies</h3>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and remembering your preferences. The website cannot function properly without these cookies.
              </p>

              <h3 className="text-xl font-heading font-semibold text-white mb-3">2.2 Analytics Cookies</h3>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website's performance and user experience.
              </p>

              <h3 className="text-xl font-heading font-semibold text-white mb-3">2.3 Functional Cookies</h3>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                These cookies enable enhanced functionality and personalization, such as remembering your preferences, language settings, and other customizable elements of the website.
              </p>

              <h3 className="text-xl font-heading font-semibold text-white mb-3">2.4 Marketing Cookies</h3>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                These cookies are used to track visitors across websites to display relevant and engaging advertisements. They may be set by us or by third-party providers whose services we use on our pages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">3. Specific Cookies We Use</h2>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-700 rounded-lg overflow-hidden">
                  <thead className="bg-black/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-brand-orange font-heading font-semibold">Cookie Name</th>
                      <th className="px-4 py-3 text-left text-brand-orange font-heading font-semibold">Purpose</th>
                      <th className="px-4 py-3 text-left text-brand-orange font-heading font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300 font-body">
                    <tr className="border-t border-gray-700">
                      <td className="px-4 py-3">_session</td>
                      <td className="px-4 py-3">Essential for website functionality</td>
                      <td className="px-4 py-3">Session</td>
                    </tr>
                    <tr className="border-t border-gray-700">
                      <td className="px-4 py-3">_preferences</td>
                      <td className="px-4 py-3">Remembers user preferences</td>
                      <td className="px-4 py-3">1 year</td>
                    </tr>
                    <tr className="border-t border-gray-700">
                      <td className="px-4 py-3">_analytics</td>
                      <td className="px-4 py-3">Website usage analytics</td>
                      <td className="px-4 py-3">2 years</td>
                    </tr>
                    <tr className="border-t border-gray-700">
                      <td className="px-4 py-3">_marketing</td>
                      <td className="px-4 py-3">Marketing and advertising</td>
                      <td className="px-4 py-3">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">4. Third-Party Cookies</h2>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                We may use third-party services that set their own cookies on our website. These may include:
              </p>
              <ul className="list-disc list-inside text-gray-300 font-body mb-4 space-y-2">
                <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                <li><strong>Social Media Platforms:</strong> For social sharing functionality</li>
                <li><strong>Content Delivery Networks:</strong> For improved website performance</li>
                <li><strong>Marketing Platforms:</strong> For advertising and remarketing purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">5. Managing Your Cookie Preferences</h2>
              
              <h3 className="text-xl font-heading font-semibold text-white mb-3">5.1 Browser Settings</h3>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                Most web browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className="list-disc list-inside text-gray-300 font-body mb-4 space-y-2">
                <li>View what cookies are stored on your device</li>
                <li>Delete cookies individually or all at once</li>
                <li>Block cookies from specific sites</li>
                <li>Block all cookies from being set</li>
                <li>Delete all cookies when you close your browser</li>
              </ul>

              <h3 className="text-xl font-heading font-semibold text-white mb-3">5.2 Cookie Consent</h3>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                When you first visit our website, you'll see a cookie consent banner. You can choose to accept all cookies, reject non-essential cookies, or customize your preferences.
              </p>

              <h3 className="text-xl font-heading font-semibold text-white mb-3">5.3 Opt-Out Links</h3>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                For specific third-party services, you can opt out directly:
              </p>
              <ul className="list-disc list-inside text-gray-300 font-body mb-4 space-y-2">
                <li><a href="https://tools.google.com/dlpage/gaoptout" className="text-brand-orange hover:text-brand-yellow transition-colors duration-200 underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out</a></li>
                <li><a href="https://www.youronlinechoices.com/" className="text-brand-orange hover:text-brand-yellow transition-colors duration-200 underline" target="_blank" rel="noopener noreferrer">Your Online Choices</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">6. Impact of Disabling Cookies</h2>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                While you can disable cookies, please note that doing so may affect your experience on our website:
              </p>
              <ul className="list-disc list-inside text-gray-300 font-body mb-4 space-y-2">
                <li>Some features may not work properly</li>
                <li>Your preferences may not be saved</li>
                <li>You may need to re-enter information</li>
                <li>Personalized content may not be available</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">7. Updates to This Policy</h2>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                We may update this Cookies Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">8. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                If you have any questions about our use of cookies or this Cookies Policy, please contact us:
              </p>
              <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                <p className="text-white font-body">
                  <strong>General Contact:</strong> info@playeola.com
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CookiesPolicyPage;