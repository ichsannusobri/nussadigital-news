// Shared Firebase Admin init for maintenance scripts.
// Auth: Application Default Credentials. Run once on your machine:
//   gcloud auth application-default login
// or set GOOGLE_APPLICATION_CREDENTIALS to a service-account file path
// that lives OUTSIDE this repository. Never commit credentials.
const admin = require('firebase-admin');

const PROJECT_ID = 'nussadigital-news-a332e';

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.applicationDefault(), projectId: PROJECT_ID });
}

module.exports = { admin, db: admin.firestore(), PROJECT_ID };
