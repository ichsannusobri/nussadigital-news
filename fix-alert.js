const fs = require('fs');
let html = fs.readFileSync('public/dashboard.html', 'utf8');

const oldCode1 = `        async function triggerDeploy() {\r\n            if (!currentWebhookUrl) await loadWebhook();\r\n            if (!currentWebhookUrl) return;\r\n            try {\r\n                fetch(currentWebhookUrl, { method: 'POST' });\r\n                console.log("Triggered Cloudflare deploy hook.");\r\n            } catch (e) {\r\n                console.error("Failed to trigger deploy:", e);\r\n            }\r\n        }`;

const oldCode2 = `        async function triggerDeploy() {\n            if (!currentWebhookUrl) await loadWebhook();\n            if (!currentWebhookUrl) return;\n            try {\n                fetch(currentWebhookUrl, { method: 'POST' });\n                console.log("Triggered Cloudflare deploy hook.");\n            } catch (e) {\n                console.error("Failed to trigger deploy:", e);\n            }\n        }`;

const newCode = `        async function triggerDeploy() {
            if (!currentWebhookUrl) await loadWebhook();
            if (!currentWebhookUrl) return;
            try {
                fetch(currentWebhookUrl, { method: 'POST', mode: 'no-cors' });
                console.log("Triggered Cloudflare deploy hook.");
                alert("Berhasil disimpan! Memerintahkan Cloudflare untuk mem-build ulang situs. Mohon tunggu sekitar 1-2 menit hingga tayang di halaman utama.");
            } catch (e) {
                console.error("Failed to trigger deploy:", e);
            }
        }`;

if (html.includes(oldCode1)) {
    html = html.replace(oldCode1, newCode);
} else if (html.includes(oldCode2)) {
    html = html.replace(oldCode2, newCode);
} else {
    // maybe it has \r or something
    html = html.replace(/fetch\(currentWebhookUrl, \{ method: 'POST' \}\);\s*console\.log\("Triggered Cloudflare deploy hook."\);/, 'fetch(currentWebhookUrl, { method: \'POST\', mode: \'no-cors\' });\n                console.log("Triggered Cloudflare deploy hook.");\n                alert("Berhasil disimpan! Memerintahkan Cloudflare untuk mem-build ulang situs. Mohon tunggu sekitar 1-2 menit hingga tayang di halaman utama.");');
}

fs.writeFileSync('public/dashboard.html', html);
console.log("Alert added");
