const fs = require('fs');
let html = fs.readFileSync('public/dashboard.html', 'utf8');

// I need to repair lines 739-752.
// The corrupted chunk is:
/*
                isLive: document.getElementById('form-live').checked,
            document.getElementById('form-title').value = article.title;
*/

// I will use regex or string replace. Since it's a mess, I'll read from Git using `git checkout`? 
// No, user doesn't have Git. I have to manually reconstruct the missing code.

const missingCode = `
                date: id ? (getArticleById(id)?.date || new Date().toISOString()) : new Date().toISOString(),
                views: id ? (getArticleById(id)?.views || 0) : 0,
                readTime: Math.max(2, Math.ceil(document.getElementById('form-content').value.split(' ').length / 200)) + ' min read',
                authorAvatar: null
            };
            saveArticle(article);
            triggerDeploy();
            showTab('articles');
            alert(id ? 'Article updated!' : 'Article created!');
        }

        function editArticle(id) {
            const article = getArticleById(id);
            if (!article) return;
            document.getElementById('article-id').value = article.id;
`;

html = html.replace(
    "                isLive: document.getElementById('form-live').checked,\r\n            document.getElementById('form-title').value = article.title;",
    "                isLive: document.getElementById('form-live').checked," + missingCode + "            document.getElementById('form-title').value = article.title;"
);

// Add triggerDeploy to confirmDelete
html = html.replace(
    "        function confirmDelete(id) {\r\n            if (confirm('Are you sure you want to delete this article?')) {\r\n                deleteArticle(id);\r\n                renderArticlesTable();\r\n            }\r\n        }",
    "        function confirmDelete(id) {\r\n            if (confirm('Are you sure you want to delete this article?')) {\r\n                deleteArticle(id);\r\n                triggerDeploy();\r\n                renderArticlesTable();\r\n            }\r\n        }"
);

// Fallback for LF
html = html.replace(
    "                isLive: document.getElementById('form-live').checked,\n            document.getElementById('form-title').value = article.title;",
    "                isLive: document.getElementById('form-live').checked," + missingCode + "            document.getElementById('form-title').value = article.title;"
);
html = html.replace(
    "        function confirmDelete(id) {\n            if (confirm('Are you sure you want to delete this article?')) {\n                deleteArticle(id);\n                renderArticlesTable();\n            }\n        }",
    "        function confirmDelete(id) {\n            if (confirm('Are you sure you want to delete this article?')) {\n                deleteArticle(id);\n                triggerDeploy();\n                renderArticlesTable();\n            }\n        }"
);

fs.writeFileSync('public/dashboard.html', html);
console.log("Repaired dashboard.html");
