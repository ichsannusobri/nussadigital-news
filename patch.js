const fs = require('fs');

let html = fs.readFileSync('public/dashboard.html', 'utf8');

// 1. Add nav button
html = html.replace(
  `<button class="sidebar-btn" onclick="showTab('analytics')" id="tab-analytics">📊 Analytics</button>`,
  `<button class="sidebar-btn" onclick="showTab('trending')" id="tab-trending">🔥 Trending</button>\n                <button class="sidebar-btn" onclick="showTab('analytics')" id="tab-analytics">📊 Analytics</button>`
);

// 2. Add panel content
const trendingPanel = `
            <!-- TRENDING TAB -->
            <div class="tab-content" id="panel-trending">
                <div class="panel-header">
                    <h2>Manage Trending Topics</h2>
                    <button class="btn-primary" onclick="showAddTrendingForm()">+ Add Topic</button>
                </div>
                
                <form class="article-form" id="trending-form" onsubmit="handleSaveTrending(event)" style="display: none; margin-bottom: 24px;">
                    <input type="hidden" id="trending-id">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="trending-name">Topic Name</label>
                            <input type="text" id="trending-name" required placeholder="e.g. World Cup 2026">
                        </div>
                        <div class="form-group">
                            <label for="trending-category">Target Category</label>
                            <input type="text" id="trending-category" required placeholder="e.g. sport">
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">💾 Save Topic</button>
                        <button type="button" class="btn-secondary" onclick="hideTrendingForm()">Cancel</button>
                    </div>
                </form>

                <div class="articles-table">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="padding: 14px 18px; text-align: left; border-bottom: 1px solid #e5e7eb;">Topic Name</th>
                                <th style="padding: 14px 18px; text-align: left; border-bottom: 1px solid #e5e7eb;">Target Category</th>
                                <th style="padding: 14px 18px; text-align: right; border-bottom: 1px solid #e5e7eb;">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="trending-table-body">
                            <!-- JS fills -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- ANALYTICS TAB -->`;

html = html.replace(`<!-- ANALYTICS TAB -->`, trendingPanel);

// 3. Update showTab
html = html.replace(
  `if (tab === 'analytics') renderAnalytics();`,
  `if (tab === 'analytics') renderAnalytics();\n            if (tab === 'trending') renderTrendingTable();`
);

fs.writeFileSync('public/dashboard.html', html);
console.log('Patch applied successfully!');
