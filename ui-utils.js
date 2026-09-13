function filterData(val, btn, type) {
    if (type === 'category') {
        document.querySelectorAll('.category-tag').forEach(t => t.classList.remove('active'));
    }
    if (btn) btn.classList.add('active');
    searchTable();
}

function searchTable() { 
    const searchInput = document.getElementById("searchInput") ? document.getElementById("searchInput").value.toUpperCase() : ""; 
    const activeCategory = document.querySelector('.category-tag.active')?.innerText || '全部商品';
    
    document.querySelectorAll(".product-card").forEach(item => { 
        const text = item.textContent.toUpperCase();
        const cat = item.getAttribute('data-category') || "";

        const matchCategory = (activeCategory === '全部商品' || cat === activeCategory);
        const matchSearch = searchInput === "" || text.includes(searchInput);

        const isMatch = matchCategory && matchSearch;
        item.style.display = isMatch ? "" : "none"; 
    }); 
    if (window.updateStats) updateStats(); 
}

function updateStats() {
    const productBody = document.getElementById('productBody');
    if (!productBody) return;
    
    const visibleItems = Array.from(productBody.querySelectorAll('.product-card')).filter(item => item.style.display !== 'none');
    const totalEl = document.getElementById('stat-total');
    if (totalEl) {
        totalEl.innerText = visibleItems.length;
    }
}

window.onscroll = () => { 
    const btn = document.getElementById("goTopBtn");
    if(btn) btn.style.display = (window.scrollY > 300) ? "flex" : "none"; 
};
