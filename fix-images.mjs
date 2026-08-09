import fs from 'fs';
import path from 'path';

function replaceInFile(filePath, searchRegex, replaceWith) {
  const content = fs.readFileSync(filePath, 'utf8');
  const newContent = content.replace(searchRegex, replaceWith);
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

// 1. Add limit(25) to page.js
replaceInFile(
  'app/page.js',
  /import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase\/firestore';/,
  "import { collection, getDocs, query, orderBy, doc, getDoc, limit } from 'firebase/firestore';"
);
replaceInFile(
  'app/page.js',
  /const q = query\(collection\(db, "articles"\), orderBy\("date", "desc"\)\);/,
  'const q = query(collection(db, "articles"), orderBy("date", "desc"), limit(25));'
);

// 2. Add limit(25) to markets/page.js
replaceInFile(
  'app/markets/page.js',
  /import { collection, getDocs, query, orderBy } from 'firebase\/firestore';/,
  "import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';"
);
replaceInFile(
  'app/markets/page.js',
  /const q = query\(collection\(db, "articles"\), orderBy\("date", "desc"\)\);/,
  'const q = query(collection(db, "articles"), orderBy("date", "desc"), limit(25));'
);

// 3. Add limit(25) to category/[slug]/page.js
replaceInFile(
  'app/category/[slug]/page.js',
  /const querySnapshot = await getDocs\(collection\(db, "articles"\)\);/g,
  'const q = query(collection(db, "articles"), limit(25));\n  const querySnapshot = await getDocs(q);'
);

// 4. Optimize ALL images globally for decoding="async"
function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.js')) {
      // Replace <img ... loading="lazy" ... /> with decoding="async"
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Global replace for loading="lazy" without decoding="async"
      if (content.includes('loading="lazy"') && !content.includes('decoding="async"')) {
        content = content.replace(/loading="lazy"/g, 'loading="lazy" decoding="async"');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Optimized images in ${fullPath}`);
      }
    }
  }
}

processDirectory('app');
processDirectory('components');

// 5. Specifically fix the Hero Image in app/page.js to be eager and high priority
let pageJs = fs.readFileSync('app/page.js', 'utf8');
// Replace the very first image (which is mainArticle.image)
pageJs = pageJs.replace(
  /<img src={mainArticle\.image} alt={mainArticle\.title} loading="lazy" decoding="async" width={800} height={500} \/>/,
  '<img src={mainArticle.image} alt={mainArticle.title} fetchpriority="high" loading="eager" decoding="sync" width={800} height={500} />'
);
fs.writeFileSync('app/page.js', pageJs, 'utf8');
console.log("Optimized Hero Image in app/page.js");

// 6. Fix Hero Image in app/article/[slug]/page.js
let articleJs = fs.readFileSync('app/article/[slug]/page.js', 'utf8');
articleJs = articleJs.replace(
  /<img className="article-hero-img" src={article\.image} alt={article\.title} loading="lazy" decoding="async" width={800} height={500} \/>/,
  '<img className="article-hero-img" src={article.image} alt={article.title} fetchpriority="high" loading="eager" decoding="sync" width={800} height={500} />'
);
fs.writeFileSync('app/article/[slug]/page.js', articleJs, 'utf8');
console.log("Optimized Hero Image in article page");

console.log("All done!");
