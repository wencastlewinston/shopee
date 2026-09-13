async function fetchCampData() {
    try {
        const response = await fetch(sheetUrl1);
        const text = await response.text();

        const parseCsv = (text) => {
            const rows = [];
            let currentRow = "";
            let insideQuotes = false;
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                if (char === '"') insideQuotes = !insideQuotes;
                if (char === '\n' && !insideQuotes) { rows.push(currentRow); currentRow = ""; }
                else { currentRow += char; }
            }
            if (currentRow) rows.push(currentRow);
            return rows;
        };

        const rows = parseCsv(text);
        const productBody = document.getElementById('productBody');
        const categoryBar = document.getElementById('category-tool-bar');
        const statTotal = document.getElementById('stat-total');

        if (productBody) productBody.innerHTML = "";
        const categories = new Set();
        const products = [];

        const processRow = (row) => {
            const cols = [];
            let currCol = "";
            let inQ = false;
            for (let i = 0; i < row.length; i++) {
                const c = row[i];
                if (c === '"') inQ = !inQ;
                else if (c === ',' && !inQ) { cols.push(currCol.trim()); currCol = ""; }
                else currCol += c;
            }
            cols.push(currCol.trim());
            return cols;
        };

        rows.slice(1).forEach((row) => {
            const cols = processRow(row);
            if (cols.length < 7) return;
            const [id, category, title, price, imageUrl, affiliateUrl, tag] = cols;

            if (category && category.trim() !== "") {
                categories.add(category.trim());
            }

            products.push({ id, category, title, price, imageUrl, affiliateUrl, tag });
        });

        if (statTotal) statTotal.innerText = products.length;

        if (categoryBar) {
            categoryBar.innerHTML = '';
            const allTag = document.createElement('div');
            allTag.className = 'tag active category-tag';
            allTag.innerText = '全部商品';
            allTag.onclick = function() { filterData('', this, 'category'); };
            categoryBar.appendChild(allTag);

            Array.from(categories).sort().forEach(cat => {
                const tagEl = document.createElement('div');
                tagEl.className = 'tag category-tag'; 
                tagEl.innerText = cat;
                tagEl.onclick = function() { filterData(cat, this, 'category'); };
                categoryBar.appendChild(tagEl);
            });
        }

        renderProducts(products);
        window.allProducts = products;

    } catch (e) {
        console.error("載入失敗：", e);
        const productBody = document.getElementById('productBody');
        if (productBody) {
            productBody.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #888;">抱歉，目前無法載入分潤商品資料，請稍後再試。</div>`;
        }
    }
}

function renderProducts(list) {
    const productBody = document.getElementById('productBody');
    if (!productBody) return;
    productBody.innerHTML = "";

    list.forEach(p => {
        const item = document.createElement('div');
        item.className = 'product-card fade-in';
        item.setAttribute('data-category', p.category);
        item.setAttribute('data-title', p.title);

        item.innerHTML = `
            <div class="product-thumb" onclick="window.open('${p.affiliateUrl}', '_blank')">
                <img src="${p.imageUrl}" alt="${p.title}" loading="lazy">
                ${p.tag ? `<div class="product-tag">${p.tag}</div>` : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${p.category}</div>
                <div class="product-title">${p.title}</div>
                <div class="product-price">NT$ ${p.price}</div>
                <a href="${p.affiliateUrl}" target="_blank" rel="noopener noreferrer" class="product-btn" onclick="event.stopPropagation()">前往蝦皮搶購</a>
            </div>
        `;
        productBody.appendChild(item);
    });
}

function searchTable() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    const activeCategory = document.querySelector('.category-tag.active')?.innerText || '全部商品';
    
    if (!window.allProducts) return;

    const filtered = window.allProducts.filter(p => {
        const matchCategory = (activeCategory === '全部商品' || p.category === activeCategory);
        const matchKeyword = p.title.toLowerCase().includes(keyword) || p.category.toLowerCase().includes(keyword);
        return matchCategory && matchKeyword;
    });

    renderProducts(filtered);
    if(window.updateStats) updateStats();
}

function filterData(value, element, type) {
    const tags = document.querySelectorAll('.category-tag');
    tags.forEach(t => t.classList.remove('active'));
    element.classList.add('active');

    const keyword = document.getElementById('searchInput').value.toLowerCase();
    
    const filtered = window.allProducts.filter(p => {
        const matchCategory = (value === '' || p.category === value);
        const matchKeyword = p.title.toLowerCase().includes(keyword) || p.category.toLowerCase().includes(keyword);
        return matchCategory && matchKeyword;
    });

    renderProducts(filtered);
    if(window.updateStats) updateStats();
}

fetchCampData();
