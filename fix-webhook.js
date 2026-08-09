const fs = require('fs');
let html = fs.readFileSync('public/dashboard.html', 'utf8');

html = html.replace(
    '        async function triggerDeploy() {\r\n            if (!currentWebhookUrl) return;',
    '        async function triggerDeploy() {\r\n            if (!currentWebhookUrl) await loadWebhook();\r\n            if (!currentWebhookUrl) return;'
);
html = html.replace(
    '        async function triggerDeploy() {\n            if (!currentWebhookUrl) return;',
    '        async function triggerDeploy() {\n            if (!currentWebhookUrl) await loadWebhook();\n            if (!currentWebhookUrl) return;'
);

fs.writeFileSync('public/dashboard.html', html);
console.log("Webhook fixed!");
