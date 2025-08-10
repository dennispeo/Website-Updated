import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const PrivacyPolicyPage = () => {
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
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-300 font-body">
              Last updated: January 2025
            </p>
          </div>

          {/* Content */}
          <div className="bg-black/30 rounded-2xl border border-gray-800 p-8 md:p-12 space-y-8">
            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                PlayEola ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
              <p className="text-gray-300 leading-relaxed font-body">
                By accessing or using our services, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-heading font-semibold text-white mb-3">2.1 Personal Information</h3>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc list-inside text-gray-300 font-body mb-4 space-y-2">
                <li>Contact us through our website forms</li>
                <li>Subscribe to our newsletter</li>
                <li>Request information about our games or services</li>
                <li>Apply for career opportunities</li>
              </ul>

              <h3 className="text-xl font-heading font-semibold text-white mb-3">2.2 Automatically Collected Information</h3>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                When you visit our website, we may automatically collect certain information about your device and usage patterns, including:
              </p>
              <ul className="list-disc list-inside text-gray-300 font-body mb-4 space-y-2">
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referring website addresses</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc list-inside text-gray-300 font-body mb-4 space-y-2">
                <li>Responding to your inquiries and providing customer support</li>
                <li>Processing partnership applications and business communications</li>
                <li>Improving our website and services</li>
                <li>Analyzing website usage and performance</li>
                <li>Sending marketing communications (with your consent)</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-300 font-body mb-4 space-y-2">
                <li>With trusted service providers who assist us in operating our website</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or merger</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">5. Data Security</h2>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">6. Your Rights</h2>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-300 font-body mb-4 space-y-2">
                <li>Right to access your personal data</li>
                <li>Right to rectification of inaccurate data</li>
                <li>Right to erasure ("right to be forgotten")</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">7. Cookies and Tracking Technologies</h2>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                Our website uses cookies and similar tracking technologies to enhance your browsing experience. For detailed information about our use of cookies, please see our{' '}
                <Link to="/cookies-policy" className="text-brand-orange hover:text-brand-yellow transition-colors duration-200 underline">
                  Cookies Policy
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">8. Third-Party Links</h2>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">9. Children's Privacy</h2>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                Our services are intended for adults aged 18 and over. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-brand-orange mb-4">11. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed font-body mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
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

export default PrivacyPolicyPage;