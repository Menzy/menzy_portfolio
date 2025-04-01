import { TimelapseNavbar } from '@/components/TimelapseNavbar';
import { TimelapseFooter } from '@/components/TimelapseFooter';

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <TimelapseNavbar />
      
      <div className="container mx-auto px-4 pt-4 pb-12">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last Updated: {new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p>
              At TimeLapse, we're committed to privacy by design. Our app is built with your privacy as a fundamental principle.
              This Privacy Policy explains our data practices for the TimeLapse application. Please read this policy carefully to understand
              how we handle your information.
            </p>
            <p className="mt-2">
              <strong>Summary:</strong> TimeLapse does not collect, transmit, or store any of your personal information on our servers. All data is stored locally on your device and, if you enable iCloud, synchronized through your personal iCloud account.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information Collection and Use</h2>
            <p>
              TimeLapse is designed with a privacy-first approach:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>
                <strong>No Personal Data Collection:</strong> We do not collect, store, or transmit any personally identifiable information.
              </li>
              <li>
                <strong>No User Accounts:</strong> TimeLapse doesn't require you to create an account or provide any personal information.
              </li>
              <li>
                <strong>No Analytics or Tracking:</strong> We don't include any third-party analytics or tracking tools in our app.
              </li>
              <li>
                <strong>No Advertising:</strong> TimeLapse does not display advertisements and we don't share any information with advertisers.
              </li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Storage</h2>
            <p>
              All of your information remains under your control:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>
                <strong>Local Storage:</strong> All events, preferences, and settings you create in TimeLapse are stored locally on your device only.
              </li>
              <li>
                <strong>iCloud Synchronization:</strong> If you enable iCloud with our app, your data will be synchronized across your devices via your personal iCloud account. This data is protected by your Apple ID and Apple's privacy practices. We don't have access to this data.
              </li>
              <li>
                <strong>Data Security:</strong> Since all data is stored locally or through your personal iCloud account, your information is protected by your device's built-in security measures and Apple's iCloud security.
              </li>
            </ul>
            <p className="mt-2">
              For more information about how Apple handles your data in iCloud, please refer to <a href="https://www.apple.com/legal/privacy/en-ww/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Apple's Privacy Policy</a>.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">App Permissions</h2>
            <p>
              TimeLapse may request the following permissions, which are used solely within the app for the specified purposes:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>
                <strong>Notifications:</strong> If you enable notifications, we use this permission only to send local reminders about your events. No notification data is transmitted outside your device.
              </li>
              <li>
                <strong>iCloud:</strong> This permission is used only to synchronize your app data across your personal devices through your iCloud account.
              </li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Future Features</h2>
            <p>
              We may add features in the future that could include:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>
                <strong>Optional User Accounts:</strong> If we implement user accounts in the future, they will be entirely optional, and we will update this privacy policy accordingly.
              </li>
              <li>
                <strong>Calendar Integration:</strong> We may add the ability to access your device's calendar to automatically sync events. This will be opt-in, and calendar data will remain on your device or within your personal iCloud account.
              </li>
            </ul>
            <p className="mt-2">
              Any future features that change our data practices will be clearly communicated, and you will have control over your participation.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
            <p>
              TimeLapse does not collect any personal information from anyone, including children under the age of 13. Since we don't collect any data, there are no specific provisions for children's privacy, but we encourage parents and guardians to monitor their children's device usage.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Deletion</h2>
            <p>
              Since all data is stored locally on your device or in your personal iCloud account:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>
                <strong>Uninstalling the App:</strong> Removing the app from your device will delete all locally stored data.
              </li>
              <li>
                <strong>iCloud Data:</strong> To remove data from iCloud, you can disable iCloud synchronization for TimeLapse in your device settings or delete the app data from your iCloud storage.
              </li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">App Store and Third Parties</h2>
            <p>
              Please note that:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>
                <strong>App Store:</strong> When you download TimeLapse from the App Store, Apple may collect certain information. This collection is governed by Apple's privacy policy.
              </li>
              <li>
                <strong>No Third-Party Services:</strong> TimeLapse does not incorporate any third-party services, SDKs, or frameworks that would collect or process your data.
              </li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Compliance with Laws</h2>
            <p>
              Since we don't collect any personal data, many data protection regulations (like GDPR, CCPA) have limited applicability. However, we're committed to complying with all applicable laws and regulations related to our app.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top.
            </p>
            <p className="mt-2">
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions or suggestions about our Privacy Policy, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> wanmenzy@gmail.com
            </p>
          </section>
        </div>
      </div>
      
      <TimelapseFooter />
    </div>
  );
} 