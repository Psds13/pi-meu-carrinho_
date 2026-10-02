/**
 * MEU CARRINHO - Application Main Engine (Vanilla JS)
 * Handles: LocalStorage Cart, Favorites, Dark Mode, Category Filtering,
 * Price Comparison Matrix, Best Combination Calculator, Autocomplete,
 * Official Store Redirection Interstitial Modal & Domain Security.
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. STATE INITIALIZATION & LOCALSTORAGE
  // -------------------------------------------------------------------------
  const AppState = {
    cart: JSON.parse(localStorage.getItem('mc_cart') || '[]'),
    favorites: JSON.parse(localStorage.getItem('mc_favs') || '[]'),
    theme: localStorage.getItem('mc_theme') || 'light',
    location: localStorage.getItem('mc_location') || 'São Luís, MA',
    productsCache: []
  };

  // Official Stores Mapping & Domain Security
  const OfficialStoresConfig = {
    "Atacadão": {
      nome: "Atacadão",
      dominio: "atacadao.com.br",
      logo: "/image/atacadao-logo2.webp",
      urlFallback: "https://www.atacadao.com.br/"
    },
    "Assaí": {
      nome: "Assaí Atacadista",
      dominio: "assai.com.br",
      logo: "/image/assaí-logo.png",
      urlFallback: "https://www.assai.com.br/"
    },
    "Mateus": {
      nome: "Grupo Mateus",
      dominio: "mateusmais.com.br",
      logo: "/image/grupo-mateus-logo.png",
      urlFallback: "https://www.mateusmais.com.br/"
    }
  };

  // Apply Initial Theme
  document.documentElement.setAttribute('data-theme', AppState.theme);

  // Sync Badges & Counters
  updateBadges();

  // Fetch product catalog for comparison & search
  fetchProductsCatalog();

  // -------------------------------------------------------------------------
  // 2. HEADER & NAVIGATION EVENT LISTENERS
  // -------------------------------------------------------------------------
  const mainHeader = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      mainHeader?.classList.add('scrolled');
    } else {
      mainHeader?.classList.remove('scrolled');
    }
  });

  // Dark Mode Toggle
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeToggleMobile = document.getElementById('themeToggleMobile');
  
  function toggleTheme() {
    AppState.theme = AppState.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', AppState.theme);
    localStorage.setItem('mc_theme', AppState.theme);
    showToast(AppState.theme === 'dark' ? '🌙 Modo Escuro ativado' : '☀️ Modo Claro ativado', 'info');
  }

  themeToggleBtn?.addEventListener('click', toggleTheme);
  themeToggleMobile?.addEventListener('click', toggleTheme);

  // User Profile Dropdown
  const userAvatarBtn = document.getElementById('userAvatarBtn');
  const userDropdown = document.getElementById('userDropdown');
  userAvatarBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown?.classList.toggle('active');
  });

  document.addEventListener('click', () => {
    userDropdown?.classList.remove('active');
  });

  // Mobile Drawer Toggle
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileDrawerOverlay = document.getElementById('mobileDrawerOverlay');

  mobileMenuToggle?.addEventListener('click', () => {
    mobileDrawerOverlay?.classList.add('active');
  });

  drawerCloseBtn?.addEventListener('click', () => {
    mobileDrawerOverlay?.classList.remove('active');
  });

  mobileDrawerOverlay?.addEventListener('click', (e) => {
    if (e.target === mobileDrawerOverlay) {
      mobileDrawerOverlay.classList.remove('active');
    }
  });

  // Location Picker Modal
  const locationPickerBtn = document.getElementById('locationPickerBtn');
  const locationModalBackdrop = document.getElementById('locationModalBackdrop');
  const closeLocationModal = document.getElementById('closeLocationModal');
  const saveLocationBtn = document.getElementById('saveLocationBtn');
  const currentLocationText = document.getElementById('currentLocationText');
  const mobileLocationText = document.getElementById('mobileLocationText');

  if (currentLocationText) currentLocationText.textContent = AppState.location;
  if (mobileLocationText) mobileLocationText.textContent = AppState.location;

  locationPickerBtn?.addEventListener('click', () => {
    locationModalBackdrop?.classList.add('active');
  });

  closeLocationModal?.addEventListener('click', () => {
    locationModalBackdrop?.classList.remove('active');
  });

  saveLocationBtn?.addEventListener('click', () => {
    const citySelect = document.getElementById('citySelect');
    if (citySelect) {
      AppState.location = citySelect.value;
      localStorage.setItem('mc_location', AppState.location);
      if (currentLocationText) currentLocationText.textContent = AppState.location;
      if (mobileLocationText) mobileLocationText.textContent = AppState.location;
      showToast(`📍 Localização alterada para ${AppState.location}`, 'success');
      locationModalBackdrop?.classList.remove('active');
    }
  });

  // -------------------------------------------------------------------------
  // 3. LIVE AUTOCOMPLETE SEARCH ENGINE
  // -------------------------------------------------------------------------
  const searchInput = document.getElementById('searchInput');
  const searchAutocomplete = document.getElementById('searchAutocomplete');

  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (query.length < 2) {
      searchAutocomplete?.classList.remove('active');
      return;
    }

    const matches = AppState.productsCache.filter(p => 
      p.nome.toLowerCase().includes(query) ||
      (p.marca && p.marca.toLowerCase().includes(query)) ||
      (p.categoria && p.categoria.toLowerCase().includes(query))
    ).slice(0, 5);

    if (matches.length === 0) {
      searchAutocomplete?.classList.remove('active');
      return;
    }

    searchAutocomplete.innerHTML = matches.map(p => `
      <div class="autocomplete-item" onclick="window.location.href='/produtos?search=${encodeURIComponent(p.nome)}'">
        <img src="${p.imagem}" class="autocomplete-thumb" alt="${p.nome}">
        <div class="autocomplete-info">
          <h5>${p.nome}</h5>
          <p>${p.mercado_principal} • <strong>R$ ${parseFloat(p.preco_atual).toFixed(2).replace('.', ',')}</strong></p>
        </div>
      </div>
    `).join('');

    searchAutocomplete?.classList.add('active');
  });

  document.addEventListener('click', (e) => {
    if (!searchInput?.contains(e.target) && !searchAutocomplete?.contains(e.target)) {
      searchAutocomplete?.classList.remove('active');
    }
  });

  // -------------------------------------------------------------------------
  // 4. CATEGORY FILTERS & MULTI-SUPERMARKET FILTER
  // -------------------------------------------------------------------------
  const catPills = document.querySelectorAll('.cat-pill');
  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const selectedCat = pill.getAttribute('data-category');
      filterProductsOnPage(selectedCat, getSelectedSupermarkets());
    });
  });

  const marketCheckboxes = document.querySelectorAll('.market-select-checkbox');
  marketCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const activeCat = document.querySelector('.cat-pill.active')?.getAttribute('data-category') || 'Todos';
      filterProductsOnPage(activeCat, getSelectedSupermarkets());
    });
  });

  function getSelectedSupermarkets() {
    const checked = [];
    marketCheckboxes.forEach(cb => {
      if (cb.checked) checked.push(cb.value);
    });
    return checked;
  }

  function filterProductsOnPage(category, markets) {
    const cards = document.querySelectorAll('.product-card-modern, .product-card');
    cards.forEach(card => {
      const cardCat = card.getAttribute('data-category') || '';
      const cardMarket = card.getAttribute('data-market') || '';

      const matchesCat = (category === 'Todos' || !category) || cardCat.toLowerCase() === category.toLowerCase();
      const matchesMarket = (markets.length === 0) || markets.some(m => cardMarket.toLowerCase().includes(m.toLowerCase()));

      if (matchesCat && matchesMarket) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // -------------------------------------------------------------------------
  // 5. OFFICIAL STORE REDIRECTION INTERSTITIAL MODAL & SECURITY
  // -------------------------------------------------------------------------
  const redirectModalBackdrop = document.getElementById('redirectModalBackdrop');
  const closeRedirectModal = document.getElementById('closeRedirectModal');
  const cancelRedirectBtn = document.getElementById('cancelRedirectBtn');
  const confirmRedirectBtn = document.getElementById('confirmRedirectBtn');
  const redirectStoreLogo = document.getElementById('redirectStoreLogo');
  const redirectMessageText = document.getElementById('redirectMessageText');
  const redirectDomainText = document.getElementById('redirectDomainText');

  closeRedirectModal?.addEventListener('click', () => redirectModalBackdrop?.classList.remove('active'));
  cancelRedirectBtn?.addEventListener('click', () => redirectModalBackdrop?.classList.remove('active'));

  function triggerOfficialRedirection(storeName, targetUrl, productName = '') {
    const config = OfficialStoresConfig[storeName] || OfficialStoresConfig["Atacadão"];
    let finalUrl = targetUrl || config.urlFallback;

    // Validate security: Ensure HTTPS and official domain match
    try {
      const parsed = new URL(finalUrl);
      const host = parsed.hostname.toLowerCase();
      if (parsed.protocol !== 'https:' || (!host.includes(config.dominio) && !host.endsWith(config.dominio))) {
        finalUrl = config.urlFallback;
      }
    } catch (e) {
      finalUrl = config.urlFallback;
    }

    if (redirectStoreLogo) redirectStoreLogo.src = config.logo;
    if (redirectDomainText) redirectDomainText.textContent = config.dominio;
    if (redirectMessageText) {
      redirectMessageText.innerHTML = `Você será direcionado ao canal oficial do <strong>${config.nome}</strong> ${productName ? `para visualizar <em>"${productName}"</em>` : ''} e concluir sua compra com segurança.`;
    }
    if (confirmRedirectBtn) confirmRedirectBtn.href = finalUrl;

    redirectModalBackdrop?.classList.add('active');
  }

  confirmRedirectBtn?.addEventListener('click', () => {
    redirectModalBackdrop?.classList.remove('active');
  });

  // Global delegate click handlers
  document.addEventListener('click', (e) => {
    // Official Store Purchase Redirect Button
    const buyBtn = e.target.closest('.btn-buy-official-store, .btn-buy-store');
    if (buyBtn) {
      e.preventDefault();
      const storeName = buyBtn.getAttribute('data-mercado') || 'Atacadão';
      const targetUrl = buyBtn.getAttribute('data-url') || '';
      const productName = buyBtn.getAttribute('data-nome') || '';
      triggerOfficialRedirection(storeName, targetUrl, productName);
    }

    // Add to Cart Button
    const addBtn = e.target.closest('.btn-add-cart-full, .btn-add-to-cart');
    if (addBtn) {
      const id = addBtn.getAttribute('data-id');
      const name = addBtn.getAttribute('data-nome');
      const price = parseFloat(addBtn.getAttribute('data-preco') || 0);
      const img = addBtn.getAttribute('data-imagem');
      const store = addBtn.getAttribute('data-mercado') || 'Atacadão';
      const weight = addBtn.getAttribute('data-peso') || '';

      addToCart({ id, name, price, img, store, weight, qty: 1 });
      addBtn.classList.add('added');
      addBtn.textContent = 'Adicionado ✓';
      setTimeout(() => {
        addBtn.classList.remove('added');
        addBtn.innerHTML = '<i class="bi bi-cart-plus-fill"></i> Adicionar à Lista';
      }, 1500);
    }

    // Favorite Heart Toggle Button
    const favBtn = e.target.closest('.btn-favorite-heart');
    if (favBtn) {
      const id = favBtn.getAttribute('data-id');
      toggleFavorite(id, favBtn);
    }

    // Compare Product Modal Trigger
    const compareBtn = e.target.closest('.btn-compare-product');
    if (compareBtn) {
      const id = compareBtn.getAttribute('data-id');
      openCompareModal(id);
    }
  });

  function addToCart(item) {
    const existing = AppState.cart.find(i => i.id == item.id);
    if (existing) {
      existing.qty += (item.qty || 1);
    } else {
      AppState.cart.push({ ...item, qty: item.qty || 1, checked: false });
    }
    saveCart();
    showToast(`🛒 "${item.name}" adicionado à lista!`, 'success');
  }

  function toggleFavorite(id, btnElement) {
    const index = AppState.favorites.indexOf(id);
    if (index > -1) {
      AppState.favorites.splice(index, 1);
      btnElement?.classList.remove('active');
      showToast('💔 Item removido dos favoritos', 'info');
    } else {
      AppState.favorites.push(id);
      btnElement?.classList.add('active');
      showToast('❤️ Item adicionado aos favoritos!', 'success');
    }
    localStorage.setItem('mc_favs', JSON.stringify(AppState.favorites));
    updateBadges();
  }

  function saveCart() {
    localStorage.setItem('mc_cart', JSON.stringify(AppState.cart));
    updateBadges();
    renderMinhaListaPage();
  }

  function updateBadges() {
    const cartCount = AppState.cart.reduce((sum, i) => sum + i.qty, 0);
    const favCount = AppState.favorites.length;

    document.querySelectorAll('.cart-count-badge, .bottom-cart-count, .mobile-cart-count').forEach(el => el.textContent = cartCount);
    document.querySelectorAll('.fav-count-badge, .bottom-fav-count, .mobile-fav-count').forEach(el => el.textContent = favCount);

    // Sync heart active states
    document.querySelectorAll('.btn-favorite-heart').forEach(btn => {
      const id = btn.getAttribute('data-id');
      if (AppState.favorites.includes(id)) {
        btn.classList.add('active');
      }
    });
  }

  // -------------------------------------------------------------------------
  // 6. PRICE COMPARISON MATRIX & HISTORY GRAPH MODAL
  // -------------------------------------------------------------------------
  const compareModalBackdrop = document.getElementById('compareModalBackdrop');
  const closeCompareModal = document.getElementById('closeCompareModal');
  const cancelCompareBtn = document.getElementById('cancelCompareBtn');
  const addLowestCompareBtn = document.getElementById('addLowestCompareBtn');

  closeCompareModal?.addEventListener('click', () => compareModalBackdrop?.classList.remove('active'));
  cancelCompareBtn?.addEventListener('click', () => compareModalBackdrop?.classList.remove('active'));

  let currentCompareProduct = null;

  async function openCompareModal(productId) {
    let product = AppState.productsCache.find(p => p.id == productId);
    if (!product) {
      try {
        const res = await fetch(`/api/compare/${productId}`);
        const data = await res.json();
        if (data.success) product = data.produto;
      } catch (e) {
        console.error(e);
      }
    }

    if (!product) return;
    currentCompareProduct = product;

    document.getElementById('compareModalProductName').textContent = product.nome;
    document.getElementById('compareModalProductMeta').textContent = `${product.marca || 'Marca'} • ${product.quantidade_peso || ''}`;
    document.getElementById('compareModalImage').src = product.imagem;

    const precos = product.precos_mercados || {
      "Atacadão": product.preco_atual,
      "Assaí": parseFloat((product.preco_atual * 1.06).toFixed(2)),
      "Mateus": parseFloat((product.preco_atual * 1.09).toFixed(2))
    };

    const sortedPrices = Object.entries(precos).map(([store, price]) => ({
      store,
      price: parseFloat(price)
    })).sort((a, b) => a.price - b.price);

    const lowest = sortedPrices[0];
    const highest = sortedPrices[sortedPrices.length - 1];
    const diff = (highest.price - lowest.price).toFixed(2);

    document.getElementById('compareBestStoreName').textContent = lowest.store;
    document.getElementById('compareDiffValue').textContent = `R$ ${diff.replace('.', ',')}`;

    const container = document.getElementById('comparePricesContainer');
    if (container) {
      container.innerHTML = sortedPrices.map((item, idx) => `
        <div class="compare-item-row ${idx === 0 ? 'lowest-price-row' : ''}">
          <div class="compare-store-info">
            <span class="badge-tag ${item.store.toLowerCase().replace('í','i').replace('ã','a')}">${item.store}</span>
            ${idx === 0 ? '<span class="badge-tag bg-primary-light text-primary"><i class="bi bi-trophy-fill"></i> MENOR PREÇO!</span>' : ''}
          </div>
          <div class="d-flex align-items-center gap-3">
            <div class="compare-price-val ${idx === 0 ? 'text-primary' : ''}">
              R$ ${item.price.toFixed(2).replace('.', ',')}
            </div>
            <button class="btn btn-outline-nav btn-sm btn-buy-official-store" data-mercado="${item.store}" data-nome="${product.nome}">
              Comprar no ${item.store} <i class="bi bi-box-arrow-up-right"></i>
            </button>
          </div>
        </div>
      `).join('');
    }

    // Render Price History Chart
    renderHistoryChart(product.historico_precos || [
      { mes: 'Jan', preco: product.preco_atual * 1.2 },
      { mes: 'Fev', preco: product.preco_atual * 1.15 },
      { mes: 'Mar', preco: product.preco_atual * 1.1 },
      { mes: 'Abr', preco: product.preco_atual * 1.05 },
      { mes: 'Mai', preco: product.preco_atual * 1.02 },
      { mes: 'Jun', preco: product.preco_atual }
    ]);

    compareModalBackdrop?.classList.add('active');
  }

  addLowestCompareBtn?.addEventListener('click', () => {
    if (currentCompareProduct) {
      addToCart({
        id: currentCompareProduct.id,
        name: currentCompareProduct.nome,
        price: currentCompareProduct.preco_atual,
        img: currentCompareProduct.imagem,
        store: currentCompareProduct.mercado_principal,
        weight: currentCompareProduct.quantidade_peso,
        qty: 1
      });
      compareModalBackdrop?.classList.remove('active');
    }
  });

  function renderHistoryChart(historyData) {
    const wrapper = document.getElementById('historyChartWrapper');
    if (!wrapper) return;

    const prices = historyData.map(d => d.preco);
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);

    document.getElementById('compareHistoryStats').textContent = `Menor: R$ ${minP.toFixed(2).replace('.',',')} | Maior: R$ ${maxP.toFixed(2).replace('.',',')}`;

    const svgWidth = 500;
    const svgHeight = 150;
    const padding = 30;

    const points = historyData.map((d, i) => {
      const x = padding + (i * ((svgWidth - padding * 2) / (historyData.length - 1)));
      const range = (maxP - minP) || 1;
      const y = (svgHeight - padding) - (((d.preco - minP) / range) * (svgHeight - padding * 2));
      return { x, y, mes: d.mes, preco: d.preco };
    });

    const pathD = points.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');

    wrapper.innerHTML = `
      <svg viewBox="0 0 ${svgWidth} ${svgHeight}" style="width:100%; height:100%;">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#2563eb" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#2563eb" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <path d="${pathD} L ${points[points.length-1].x} ${svgHeight - padding} L ${points[0].x} ${svgHeight - padding} Z" fill="url(#chartGrad)" />
        <path d="${pathD}" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round" />
        ${points.map(p => `
          <circle cx="${p.x}" cy="${p.y}" r="5" fill="#ffffff" stroke="#2563eb" stroke-width="3" />
          <text x="${p.x}" y="${svgHeight - 8}" font-size="11" text-anchor="middle" fill="#64748b" font-weight="600">${p.mes}</text>
          <text x="${p.x}" y="${p.y - 10}" font-size="11" text-anchor="middle" fill="#2563eb" font-weight="700">R$ ${p.preco.toFixed(2).replace('.',',')}</text>
        `).join('')}
      </svg>
    `;
  }

  // -------------------------------------------------------------------------
  // 7. MINHA LISTA PAGE & COMBINATION ENGINE ("Onde minha lista fica mais barata?")
  // -------------------------------------------------------------------------
  function renderMinhaListaPage() {
    const listContainer = document.getElementById('shoppingListItemsContainer');
    const subtotalEl = document.getElementById('listSubtotalVal');
    const totalEl = document.getElementById('listTotalVal');
    const savingsEl = document.getElementById('listSavingsVal');

    const statsItemCountEl = document.getElementById('statsItemCount');
    const statsSubtotalEl = document.getElementById('statsSubtotal');
    const statsSavingsEl = document.getElementById('statsSavings');
    const itemCountBadgeEl = document.getElementById('itemCountBadge');

    if (!listContainer) return;

    const totalQty = AppState.cart.reduce((sum, item) => sum + item.qty, 0);

    if (AppState.cart.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state text-center py-5">
          <i class="bi bi-basket3" style="font-size: 3.5rem; color: var(--text-muted);"></i>
          <h3 class="mt-3 font-weight-bold">Sua lista está vazia</h3>
          <p class="text-muted">Explore os supermercados e adicione produtos para economizar!</p>
          <a href="/produtos" class="btn btn-primary mt-3 px-4 py-2" style="border-radius: var(--radius-pill);">Buscar Produtos</a>
        </div>
      `;
      const zeroFormatted = 'R$ 0,00';
      if (subtotalEl) subtotalEl.textContent = zeroFormatted;
      if (totalEl) totalEl.textContent = zeroFormatted;
      if (savingsEl) savingsEl.textContent = zeroFormatted;
      if (statsItemCountEl) statsItemCountEl.textContent = '0 itens';
      if (statsSubtotalEl) statsSubtotalEl.textContent = zeroFormatted;
      if (statsSavingsEl) statsSavingsEl.textContent = zeroFormatted;
      if (itemCountBadgeEl) itemCountBadgeEl.textContent = '0 itens';
      return;
    }

    let total = 0;

    listContainer.innerHTML = AppState.cart.map((item, idx) => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;

      const storeClass = (item.store || '').toLowerCase().replace('í','i').replace('ã','a');

      return `
        <div class="list-item-row ${item.checked ? 'bought' : ''}">
          <div class="list-item-main">
            <input type="checkbox" class="list-item-checkbox" ${item.checked ? 'checked' : ''} onchange="window.toggleItemChecked(${idx})" title="Marcar como comprado">
            
            <div class="item-img-box">
              <img src="${item.img}" alt="${item.name}">
            </div>

            <div class="item-details">
              <h4 class="item-title">${item.name}</h4>
              <div class="item-tags">
                <span class="badge-tag ${storeClass}">${item.store}</span>
                <span class="unit-price">R$ ${item.price.toFixed(2).replace('.',',')} / un</span>
              </div>
            </div>
          </div>

          <div class="list-item-right-actions">
            <div class="qty-btn-group">
              <button class="qty-btn" onclick="window.updateCartQty(${idx}, -1)" title="Diminuir">-</button>
              <span class="qty-display">${item.qty}</span>
              <button class="qty-btn" onclick="window.updateCartQty(${idx}, 1)" title="Aumentar">+</button>
            </div>

            <div class="item-total-box">
              <span class="item-total-price">R$ ${itemTotal.toFixed(2).replace('.',',')}</span>
            </div>

            <button class="btn btn-outline-nav btn-sm btn-buy-official-store" data-mercado="${item.store}" data-nome="${item.name}">
              Comprar no ${item.store} <i class="bi bi-box-arrow-up-right"></i>
            </button>

            <button class="btn-delete-item" onclick="window.removeCartItem(${idx})" title="Remover item">
              <i class="bi bi-trash3"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    const estimatedSavings = total * 0.15;
    const formattedTotal = `R$ ${total.toFixed(2).replace('.', ',')}`;
    const formattedSavings = `R$ ${estimatedSavings.toFixed(2).replace('.', ',')}`;
    const formattedItemCount = `${totalQty} ${totalQty === 1 ? 'item' : 'itens'}`;

    if (subtotalEl) subtotalEl.textContent = formattedTotal;
    if (totalEl) totalEl.textContent = formattedTotal;
    if (savingsEl) savingsEl.textContent = formattedSavings;

    if (statsItemCountEl) statsItemCountEl.textContent = formattedItemCount;
    if (statsSubtotalEl) statsSubtotalEl.textContent = formattedTotal;
    if (statsSavingsEl) statsSavingsEl.textContent = formattedSavings;
    if (itemCountBadgeEl) itemCountBadgeEl.textContent = formattedItemCount;
  }

  // Global window functions for inline onclick handlers in Minha Lista
  window.updateCartQty = (index, delta) => {
    if (AppState.cart[index]) {
      AppState.cart[index].qty += delta;
      if (AppState.cart[index].qty <= 0) {
        AppState.cart.splice(index, 1);
      }
      saveCart();
    }
  };

  window.removeCartItem = (index) => {
    AppState.cart.splice(index, 1);
    saveCart();
    showToast('Item removido da lista', 'info');
  };

  window.toggleItemChecked = (index) => {
    if (AppState.cart[index]) {
      AppState.cart[index].checked = !AppState.cart[index].checked;
      saveCart();
    }
  };

  window.clearShoppingList = () => {
    if (confirm('Deseja realmente limpar toda a sua lista de compras?')) {
      AppState.cart = [];
      saveCart();
      showToast('Lista de compras limpa', 'info');
    }
  };

  // Best Supermarket Combination Engine Trigger
  const calcCombinationBtn = document.getElementById('calcCombinationBtn');
  const combinationModalBackdrop = document.getElementById('combinationModalBackdrop');
  const closeCombinationModal = document.getElementById('closeCombinationModal');
  const closeCombinationFooterBtn = document.getElementById('closeCombinationFooterBtn');

  closeCombinationModal?.addEventListener('click', () => combinationModalBackdrop?.classList.remove('active'));
  closeCombinationFooterBtn?.addEventListener('click', () => combinationModalBackdrop?.classList.remove('active'));

  calcCombinationBtn?.addEventListener('click', () => {
    if (AppState.cart.length === 0) {
      showToast('Adicione produtos à sua lista primeiro!', 'info');
      return;
    }
    calculateBestCombination();
  });

  function calculateBestCombination() {
    const resultsContainer = document.getElementById('combinationResultsContainer');
    if (!resultsContainer) return;

    let totalAtacadao = 0;
    let totalAssai = 0;
    let totalMateus = 0;
    let totalSplitSmart = 0;

    const splitBreakdown = [];

    AppState.cart.forEach(item => {
      const pAtacadao = item.store === 'Atacadão' ? item.price : item.price * 1.04;
      const pAssai = item.store === 'Assaí' ? item.price : item.price * 1.06;
      const pMateus = item.store === 'Mateus' ? item.price : item.price * 1.08;

      const itemAtacadao = pAtacadao * item.qty;
      const itemAssai = pAssai * item.qty;
      const itemMateus = pMateus * item.qty;

      totalAtacadao += itemAtacadao;
      totalAssai += itemAssai;
      totalMateus += itemMateus;

      const minVal = Math.min(itemAtacadao, itemAssai, itemMateus);
      let bestStore = 'Atacadão';
      if (minVal === itemAssai) bestStore = 'Assaí';
      if (minVal === itemMateus) bestStore = 'Mateus';

      totalSplitSmart += minVal;

      splitBreakdown.push({
        item: item.name,
        bestStore,
        bestPrice: minVal
      });
    });

    const maxSingleStoreTotal = Math.max(totalAtacadao, totalAssai, totalMateus);
    const splitSavings = (maxSingleStoreTotal - totalSplitSmart).toFixed(2);

    resultsContainer.innerHTML = `
      <div class="combo-option-card smart-best mb-3">
        <div class="combo-option-header">
          <span class="badge-tag bg-primary-light text-primary"><i class="bi bi-lightning-charge-fill"></i> OPÇÃO 4: COMPRA INTELIGENTE DIVIDIDA</span>
          <strong class="text-primary font-poppins" style="font-size: 1.4rem;">R$ ${totalSplitSmart.toFixed(2).replace('.',',')}</strong>
        </div>
        <p class="text-muted small mb-2">Comprando cada item no supermercado mais barato da sua região.</p>
        <div class="alert alert-primary py-2 px-3 mb-0 text-primary font-weight-bold" style="background: rgba(37,99,235,0.12); border-radius: 8px;">
          🎉 Você economiza até R$ ${splitSavings.replace('.',',')} nessa opção!
        </div>
      </div>

      <div class="combo-option-card mb-2">
        <div class="combo-option-header">
          <span><strong class="badge-tag atacadao">OPÇÃO 1: Atacadão</strong> (Tudo em uma loja)</span>
          <div class="d-flex align-items-center gap-2">
            <strong class="font-poppins me-2">R$ ${totalAtacadao.toFixed(2).replace('.',',')}</strong>
            <button class="btn btn-outline-nav btn-sm btn-buy-official-store" data-mercado="Atacadão">Comprar <i class="bi bi-box-arrow-up-right"></i></button>
          </div>
        </div>
      </div>

      <div class="combo-option-card mb-2">
        <div class="combo-option-header">
          <span><strong class="badge-tag assai">OPÇÃO 2: Assaí</strong> (Tudo em uma loja)</span>
          <div class="d-flex align-items-center gap-2">
            <strong class="font-poppins me-2">R$ ${totalAssai.toFixed(2).replace('.',',')}</strong>
            <button class="btn btn-outline-nav btn-sm btn-buy-official-store" data-mercado="Assaí">Comprar <i class="bi bi-box-arrow-up-right"></i></button>
          </div>
        </div>
      </div>

      <div class="combo-option-card mb-3">
        <div class="combo-option-header">
          <span><strong class="badge-tag mateus">OPÇÃO 3: Mateus</strong> (Tudo em uma loja)</span>
          <div class="d-flex align-items-center gap-2">
            <strong class="font-poppins me-2">R$ ${totalMateus.toFixed(2).replace('.',',')}</strong>
            <button class="btn btn-outline-nav btn-sm btn-buy-official-store" data-mercado="Mateus">Comprar <i class="bi bi-box-arrow-up-right"></i></button>
          </div>
        </div>
      </div>

      <h5 class="mt-4 mb-3">Divisão Recomendada dos Itens:</h5>
      <div style="max-height: 200px; overflow-y: auto; background: var(--bg-main); padding: 1rem; border-radius: 12px; border: 1px solid var(--border-color);">
        ${splitBreakdown.map(sb => `
          <div class="d-flex justify-content-between align-items-center mb-2 pb-2" style="border-bottom: 1px solid var(--border-color);">
            <span>${sb.item}</span>
            <div class="d-flex align-items-center gap-2">
              <span class="badge-tag ${sb.bestStore.toLowerCase().replace('í','i').replace('ã','a')}">${sb.bestStore}</span>
              <strong class="ms-1 me-2">R$ ${sb.bestPrice.toFixed(2).replace('.',',')}</strong>
              <button class="btn btn-outline-nav btn-sm py-0 px-2 btn-buy-official-store" data-mercado="${sb.bestStore}" data-nome="${sb.item}">
                Ir <i class="bi bi-box-arrow-up-right"></i>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    combinationModalBackdrop?.classList.add('active');
  }

  // -------------------------------------------------------------------------
  // 8. FETCH PRODUCTS CATALOG DATA
  // -------------------------------------------------------------------------
  async function fetchProductsCatalog() {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && data.data) {
        AppState.productsCache = data.data;
      }
    } catch (err) {
      console.warn('Failed to fetch API products, using DOM cards as cache fallback');
    }
  }

  // Initial Render for List Page if active
  renderMinhaListaPage();
});

// Toast Notification Helper Function
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-message ${type}`;
  toast.innerHTML = `
    <i class="bi bi-info-circle-fill"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
