const fs = require('fs');
const data = require('./data.js');

const fileContent = fs.readFileSync('app.js', 'utf8');

const replacementString = 
  "const LIVE_UPDATES = " + JSON.stringify(data.liveUpdates, null, 2) + ";\n\n" +
  "// ---------------------------------------------------------------------------\n" +
  "// Trending Topics\n" +
  "// ---------------------------------------------------------------------------\n" +
  "const TRENDING_TOPICS = " + JSON.stringify(data.trendingTopics, null, 2) + ";\n\n" +
  "// ---------------------------------------------------------------------------\n" +
  "// Default Articles (24 articles, all English, APAC-focused)\n" +
  "// ---------------------------------------------------------------------------\n" +
  "const DEFAULT_ARTICLES = " + JSON.stringify(data.articles, null, 2) + ";\n\n";

const startPattern = 'const LIVE_UPDATES = [';
const endPattern = '// ============================================================================\n// DATA MANAGEMENT';

const startIndex = fileContent.indexOf(startPattern);
const endIndex = fileContent.indexOf(endPattern);

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = fileContent.substring(0, startIndex) + replacementString + fileContent.substring(endIndex);
  fs.writeFileSync('app.js', newContent, 'utf8');
  console.log('Successfully updated app.js with real news data and images!');
} else {
  console.error('Could not find boundaries in app.js', {startIndex, endIndex});
}
