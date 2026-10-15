SMART CHARITY PLATFORM — AWS BACKEND INTEGRATION PATCH

This patch replaces localStorage-only cause/donation flows with AWS Amplify Data and Storage calls while preserving the existing CSS files. Donations are simulated records only; no payment is processed.

FILES TO COPY INTO THE PROJECT (keep the same relative paths):
- amplify/data/resource.ts
- src/data/cloudCharity.js (new file)
- src/pages/CollectorDashboard.jsx
- src/pages/AdminDashboard.jsx
- src/pages/Causes.jsx
- src/pages/CauseDetails.jsx
- src/pages/Donate.jsx
- src/pages/DonorDashboard.jsx

SAFETY / DEPLOYMENT NOTES:
1. Back up or commit the project before replacing files.
2. This project must already have Amplify configured in src/main.jsx and deployed auth/data/storage outputs in amplify_outputs.json.
3. This schema expects the existing amplify/auth/resource.ts and amplify/storage/resource.ts to define the admin/collector/donor groups and the verification-documents storage path.
4. After copying the files, run `npm run build` first. If it passes, run `aws login` if needed, then `npx ampx sandbox --once` to deploy the changed schema. This creates/updates real AWS resources and can incur charges.
5. Users must be assigned to the correct Cognito group by an administrator. Self-registration does not grant donor, collector, or admin access automatically.
6. Only a user in the `admin` Cognito group can list and review all submissions. The collector group can create submissions and read owned records. Logged-in users can read published Campaign records. Donors can create their own donation records and read their own records.
7. The built-in five demo causes are still local sample data. Newly approved causes are stored in the AWS Campaign model.
8. The donation amount is recorded in DynamoDB/AppSync but no payment is charged, and campaign raised totals are not atomically incremented by this patch. Do not represent this as real-money donation processing.
