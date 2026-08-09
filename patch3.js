const fs = require('fs');

let html = fs.readFileSync('public/dashboard.html', 'utf8');

// 1. Add "Deploy" to sidebar
if (!html.includes('tab-deploy')) {
    html = html.replace(
        '<button class="sidebar-btn" onclick="showTab(\'analytics\')" id="tab-analytics">📊 Analytics</button>',
        '<button class="sidebar-btn" onclick="showTab(\'analytics\')" id="tab-analytics">📊 Analytics</button>\n                <button class="sidebar-btn" onclick="showTab(\'deploy\')" id="tab-deploy">🚀 Deploy (Webhook)</button>'
    );
}

// 2. Add "Deploy" panel
const deployPanel = `
            <!-- DEPLOY TAB -->
            <div class="tab-content" id="panel-deploy">
                <div class="panel-header">
                    <h2>Cloudflare Deploy Webhook</h2>
                </div>
                <div class="analytics-grid" style="grid-template-columns: 1fr;">
                    <div class="stat-card" style="text-align: left;">
                        <h3>Automated Deployment</h3>
                        <p style="color: #6b7280; font-size: 0.9rem; margin-bottom: 16px;">
                            Enter your Cloudflare Pages Deploy Hook URL below. Once saved, every time you add, edit, or delete an article/trending topic, this dashboard will automatically trigger Cloudflare to rebuild your static website so the changes go live instantly.
                        </p>
                        <form onsubmit="saveWebhook(event)" style="display: flex; gap: 12px; margin-top: 16px;">
                            <input type="url" id="webhook-url" placeholder="https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/..." style="flex: 1; padding: 12px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;" required>
                            <button type="submit" class="btn-primary" id="webhook-save-btn">💾 Save URL</button>
                        </form>
                        <div id="webhook-status" style="margin-top: 12px; font-size: 0.85rem; color: #10b981; display: none;">Saved successfully!</div>
                    </div>
                </div>
            </div>
`;

if (!html.includes('panel-deploy')) {
    html = html.replace('<!-- ANALYTICS TAB -->', deployPanel + '\n            <!-- ANALYTICS TAB -->');
}

// 3. Inject JS logic for Webhooks
const webhookJs = `
        let currentWebhookUrl = "";

        async function loadWebhook() {
            if (!window.firebaseDB || !window.fsTools) return;
            try {
                const docRef = window.fsTools.doc(window.firebaseDB, 'settings', 'config');
                const docSnap = await window.fsTools.getDoc(docRef);
                if (docSnap.exists() && docSnap.data().webhookUrl) {
                    currentWebhookUrl = docSnap.data().webhookUrl;
                    document.getElementById('webhook-url').value = currentWebhookUrl;
                }
            } catch (e) {
                console.error("Error loading webhook", e);
            }
        }

        async function saveWebhook(e) {
            e.preventDefault();
            const url = document.getElementById('webhook-url').value.trim();
            if (!window.firebaseDB || !window.fsTools) return;
            
            try {
                const btn = document.getElementById('webhook-save-btn');
                btn.textContent = "Saving...";
                const docRef = window.fsTools.doc(window.firebaseDB, 'settings', 'config');
                await window.fsTools.setDoc(docRef, { webhookUrl: url }, { merge: true });
                currentWebhookUrl = url;
                btn.textContent = "💾 Save URL";
                const status = document.getElementById('webhook-status');
                status.style.display = 'block';
                setTimeout(() => status.style.display = 'none', 3000);
            } catch (error) {
                console.error("Error saving webhook:", error);
                alert("Failed to save Webhook URL.");
            }
        }

        async function triggerDeploy() {
            if (!currentWebhookUrl) return;
            try {
                fetch(currentWebhookUrl, { method: 'POST' });
                console.log("Triggered Cloudflare deploy hook.");
            } catch (e) {
                console.error("Failed to trigger deploy:", e);
            }
        }

        // Add 'deploy' to showTab
        const oldShowTab = showTab.toString();
        // we'll just redefine it entirely or add logic
`;

html = html.replace('function showTab(tab) {', webhookJs + '\n        function showTab(tab) {\n            if (tab === "deploy") loadWebhook();');

// 4. Update handleSave, deleteArticle, handleSaveTrending, deleteTrending to call triggerDeploy()
html = html.replace('await window.fsTools.setDoc(window.fsTools.doc(window.firebaseDB, "articles", article.id), article);', 'await window.fsTools.setDoc(window.fsTools.doc(window.firebaseDB, "articles", article.id), article);\n            triggerDeploy();');
html = html.replace('await window.fsTools.deleteDoc(window.fsTools.doc(window.firebaseDB, "articles", id));', 'await window.fsTools.deleteDoc(window.fsTools.doc(window.firebaseDB, "articles", id));\n                triggerDeploy();');

html = html.replace('await saveTrendingTopics();\n            hideTrendingForm();\n            renderTrendingTable();', 'await saveTrendingTopics();\n            hideTrendingForm();\n            renderTrendingTable();\n            triggerDeploy();');
html = html.replace('trendingTopicsCache.splice(idx, 1);\n                await saveTrendingTopics();\n                renderTrendingTable();', 'trendingTopicsCache.splice(idx, 1);\n                await saveTrendingTopics();\n                renderTrendingTable();\n                triggerDeploy();');

fs.writeFileSync('public/dashboard.html', html);
console.log('Patch 3 successful');
