const fs = require('fs');

let html = fs.readFileSync('public/dashboard.html', 'utf8');

const jsCode = `
        // --- TRENDING TOPICS LOGIC ---
        let trendingTopicsCache = [];

        async function fetchTrendingTopics() {
            if (!window.firebaseDB || !window.fsTools) return;
            try {
                const docRef = window.fsTools.doc(window.firebaseDB, 'settings', 'trending');
                const docSnap = await window.fsTools.getDoc(docRef);
                if (docSnap.exists()) {
                    trendingTopicsCache = docSnap.data().topics || [];
                }
            } catch (e) {
                console.error("Error fetching trending topics", e);
            }
        }

        async function renderTrendingTable() {
            await fetchTrendingTopics();
            const tbody = document.getElementById('trending-table-body');
            if (trendingTopicsCache.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 20px; color: #9ca3af;">No trending topics yet.</td></tr>';
                return;
            }
            tbody.innerHTML = trendingTopicsCache.map((t, idx) => \`
                <tr>
                    <td style="padding: 14px 18px; border-bottom: 1px solid #f3f4f6;"><strong>\${t.name}</strong></td>
                    <td style="padding: 14px 18px; border-bottom: 1px solid #f3f4f6;"><span class="category-badge badge-\${t.category.toLowerCase()}">\${t.category}</span></td>
                    <td style="padding: 14px 18px; border-bottom: 1px solid #f3f4f6; text-align: right;" class="action-buttons">
                        <button class="btn-edit" onclick="editTrending(\${idx})" title="Edit">✏️</button>
                        <button class="btn-delete" onclick="deleteTrending(\${idx})" title="Delete">🗑️</button>
                    </td>
                </tr>
            \`).join('');
        }

        function showAddTrendingForm() {
            document.getElementById('trending-form').style.display = 'block';
            document.getElementById('trending-form').reset();
            document.getElementById('trending-id').value = '';
        }

        function hideTrendingForm() {
            document.getElementById('trending-form').style.display = 'none';
        }

        function editTrending(idx) {
            const topic = trendingTopicsCache[idx];
            document.getElementById('trending-form').style.display = 'block';
            document.getElementById('trending-name').value = topic.name;
            document.getElementById('trending-category').value = topic.category;
            document.getElementById('trending-id').value = idx;
        }

        async function handleSaveTrending(e) {
            e.preventDefault();
            const name = document.getElementById('trending-name').value;
            const category = document.getElementById('trending-category').value;
            const idVal = document.getElementById('trending-id').value;

            if (idVal === '') {
                trendingTopicsCache.push({ id: Date.now().toString(), name, category });
            } else {
                trendingTopicsCache[parseInt(idVal)].name = name;
                trendingTopicsCache[parseInt(idVal)].category = category;
            }

            await saveTrendingTopics();
            hideTrendingForm();
            renderTrendingTable();
        }

        async function deleteTrending(idx) {
            if (confirm('Delete this trending topic?')) {
                trendingTopicsCache.splice(idx, 1);
                await saveTrendingTopics();
                renderTrendingTable();
            }
        }

        async function saveTrendingTopics() {
            if (!window.firebaseDB || !window.fsTools) return;
            try {
                const docRef = window.fsTools.doc(window.firebaseDB, 'settings', 'trending');
                await window.fsTools.setDoc(docRef, { topics: trendingTopicsCache });
            } catch (e) {
                console.error("Error saving trending topics", e);
            }
        }
        // -----------------------------
`;

html = html.replace('// Initialization now handled by app.js firebase-ready router', jsCode + '\n        // Initialization now handled by app.js firebase-ready router');

fs.writeFileSync('public/dashboard.html', html);
console.log('JS patched successfully!');
