const fs = require('fs');
const { google } = require('googleapis');
const path = require('path');

// Configure the Indexing API Endpoint
const ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';

async function main() {
  console.log("=== STARTING GOOGLE SEARCH CONSOLE AUTO-INDEXER ===");
  
  // 1. Validate Credentials
  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!credentialsJson) {
    console.warn("⚠️ Warning: GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is missing.");
    console.warn("Skipping GSC Auto-Indexing. To enable, add your Service Account JSON to this env var.");
    return;
  }

  let credentials;
  try {
    credentials = JSON.parse(credentialsJson);
  } catch (e) {
    console.error("❌ Error parsing GOOGLE_APPLICATION_CREDENTIALS_JSON. Make sure it is valid JSON.");
    process.exit(1);
  }

  // 2. Initialize Google Auth Client
  const jwtClient = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/indexing'],
    null
  );

  try {
    await jwtClient.authorize();
    console.log("✅ Successfully authenticated with Google Indexing API.");
  } catch (e) {
    console.error("❌ Error authenticating with Google:", e.message);
    process.exit(1);
  }

  // 3. Find URLs to index. 
  // For static builds, we parse the generated sitemap.xml in the 'out' directory.
  const sitemapPath = path.join(__dirname, '../out/sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    console.error(`❌ Sitemap not found at ${sitemapPath}. Make sure 'next build' ran successfully.`);
    process.exit(1);
  }

  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  
  // Extract all <loc> URLs from sitemap
  const urlRegex = /<loc>(.*?)<\/loc>/g;
  let match;
  const allUrls = [];
  while ((match = urlRegex.exec(sitemapContent)) !== null) {
    allUrls.push(match[1]);
  }

  // Filter only article URLs to save quota (API limit is 200/day)
  // We take the top 10 articles assuming the sitemap puts newest first, or we just submit the newest ones.
  // We'll submit the first 5 article URLs to be safe and stay well within quota.
  const articleUrls = allUrls.filter(url => url.includes('/article/')).slice(0, 10);

  if (articleUrls.length === 0) {
    console.log("ℹ️ No article URLs found to index.");
    return;
  }

  console.log(`Found ${articleUrls.length} recent article URLs. Submitting to Google...`);

  // 4. Submit to Indexing API
  for (const url of articleUrls) {
    try {
      const response = await jwtClient.request({
        url: ENDPOINT,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          url: url,
          type: 'URL_UPDATED',
        },
      });
      console.log(`✅ SUCCESS - ${url} (Status: ${response.status})`);
    } catch (e) {
      console.error(`❌ FAILED - ${url}`);
      console.error(`   Reason: ${e.message}`);
    }
  }
  
  console.log("=== FINISHED GSC AUTO-INDEXER ===");
}

main().catch(console.error);
