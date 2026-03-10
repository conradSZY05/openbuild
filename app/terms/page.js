export default function Privacy() {
  return (
    <main className="min-h-screen bg-stone-300 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <a href="/projects" className="hover:opacity-70">
            <img src="/logo.png" alt="OpenBuild" style={{ height: '75px', marginTop: '-8px' }} />
          </a>
          <a href="/projects" className="text-sm font-large text-stone-700 hover:underline">Projects</a>
          <a href="/about" className="text-sm font-large text-stone-700 hover:underline">About</a>
          <span className="text-sm font-large text-stone-400">Networking <span className="text-xs">(coming soon)</span></span>
        </div>
        <div
          className="bg-white border border-stone-400 p-8 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: POLICY }}
        />
      </div>
    </main>
  )
}

const POLICY = `
TERMS OF SERVICE

Last updated: March 09, 2026

1. ACCEPTANCE
By using OpenBuild you agree to these terms. If you don't agree, don't use the platform.

2. ELIGIBILITY
You must be a student with a valid university email address (e.g. .ac.uk or .edu) to register.

3. USER CONTENT
You are responsible for all content you post including project listings, profile information, and comments. You must not post spam, harassment, illegal content, impersonation, or misleading information.

4. OUR RIGHTS
We reserve the right to remove any content or suspend any account at any time without notice or liability.

5. LIMITATION OF LIABILITY
OpenBuild is provided free of charge on an "as is" basis. To the maximum extent permitted by law, we are not liable for any damages arising from your use of the platform, including but not limited to failed collaborations, data loss, or downtime.

6. INTELLECTUAL PROPERTY
You retain ownership of content you post. By posting you grant OpenBuild a licence to display it on the platform.

7. PRIVACY
Your use of OpenBuild is also governed by our Privacy Policy at https://www.openbuild.net/privacy

8. CHANGES
We may update these terms at any time. Continued use of the platform means you accept the updated terms.

9. GOVERNING LAW
These terms are governed by the laws of England and Wales.

10. CONTACT
contact@openbuild.net
`