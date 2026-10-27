(() => {
  // Set the store's public inbox here; the Contact page and email form use this value.
  const siteContactEmail = 'wavestatewears.ws@gmail.com';
  const emailComposeUrl = (subject = '', body = '') => {
    const params = [];
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);
    const query = params.join('&');
    return `mailto:${siteContactEmail}${query ? `?${query}` : ''}`;
  };
  const gmailWebComposeUrl = (subject = '', body = '') => {
    const params = new URLSearchParams({ view: 'cm', fs: '1', to: siteContactEmail });
    if (subject) params.set('su', subject);
    if (body) params.set('body', body);
    return `https://mail.google.com/mail/?${params.toString()}`;
  };
  const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const emailLinkUrl = () => isMobileDevice ? emailComposeUrl() : gmailWebComposeUrl();
  const revealItems = document.querySelectorAll('.intro, .featured, .quote-band, .newsletter, .shop-toolbar, .product-card, .story-image, .story-copy, .story-founder, .story-chapter, .story-philosophy, .story-manifesto, .values > div, .contact-intro, .contact-details > div, .contact-form');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reveal-ready');
    const observer = new IntersectionObserver((entries, currentObserver) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); currentObserver.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach((item) => { item.classList.add('reveal'); observer.observe(item); });
  }
  const pageHero = document.querySelector('.shop-page .page-hero, .about-page .page-hero');
  if (pageHero) document.body.classList.add('watermark-visible');

  document.querySelectorAll('a[href]').forEach((link) => link.addEventListener('click', (event) => {
    const target = new URL(link.href, location.href);
    if (event.defaultPrevented || link.matches('.bag-link') || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || target.origin !== location.origin || !target.pathname.endsWith('.html') || target.pathname === location.pathname) return;
    event.preventDefault();
    document.body.classList.add('page-leaving');
    window.setTimeout(() => { location.href = target.href; }, 180);
  }));

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (menuButton && nav) {
    const closeMenu = () => { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open navigation'); };
    menuButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });
    document.addEventListener('pointerdown', (event) => { if (nav.classList.contains('open') && !nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
  }

  const cartKey = 'wavestate-cart-items';
  const getCartItems = () => { try { return JSON.parse(localStorage.getItem(cartKey) || '[]'); } catch { return []; } };
  const getBagCount = () => getCartItems().reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const formatNaira = (amount) => `\u20a6${Math.round(amount).toLocaleString('en-NG')}`;
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const updateBagCount = () => document.querySelectorAll('.bag-count').forEach((count) => { count.textContent = String(getBagCount()); });
  let renderCart = () => {};
  const saveCart = (items) => { localStorage.setItem(cartKey, JSON.stringify(items)); updateBagCount(); renderCart(); };
  const addBagItem = (item, quantity = 1) => {
    const items = getCartItems();
    const existing = items.find((entry) => entry.name === item.name && entry.color === item.color && entry.size === item.size && (entry.customization || '') === (item.customization || ''));
    if (existing) existing.quantity += quantity; else items.push({ ...item, quantity });
    saveCart(items);
  };

  const cart = document.createElement('div');
  cart.className = 'cart-overlay';
  cart.setAttribute('aria-hidden', 'true');
  cart.innerHTML = '<aside class="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title"><header class="cart-header"><div><p class="eyebrow">YOUR WAVESTATE EDIT</p><h2 id="cart-title">Your cart <span class="cart-item-count"></span></h2></div><button class="cart-close" type="button" aria-label="Close cart">\u00d7</button></header><div class="cart-items"></div><div class="cart-empty" hidden><p>Your cart is taking a little pause.</p><a class="text-link" href="shop.html">Explore the collection <span>\u2197</span></a></div><section class="cart-summary"><div class="cart-total"><span>Total</span><strong class="cart-total-value">\u20a60</strong></div><p class="cart-shipping-note">Delivery and any applicable fees are calculated at checkout.</p><button class="button button-dark cart-checkout" type="button">Continue to checkout <span>\u2197</span></button><button class="cart-clear" type="button">Delete all items</button><form class="checkout-form" hidden><p class="eyebrow">A FEW DETAILS</p><label for="checkout-name">Full name</label><input id="checkout-name" name="name" autocomplete="name" required><label for="checkout-email">Email</label><input id="checkout-email" name="email" type="email" required><label for="checkout-phone">Phone number</label><input id="checkout-phone" name="phone" type="tel" required><label for="checkout-whatsapp">WhatsApp number</label><input id="checkout-whatsapp" name="whatsapp" type="tel"><label for="checkout-address">Delivery address</label><textarea id="checkout-address" name="address" rows="2" required></textarea><button class="button button-dark" type="submit">Review order <span>\u2197</span></button><p class="checkout-message" aria-live="polite"></p></form><section class="checkout-review" hidden><p class="eyebrow">REVIEW YOUR ORDER</p><div class="review-recipient"><h3>Recipient details</h3><dl class="review-details"><div><dt>Name</dt><dd data-review="name"></dd></div><div><dt>Email</dt><dd data-review="email"></dd></div><div><dt>Phone</dt><dd data-review="phone"></dd></div><div><dt>WhatsApp</dt><dd data-review="whatsapp"></dd></div><div><dt>Address</dt><dd data-review="address"></dd></div></dl></div><div class="review-items"><h3>Your order</h3><table class="review-table"><thead><tr><th>Item</th><th>Unit</th><th>Qty</th><th>Line total</th></tr></thead><tbody data-review="items"></tbody><tfoot><tr><td colspan="3">Subtotal</td><td><strong data-review="subtotal"></strong></td></tr><tr><td colspan="3">Total</td><td><strong class="review-grand-total" data-review="total"></strong></td></tr></tfoot></table></div><div class="review-actions"><button class="button button-dark review-continue" type="button">Continue <span>\u2197</span></button><button class="button button-ghost review-back" type="button">Back</button></div></section><section class="checkout-share" hidden><p class="eyebrow">VALIDATE YOUR ORDER</p><p class="checkout-share-note">Choose where to send your order.</p><div class="share-options"><button class="share-option" data-share="gmail"><span class="share-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3 8l9 5 9-5M4 13l8 4 8-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span><span class="share-label">Gmail</span></button><button class="share-option" data-share="whatsapp"><span class="share-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-4.4 19.1l-.9.5 1.7-1.7A10 10 0 0 0 12 2Zm3.3 13.7c-.2.3-1.2.4-1.4.4s-.6-.1-.6-.1l-2.9-.8A1 1 0 0 1 6 13.2l-.5-.9a1 1 0 0 1 .1-.9l.8-.4a1 1 0 0 1 1 .1l2.4 1.5a1 1 0 0 1 .3 1.2l-.4.8c-.1.3-.2.5-.4.6Z" fill="currentColor"/></svg></span><span class="share-label">WhatsApp</span></button><button class="share-option" data-share="snapchat"><span class="share-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2c-2.8 0-4.5 2.1-4.5 5.1 0 1 .1 2.2-.1 3.1-.2.9-1.2 1.6-2.4 1.9-.5.1-.5.7 0 .9l1.8.6c.4.2.4.4.3.8-.2.5-.7.8-1.5 1.1-.4.1-.4.6 0 .7.4.2 1 .2 1.5.2.6 0 .8.5 1.2 1 .5.6 1.3.9 2.1.6.5-.2 1-.4 1.6-.4s1.1.2 1.6.4c.8.3 1.6 0 2.1-.6.4-.5.6-1 1.2-1 .5 0 1.1 0 1.5-.2.4-.1.4-.6 0-.7-.8-.3-1.3-.6-1.5-1.1-.1-.4-.1-.6.3-.8l1.8-.6c.5-.2.5-.8 0-.9-1.2-.3-2.2-1-2.4-1.9-.2-.9-.1-2.1-.1-3.1 0-3-1.7-5.1-4.5-5.1Z" fill="currentColor"/></svg></span><span class="share-label">Snapchat</span></button></div><div class="review-actions"><button class="button button-ghost share-back" type="button">Back</button></div></section></section></aside>';
  document.documentElement.appendChild(cart);
  const showCartToast = (message) => {
    let toast = document.querySelector('.cart-toast');
    if (!toast) { toast = document.createElement('div'); toast.className = 'cart-toast'; toast.setAttribute('role', 'status'); document.documentElement.appendChild(toast); }
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(Number(toast.dataset.timer));
    toast.dataset.timer = String(window.setTimeout(() => toast.classList.remove('is-visible'), 2400));
  };
  const closeCart = () => { cart.classList.remove('is-open'); cart.setAttribute('aria-hidden', 'true'); document.body.classList.remove('cart-open'); document.documentElement.classList.remove('cart-open'); };
  const openCart = () => {
    if (nav?.classList.contains('open')) { nav.classList.remove('open'); menuButton?.setAttribute('aria-expanded', 'false'); }
    renderCart(); cart.classList.add('is-open'); cart.setAttribute('aria-hidden', 'false');
    document.body.classList.add('cart-open'); document.documentElement.classList.add('cart-open'); cart.querySelector('.cart-close').focus();
  };
  document.querySelectorAll('.bag-link').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); openCart(); }));
  cart.querySelector('.cart-close').addEventListener('click', closeCart);
  cart.addEventListener('click', (event) => { if (event.target === cart) closeCart(); });
  cart.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeCart(); });
  renderCart = () => {
    const items = getCartItems();
    const empty = items.length === 0;
    cart.querySelector('.cart-empty').hidden = !empty;
    cart.querySelector('.cart-summary').hidden = empty;
    cart.querySelector('.cart-item-count').textContent = empty ? '' : `(${items.reduce((sum, item) => sum + item.quantity, 0)})`;
    cart.querySelector('.cart-items').innerHTML = items.map((item, index) => {
      const sizeEditor = item.size === 'One size'
        ? '<div class="cart-size-fixed"><span>Size</span><strong>One size</strong></div>'
        : `<label class="cart-size-control"><span>Size</span><select data-cart-action="size" data-index="${index}" aria-label="Size for ${item.name}">${['XS', 'S', 'M', 'L', 'XL'].map((size) => `<option value="${size}" ${item.size === size ? 'selected' : ''}>${size}</option>`).join('')}</select></label>`;
      const customizationLine = item.customization ? `<p class="cart-item-customization">Name: ${escapeHtml(item.customization)}</p>` : '';
      const imageSection = ['top', 'bottom', 'left', 'right'].includes(item.imageSection) ? ` split-image-${item.imageSection}` : '';
      return `<article class="cart-item"><img class="cart-item-image${imageSection}" src="${item.image}" alt="${item.name} ${item.color}"><div class="cart-item-info"><h3>${item.name}</h3><p class="cart-item-color">${item.color}</p>${customizationLine}<div class="cart-edit-row">${sizeEditor}<div class="cart-qty-control"><span>Quantity</span><div class="cart-quantity"><button type="button" data-cart-action="decrease" data-index="${index}" aria-label="Decrease quantity">\u2212</button><span>${item.quantity}</span><button type="button" data-cart-action="increase" data-index="${index}" aria-label="Increase quantity">+</button></div></div></div><p class="cart-unit-price">Unit price <strong>${formatNaira(item.price)}</strong></p><div class="cart-line-total"><span>Item total</span><strong>${formatNaira(item.price * item.quantity)}</strong></div></div><button class="cart-remove" type="button" data-cart-action="remove" data-index="${index}" aria-label="Remove ${item.name}">Remove</button></article>`;
    }).join('');
    cart.querySelector('.cart-total-value').textContent = formatNaira(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
  };
  cart.querySelector('.cart-items').addEventListener('click', (event) => {
    const button = event.target.closest('button[data-cart-action]'); if (!button) return;
    const items = getCartItems(); const index = Number(button.dataset.index); const action = button.dataset.cartAction;
    if (action === 'remove') items.splice(index, 1);
    if (action === 'increase' && items[index]) items[index].quantity += 1;
    if (action === 'decrease' && items[index] && --items[index].quantity <= 0) items.splice(index, 1);
    saveCart(items);
  });
  cart.querySelector('.cart-items').addEventListener('change', (event) => {
    const selector = event.target.closest('select[data-cart-action="size"]'); if (!selector) return;
    const items = getCartItems(); const index = Number(selector.dataset.index); const item = items[index]; if (!item) return;
    const nextSize = selector.value;
    const matchingIndex = items.findIndex((other, otherIndex) => otherIndex !== index && other.name === item.name && other.color === item.color && other.size === nextSize);
    if (matchingIndex >= 0) { items[matchingIndex].quantity += item.quantity; items.splice(index, 1); } else item.size = nextSize;
    saveCart(items);
  });
  cart.querySelector('.cart-clear').addEventListener('click', () => saveCart([]));
  cart.querySelector('.cart-checkout').addEventListener('click', () => { const form = cart.querySelector('.checkout-form'); form.hidden = false; form.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); cart.querySelector('#checkout-name').focus({ preventScroll: true }); });
  cart.querySelector('.checkout-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = cart.querySelector('.checkout-form');
    const review = cart.querySelector('.checkout-review');
    const name = form.querySelector('#checkout-name').value.trim();
    const email = form.querySelector('#checkout-email').value.trim();
    const phone = form.querySelector('#checkout-phone').value.trim();
    const whatsapp = form.querySelector('#checkout-whatsapp').value.trim();
    const address = form.querySelector('#checkout-address').value.trim();
    review.querySelector('[data-review="name"]').textContent = name;
    review.querySelector('[data-review="email"]').textContent = email;
    review.querySelector('[data-review="phone"]').textContent = phone;
    review.querySelector('[data-review="whatsapp"]').textContent = whatsapp;
    review.querySelector('[data-review="address"]').textContent = address;
    const items = getCartItems();
    review.querySelector('[data-review="items"]').innerHTML = items.map((item) => `<tr><td><strong>${escapeHtml(item.name)}</strong><br><span class="review-item-meta">${escapeHtml(item.color)}${item.size ? ` \u00b7 ${escapeHtml(item.size)}` : ''}</span></td><td>${formatNaira(item.price)}</td><td>${item.quantity}</td><td><strong>${formatNaira(item.price * item.quantity)}</strong></td></tr>`).join('');
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    review.querySelector('[data-review="subtotal"]').textContent = formatNaira(subtotal);
    review.querySelector('[data-review="total"]').textContent = formatNaira(subtotal);
    form.hidden = true;
    review.hidden = false;
    review.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  cart.querySelector('.checkout-review').addEventListener('click', (event) => {
    const back = event.target.closest('.review-back');
    if (back) {
      cart.querySelector('.checkout-review').hidden = true;
      cart.querySelector('.checkout-form').hidden = false;
      cart.querySelector('#checkout-name').focus({ preventScroll: true });
      return;
    }
    const continueBtn = event.target.closest('.review-continue');
    if (continueBtn) {
      const review = cart.querySelector('.checkout-review');
      const share = cart.querySelector('.checkout-share');
      const name = review.querySelector('[data-review="name"]').textContent;
      const email = review.querySelector('[data-review="email"]').textContent;
      const phone = review.querySelector('[data-review="phone"]').textContent;
      const whatsapp = review.querySelector('[data-review="whatsapp"]').textContent;
      const address = review.querySelector('[data-review="address"]').textContent;
      const items = getCartItems();
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const lineItems = items.map((item) => `• ${item.name} (${item.color}${item.size ? `, ${item.size}` : ''}) x${item.quantity} — ${formatNaira(item.price * item.quantity)}`).join('\n');
      const orderDetails = `WAVESTATE ORDER\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nWhatsApp: ${whatsapp || '—'}\nAddress: ${address}\n\nItems:\n${lineItems}\n\nTotal: ${formatNaira(total)}`;
      share.dataset.order = orderDetails;
      cart.querySelector('.cart-checkout').hidden = true;
      review.hidden = true;
      share.hidden = false;
      share.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }
  });
  cart.querySelector('.checkout-share').addEventListener('click', (event) => {
    const button = event.target.closest('.share-option');
    if (button) {
      const share = cart.querySelector('.checkout-share');
      const orderDetails = share.dataset.order || '';
      const platform = button.dataset.share;
      let url = '';
      if (platform === 'gmail') {
        url = emailComposeUrl('Wavestate order', orderDetails);
      } else if (platform === 'whatsapp') {
        url = `https://wa.me/2349038952675?text=${encodeURIComponent(orderDetails)}`;
      } else if (platform === 'snapchat') {
        url = 'https://www.snapchat.com/add/akanni_mhii1?share_id=CXKQ_li8Fwo&locale=en-GB&caption=' + encodeURIComponent(orderDetails);
      }
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
      return;
    }
    const back = event.target.closest('.share-back');
    if (back) {
      cart.querySelector('.checkout-share').hidden = true;
      cart.querySelector('.checkout-review').hidden = false;
      cart.querySelector('.cart-checkout').hidden = false;
      cart.querySelector('.checkout-review').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && cart.classList.contains('is-open')) closeCart(); });
  updateBagCount();

  let openProductOptions = null;
  document.querySelectorAll('.add-button').forEach((button) => button.addEventListener('click', () => {
    const card = button.closest('.product-card'); if (!card) return;
    if (openProductOptions) { openProductOptions(card); return; }
    addBagItem({ name: card.querySelector('h3')?.textContent.trim() || 'Wavestate item', color: card.querySelector('.product-info p')?.textContent.trim() || 'Standard', size: ['bags', 'accessories'].includes(card.dataset.category) ? 'One size' : 'M', price: Number(card.dataset.price || 0), image: card.querySelector('.product-image img')?.src || '' });
    showCartToast(`${card.querySelector('h3')?.textContent.trim() || 'Item'} added to your cart.`);
    button.innerHTML = 'Added to cart <span>\u2713</span>';
    window.setTimeout(() => { button.innerHTML = 'Add to Cart <span>+</span>'; }, 1400);
  }));

  const categoryFilter = document.querySelector('#filter-category');
  const priceFilter = document.querySelector('#filter-price');
  const productGrid = document.querySelector('.shop-grid');
  const applyFilters = () => {
    if (!productGrid) return;
    const [minimum, maximum] = (priceFilter?.value || 'all').split('-').map(Number);
    productGrid.querySelectorAll('.product-card').forEach((card) => {
      const categoryMatches = !categoryFilter || categoryFilter.value === 'all' || card.dataset.category === categoryFilter.value;
      const price = Number(card.dataset.price); const priceMatches = !priceFilter || priceFilter.value === 'all' || (price >= minimum && price <= maximum);
      card.hidden = !(categoryMatches && priceMatches);
    });
  };
  categoryFilter?.addEventListener('change', applyFilters); priceFilter?.addEventListener('change', applyFilters);
  document.querySelector('.clear-filters')?.addEventListener('click', () => { if (categoryFilter) categoryFilter.value = 'all'; if (priceFilter) priceFilter.value = 'all'; applyFilters(); });

  if (productGrid) {
    const modal = document.createElement('div'); modal.className = 'product-options'; modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = '<section class="options-dialog" role="dialog" aria-modal="true" aria-labelledby="options-title"><button class="options-close" type="button" aria-label="Close options">\u00d7</button><div class="options-visual"><span class="options-selected-color" aria-live="polite"></span><div class="options-image"><img alt=""></div></div><div class="options-content"><p class="eyebrow">MADE TO MOVE WITH YOU</p><h2 id="options-title"></h2><p class="options-description">Choose your favourite shade and find the fit that feels like you.</p><div class="variant-heading"><span>Available shades</span><span class="options-price"></span></div><div class="variant-list"></div><div class="options-size"><label for="option-size">Your size</label><select id="option-size"><option>XS</option><option>S</option><option selected>M</option><option>L</option><option>XL</option></select></div><div class="options-quantity"><label for="option-quantity">Quantity</label><div class="quantity-stepper"><button type="button" data-quantity="minus" aria-label="Decrease quantity">\u2212</button><input id="option-quantity" type="number" min="0" max="99" value="0" inputmode="numeric"><button type="button" data-quantity="plus" aria-label="Increase quantity">+</button></div></div><button class="button button-dark options-add" type="button">Add to Cart <span>\u2197</span></button><p class="options-status" aria-live="polite"></p></div></section>';
    document.documentElement.appendChild(modal);
    modal.querySelector('.variant-list').insertAdjacentHTML('afterend', '<div class="custom-shade-field" hidden><label for="custom-shade">Other shade</label><input id="custom-shade" type="text" maxlength="60" placeholder="Input the exact shade you want" autocomplete="off"></div>');
    modal.querySelector('.custom-shade-field').insertAdjacentHTML('afterend', '<div class="customization-field" hidden><label for="customization-name">Name to customize</label><input id="customization-name" type="text" maxlength="50" placeholder="Enter the name you want written" autocomplete="off"></div>');
    const closeModal = () => { modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('modal-open'); document.documentElement.classList.remove('modal-open'); };
    const setVariantControlsEnabled = (enabled) => {
      modal.querySelector('#option-quantity').disabled = !enabled;
      modal.querySelectorAll('[data-quantity]').forEach((button) => { button.disabled = !enabled; });
      modal.querySelector('#option-size').disabled = !enabled;
      modal.querySelector('.options-add').disabled = !enabled;
    };
    const shades = {
      outerwear: [['Sandstone','#c3b39a','photo-1591047139829-d91aecb6caea',0],['Sage','#858b70','photo-1548126032-079a0fb0099d',12000],['Midnight','#333b3a','hoodie.jpg',8000]],
      bottoms: [['Soft ivory','#e9e4d8','photo-1594633312681-425c7b97ccd1',0],['Warm taupe','#a99b89','photo-1506629905607-d9a7c2a6d6b0',7000],['Deep olive','#656953','photo-1583496661160-fb5886a0aaaa',5000],['Black','#252525','cargo pants.jpg',0],['Charcoal','#565656','cuffed joggers.jpg',0],['White','#f0eee8','white joggers.jpg',0]],
      bags: [['Burnt caramel','#9c623d','photo-1548036328-c9fa89d128fa',0],['Dark olive','#555b45','photo-1584917865442-de89df76afd3',5000],['Espresso','#41332b','photo-1590874103328-eac38a683ce7',11000]],
      dresses: [['Washed white','#eeeae1','photo-1551232864-3f0890e580d9',0],['Sea glass','#9aa99b','photo-1515886657613-9f3515b0c78f',9000],['Clay rose','#b78173','photo-1539008835657-9e8e9680c956',6000]],
      knitwear: [['Oat milk','#d7cbbb','photo-1620799140408-edc6dcb6d633',0],['Cloud grey','#aaa9a1','photo-1576566588028-4147f3842f27',5000],['Forest','#485648','photo-1618354691373-d851c5c3a990',8000]],
      tops: [['Black','#252525','black ascension.jpg',0],['White','#f0eee8','white tank top with black stripes.jpg',3000],['Royal blue','#315b9a','royal blue tank top with white stripes.jpg',4000],['Cloud','#d6d4ce','round neck.jpg',0],['Red','#a53b34','red dark ascension.jpg',3000],['Rose','#bc7e83','female round neck.jpg',0],['Jersey Polo','#566477','Jersey polo.jpg',0],['Signature Print','#827b70','buttoned shirt options.jpg',5000],['Red Stripe','#a53b34','black tank top with red stripes.jpg',0]],
      jerseys: [['Black','#252525','black jersey.jpg',0],['Green','#49634e','green jersey.jpg',0],['Light blue','#91b9d5','light blue jersey.jpg',0],['Off-white','#eeeae1','off-white customizable jersey.jpg',13000],['White','#f0eee8','white jersey.jpg',0]],
      sets: [['Olive','#656953','street cargo set.jpg',0],['Black','#252525','black joggers.jpg',-5000],['White','#f0eee8','white joggers.jpg',-5000]],
      accessories: [['Denim Blue','#647f9a','denim cap.jpg',0],['Camo','#64705b','trucker cap options.jpg',3000],['Black','#252525','beanie.jpg',-2000]]
    };
    const darkAscensionShades = [
      ['Black','#252525','black ascension.jpg',0],
      ['Dark Blue','#304b6b','dark blue ascension.jpg',0],
      ['Dark Green','#3d5140','dark green ascension.jpg',0],
      ['Pink','#c77c91','pink ascension.jpg',0],
      ['Red','#a53b34','red dark ascension.jpg',0],
      ['White','#f0eee8','white ascension.jpg',0]
    ];
    const tooFlyPoloShades = [
      ['Black','#252525','Jersey polo.jpg',0],
      ['White','#f0eee8','Jersey polo.jpg',0]
    ];
    const maleBasicShades = [
      ['Black','#252525','round neck.jpg',0],
      ['White','#f0eee8','round neck.jpg',0]
    ];
    const femaleBasicShades = [
      ['Black','#252525','female round neck.jpg',0],
      ['White','#f0eee8','female round neck.jpg',0]
    ];
    const campusHoodieShades = [
      ['Black','#252525','hoodie.jpg',0],
      ['Grey','#8b8b88','hoodie.jpg',0]
    ];
    const tooFlyCargoShades = [
      ['Black','#252525','cargo pants.jpg',0]
    ];
    const basicJoggerShades = [
      ['Black','#252525','black joggers.jpg',0],
      ['Grey','#8b8b88','grey joggers.jpg',0]
    ];
    const campusBeanieShades = [
      ['Black','#252525','beanie.jpg',0]
    ];
    const cuffedJoggerShades = [
      ['Black','#252525','cuffed joggers.jpg',0],
      ['Grey','#8b8b88','cuffed joggers.jpg',0]
    ];
    const trekkTankShades = [
      ['Black x Red Stripes','#252525','black tank top with red stripes.jpg',0],
      ['Black x White Stripes','#252525','black tank top with white stripes.jpg',0],
      ['Green x Black Stripes','#49634e','Green tank top with black stripes.jpg',0],
      ['Grey x Black Stripes','#8b8b88','Grey tank top with black stripes.jpg',0],
      ['Royal Blue x Black Stripes','#315b9a','royal blue tank top with black stripes.jpg',0],
      ['Royal Blue x White Stripes','#315b9a','royal blue tank top with white stripes.jpg',0],
      ['White x Black Stripes','#f0eee8','white tank top with black stripes.jpg',0]
    ];
    const customizableJerseyShades = [
      ['Black','#252525','black jersey.jpg',0],
      ['Green','#49634e','green jersey.jpg',0],
      ['Light Blue','#91b9d5','light blue jersey.jpg',0],
      ['Off-white','#eeeae1','off-white customizable jersey.jpg',0],
      ['Pink','#c77c91','pink jersey.jpg',0],
      ['Purple','#72538b','purple jersey.jpg',0],
      ['Royal Blue','#315b9a','royal blue jersey.jpg',0],
      ['White','#f0eee8','white jersey.jpg',0]
    ];
    const truckerCapShades = [
      ['Camo','#64705b','camouflage trucker cap.jpg',0],
      ['Other','#89765e','trucker cap options.jpg',-2000]
    ];
    const denimCapShades = [
      ['Ash','#8d8d89','ash denim.jpg',0],
      ['Dark Green','#435847','dark green denim.jpg',0],
      ['Grey','#8b8b88','grey denim.jpg',0],
      ['Navy Blue','#33445f','navy blue denim.jpg',0],
      ['Pink','#bd8796','pink denim.jpg',0],
      ['Sky Blue','#83b5d2','sky blue denim.jpg',0]
    ];
    const streetCargoShades = [
      ['Set (black top)','#252525','street cargo set.jpg',0],
      ['Set (white top)','#f0eee8','street cargo set.jpg',0]
    ];
    const signatureShades = [
      ['Black','#252525','black signature.jpg',0],
      ['Grey','#8b8b88','grey signature.jpg',0],
      ['Pink','#c77c91','pink signature.jpg',0],
      ['Red','#a53b34','red signature.jpg',0],
      ['Sky Blue','#83b5d2','sky blue signature.jpg',0],
      ['White','#f0eee8','white signature.jpg',0]
    ];
    const variantImageUrl = (image, width, quality) => image.startsWith('photo-')
      ? `https://images.unsplash.com/${image}?auto=format&fit=crop&w=${width}&q=${quality}`
      : encodeURI(image);
    let chosenName = ''; let chosenColor = ''; let chosenPrice = 0; let draftKey = ''; let isTooFlyPolo = false; let isMaleBasic = false; let isFemaleBasic = false; let isCampusHoodie = false; let isTooFlyCargo = false; let isBasicJoggers = false; let isCampusBeanie = false; let isCuffedJoggers = false; let isTrekkTank = false; let isCustomJersey = false; let isStreetCargo = false; let isTruckerCap = false; let isDenimCaps = false; let isSignatureShirt = false; let isCustomizable = false;
    const drafts = new Map();
    const saveQuantity = () => {
      if (!draftKey || !chosenColor) return;
      const draft = drafts.get(draftKey) || {}; const amount = Math.max(0, Math.min(99, Number.parseInt(modal.querySelector('#option-quantity').value, 10) || 0));
      const selection = draft[chosenColor] || { quantity: 0, size: 'M' }; selection.quantity = amount;
      if (!modal.querySelector('.options-size').hidden) selection.size = modal.querySelector('#option-size').value;
      if (isCustomizable) selection.customization = modal.querySelector('#customization-name').value;
      draft[chosenColor] = selection; drafts.set(draftKey, draft);
    };
    const updateQuantities = () => modal.querySelectorAll('.variant-choice').forEach((choice) => {
      const selection = (drafts.get(draftKey) || {})[choice.dataset.color] || {}; const amount = Number(selection.quantity || 0);
      const size = modal.querySelector('.options-size').hidden ? '' : ` \u00b7 ${selection.size || 'M'}`;
      choice.querySelector('.variant-selected-qty').textContent = amount ? `${amount} selected${size}` : (modal.querySelector('.options-size').hidden ? 'Choose quantity' : 'Choose size & quantity');
    });
const showOptions = (card) => {
      chosenName = card.querySelector('h3')?.textContent.trim() || 'Wavestate piece';
      const photo = card.querySelector('.product-image img'); const basePrice = Number(card.dataset.price || 0);
      chosenPrice = basePrice; draftKey = chosenName; if (!drafts.has(draftKey)) drafts.set(draftKey, {});
      chosenColor = '';
      modal.querySelector('#options-title').textContent = chosenName; modal.querySelector('.options-image img').src = photo?.src || ''; modal.querySelector('.options-image img').alt = photo?.alt || chosenName;
      const isDarkAscension = chosenName.toLowerCase() === 'wavestate dark ascension tee';
      isTooFlyPolo = chosenName.toLowerCase() === 'wavestate too fly t-shirt';
      isMaleBasic = chosenName.toLowerCase() === 'wavestate male basic tee';
      isFemaleBasic = chosenName.toLowerCase() === 'wavestate female basic tee';
      isCampusHoodie = chosenName.toLowerCase() === 'campuscaps x wavestate hoodie';
      isTooFlyCargo = chosenName.toLowerCase() === 'wavestate too fly cargo pants';
      isBasicJoggers = chosenName.toLowerCase() === 'wavestate basic joggers';
      isCampusBeanie = chosenName.toLowerCase() === 'campuscaps x wavestate beanie';
      isCuffedJoggers = chosenName.toLowerCase() === 'wavestate cuffed joggers';
      isTrekkTank = chosenName.toLowerCase() === 'trekk x wavestate tank top';
      isCustomJersey = chosenName.toLowerCase() === 'wavestate customizable jersey';
      isStreetCargo = chosenName.toLowerCase() === 'street cargo sets';
      isTruckerCap = chosenName.toLowerCase() === 'wavestate trucker cap';
      isDenimCaps = chosenName.toLowerCase() === 'wavestate customizable denim caps';
      isSignatureShirt = chosenName.toLowerCase() === 'wavestate signature shirt';
      isCustomizable = isCustomJersey || isDenimCaps;
      const choices = isDarkAscension ? darkAscensionShades : isTooFlyPolo ? tooFlyPoloShades : isMaleBasic ? maleBasicShades : isFemaleBasic ? femaleBasicShades : isCampusHoodie ? campusHoodieShades : isTooFlyCargo ? tooFlyCargoShades : isBasicJoggers ? basicJoggerShades : isCampusBeanie ? campusBeanieShades : isCuffedJoggers ? cuffedJoggerShades : isTrekkTank ? trekkTankShades : isCustomJersey ? customizableJerseyShades : isSignatureShirt ? signatureShades : isStreetCargo ? streetCargoShades : isTruckerCap ? truckerCapShades : isDenimCaps ? denimCapShades : shades[card.dataset.category] || shades.outerwear; modal.querySelector('.options-size').hidden = ['bags', 'accessories'].includes(card.dataset.category);
      modal.querySelector('.custom-shade-field').hidden = true;
      modal.querySelector('.customization-field').hidden = true;
      modal.querySelector('.variant-list').innerHTML = choices.map(([color, , image, adjustment]) => {
        const price = basePrice + adjustment;
        const largeImage = variantImageUrl(image, 700, 80); const thumbImage = variantImageUrl(image, 240, 75);
        let previewSection = '';
        if (isTooFlyPolo) previewSection = color === 'Black' ? 'split-preview-bottom' : 'split-preview-top';
        if (isMaleBasic) previewSection = color === 'Black' ? 'split-preview-top' : 'split-preview-bottom';
        if (isCampusHoodie) previewSection = color === 'Black' ? 'split-preview-bottom' : 'split-preview-top';
        if (isFemaleBasic) previewSection = color === 'Black' ? 'split-preview-left' : 'split-preview-right';
        if (isCuffedJoggers) previewSection = color === 'Grey' ? 'split-preview-left' : 'split-preview-right';
        if (isStreetCargo) previewSection = color === 'Set (white top)' ? 'split-preview-left' : 'split-preview-right';
        return `<button type="button" class="variant-choice ${color.toLowerCase() === chosenColor.toLowerCase() ? 'selected' : ''}" data-color="${color}" data-price="${price}" data-image="${largeImage}" data-image-section="${previewSection.replace('split-preview-', '')}"><img class="variant-preview ${previewSection}" src="${thumbImage}" alt="${color} ${chosenName}"><span class="variant-detail"><span class="variant-name">${color}</span><span class="variant-price">${formatNaira(price)}</span><span class="variant-selected-qty">Select quantity</span></span></button>`;
      }).join('');
      const selected = modal.querySelector('.variant-choice.selected'); chosenColor = selected?.dataset.color || chosenColor; chosenPrice = Number(selected?.dataset.price || basePrice);
      modal.querySelector('.options-selected-color').textContent = chosenColor;
      const usesSplitImage = isTooFlyPolo || isMaleBasic || isCampusHoodie;
      const showBottomHalf = (isTooFlyPolo && chosenColor === 'Black') || (isMaleBasic && chosenColor === 'White') || (isCampusHoodie && chosenColor === 'Black');
      const hasColorSelection = Boolean(chosenColor);
      modal.classList.toggle('split-half-view', usesSplitImage && hasColorSelection); modal.classList.toggle('split-vertical-view', (isFemaleBasic || isCuffedJoggers || isStreetCargo) && hasColorSelection); modal.classList.toggle('split-show-bottom', usesSplitImage && showBottomHalf); modal.classList.toggle('split-show-right', (isFemaleBasic && chosenColor === 'White') || (isCuffedJoggers && chosenColor === 'Black') || (isStreetCargo && chosenColor === 'Set (black top)'));
      modal.querySelector('#option-quantity').value = '0'; if (!modal.querySelector('.options-size').hidden) modal.querySelector('#option-size').value = 'M';
      modal.querySelector('.options-price').textContent = ''; setVariantControlsEnabled(false);
      modal.querySelector('.options-status').textContent = ''; updateQuantities();
      modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('modal-open'); document.documentElement.classList.add('modal-open'); modal.querySelector('.options-close').focus();
    };
    openProductOptions = showOptions;
    productGrid.addEventListener('click', (event) => { const link = event.target.closest('.product-image'); if (!link) return; event.preventDefault(); const card = link.closest('.product-card'); if (card) showOptions(card); });
    modal.querySelector('.options-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
    modal.querySelector('.variant-list').addEventListener('click', (event) => {
      const choice = event.target.closest('.variant-choice'); if (!choice) return; saveQuantity();
      modal.querySelectorAll('.variant-choice').forEach((item) => item.classList.toggle('selected', item === choice));
      chosenColor = choice.dataset.color; const selection = (drafts.get(draftKey) || {})[chosenColor] || { quantity: 0, size: 'M' };
      setVariantControlsEnabled(true);
      const customShadeField = modal.querySelector('.custom-shade-field');
      customShadeField.hidden = !(isTruckerCap && chosenColor === 'Other');
      const enteredShade = modal.querySelector('#custom-shade').value.trim();
      modal.querySelector('.options-selected-color').textContent = isTruckerCap && chosenColor === 'Other' && enteredShade ? enteredShade : chosenColor;
      choice.querySelector('.variant-name').textContent = isTruckerCap && chosenColor === 'Other' && enteredShade ? enteredShade : chosenColor;
      modal.querySelector('.customization-field').hidden = !isCustomizable;
      modal.querySelector('#customization-name').value = isCustomizable ? selection.customization || '' : '';
      const showBottomHalf = (isTooFlyPolo && chosenColor === 'Black') || (isMaleBasic && chosenColor === 'White') || (isCampusHoodie && chosenColor === 'Black');
      modal.classList.toggle('split-half-view', isTooFlyPolo || isMaleBasic || isCampusHoodie);
      modal.classList.toggle('split-vertical-view', isFemaleBasic || isCuffedJoggers || isStreetCargo);
      modal.classList.toggle('split-show-bottom', showBottomHalf);
      modal.classList.toggle('split-show-right', (isFemaleBasic && chosenColor === 'White') || (isCuffedJoggers && chosenColor === 'Black') || (isStreetCargo && chosenColor === 'Set (black top)'));
      modal.querySelector('#option-quantity').value = String(selection.quantity); if (!modal.querySelector('.options-size').hidden) modal.querySelector('#option-size').value = selection.size;
      chosenPrice = Number(choice.dataset.price); modal.querySelector('.options-price').textContent = formatNaira(chosenPrice);
      const image = modal.querySelector('.options-image img'); image.src = choice.dataset.image; image.alt = `${chosenColor} ${chosenName}`; updateQuantities();
    });
    modal.querySelector('#custom-shade').addEventListener('input', (event) => {
      if (isTruckerCap && chosenColor === 'Other') {
        const enteredShade = event.target.value.trim() || 'Other';
        modal.querySelector('.options-selected-color').textContent = enteredShade;
        modal.querySelector('.variant-choice.selected .variant-name').textContent = enteredShade;
      }
    });
    modal.querySelector('#customization-name').addEventListener('input', () => {
      if (!isCustomizable || !chosenColor) return;
      const draft = drafts.get(draftKey) || {};
      const selection = draft[chosenColor] || { quantity: 0, size: 'M' };
      selection.customization = modal.querySelector('#customization-name').value;
      draft[chosenColor] = selection;
      drafts.set(draftKey, draft);
    });
    modal.querySelector('#option-quantity').addEventListener('input', () => { saveQuantity(); updateQuantities(); });
    modal.querySelector('#option-size').addEventListener('change', saveQuantity);
    modal.querySelector('.quantity-stepper').addEventListener('click', (event) => {
      const button = event.target.closest('[data-quantity]'); if (!button) return;
      const input = modal.querySelector('#option-quantity'); const amount = Number.parseInt(input.value, 10) || 0;
      input.value = String(Math.max(0, Math.min(99, amount + (button.dataset.quantity === 'plus' ? 1 : -1)))); saveQuantity(); updateQuantities();
    });
    modal.querySelector('.options-add').addEventListener('click', () => {
      saveQuantity();
      if (!chosenColor) { modal.querySelector('.options-status').textContent = 'Select a color first.'; return; }
      const variants = [...modal.querySelectorAll('.variant-choice')].map((choice) => ({ color: choice.dataset.color, price: Number(choice.dataset.price), image: choice.dataset.image, imageSection: choice.dataset.imageSection || '', ...((drafts.get(draftKey) || {})[choice.dataset.color] || { quantity: 0, size: 'M' }) })).filter((variant) => variant.quantity > 0);
      if (!variants.length) { modal.querySelector('.options-status').textContent = 'Choose a quantity for at least one color.'; return; }
      const missingCustomization = isCustomizable && variants.find((variant) => !String(variant.customization || '').trim());
      if (missingCustomization) {
        [...modal.querySelectorAll('.variant-choice')].find((choice) => choice.dataset.color === missingCustomization.color)?.click();
        modal.querySelector('.options-status').textContent = 'Enter the name you want customized for each selected color.';
        modal.querySelector('#customization-name').focus();
        return;
      }
      const orderedShade = modal.querySelector('#custom-shade').value.trim();
      if (isTruckerCap && variants.some((variant) => variant.color === 'Other') && !orderedShade) { modal.querySelector('.custom-shade-field').hidden = false; modal.querySelector('.options-status').textContent = 'Input the exact shade you want.'; modal.querySelector('#custom-shade').focus(); return; }
      variants.forEach((variant) => addBagItem({ name: chosenName, color: isTruckerCap && variant.color === 'Other' ? orderedShade : variant.color, size: modal.querySelector('.options-size').hidden ? 'One size' : variant.size, price: variant.price, image: variant.image, imageSection: variant.imageSection, ...(isCustomizable ? { customization: String(variant.customization).trim() } : {}) }, variant.quantity));
      const units = variants.reduce((sum, variant) => sum + variant.quantity, 0); const count = variants.length; drafts.delete(draftKey); closeModal();
      showCartToast(`${units} item${units === 1 ? '' : 's'} in ${count} color${count === 1 ? '' : 's'} added to your cart.`);
    });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });
  }

  const sort = document.querySelector('#sort-products');
  sort?.addEventListener('change', () => {
    const grid = document.querySelector('.shop-grid'); if (!grid) return;
    const cards = [...grid.querySelectorAll('.product-card')]; const direction = sort.value === 'low' ? 1 : sort.value === 'high' ? -1 : 0;
    if (direction) cards.sort((a, b) => (Number(a.dataset.price) - Number(b.dataset.price)) * direction);
    cards.forEach((card) => grid.appendChild(card));
  });

  document.querySelector('.newsletter-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const message = form.querySelector('.form-message');
    if (message) message.textContent = 'You\u2019re on the list. Look out for a note from us soon.';
    form.reset();
  });

  const contactForm = document.querySelector('.contact-form');
  document.querySelectorAll('[data-site-contact-link]').forEach((link) => { link.href = emailLinkUrl(); link.target = '_blank'; link.rel = 'noopener noreferrer'; });
  document.querySelectorAll('[data-site-contact-email]').forEach((link) => {
    link.href = emailLinkUrl();
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = `${siteContactEmail} \u2197`;
  });
  if (contactForm) {
    const methodChoices = contactForm.querySelectorAll('input[name="contact-method"]');
    const sendButton = contactForm.querySelector('#contact-send');
    const emailField = contactForm.querySelector('#email');
    const topicSelect = contactForm.querySelector('#topic');
    const customTopic = contactForm.querySelector('#custom-topic');
    const customTopicLabel = contactForm.querySelector('#custom-topic-label');
    const status = contactForm.querySelector('.form-message');
    const selectedMethod = () => contactForm.querySelector('input[name="contact-method"]:checked')?.value || 'email';
    const updateTopicField = () => {
      const needsCustomTopic = topicSelect?.value === 'other';
      if (customTopic) { customTopic.hidden = !needsCustomTopic; customTopic.required = Boolean(needsCustomTopic); }
      if (customTopicLabel) customTopicLabel.hidden = !needsCustomTopic;
    };
    topicSelect?.addEventListener('change', updateTopicField);
    updateTopicField();
    const updateSendLabel = () => {
      if (sendButton) sendButton.innerHTML = selectedMethod() === 'whatsapp' ? 'Send via WhatsApp <span>\u2197</span>' : 'Send via email <span>\u2197</span>';
      if (emailField) emailField.required = selectedMethod() === 'email';
    };
    methodChoices.forEach((choice) => choice.addEventListener('change', updateSendLabel));
    updateSendLabel();
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const values = new FormData(contactForm);
      const name = String(values.get('name') || '').trim();
      const email = String(values.get('email') || '').trim();
      const selectedTopic = String(values.get('topic') || 'General Hello').trim();
      const topic = selectedTopic === 'other' ? String(values.get('custom-topic') || '').trim() : selectedTopic;
      const message = String(values.get('message') || '').trim();
      if (selectedMethod() === 'whatsapp') {
        const number = (contactForm.dataset.whatsappNumber || '').replace(/\D/g, '');
        if (!number) {
          status.textContent = `WhatsApp contact is not set up yet. Please choose email or contact us at ${siteContactEmail}.`;
          return;
        }
        const whatsappMessage = `Name: *${name}*\n${email ? `Email: ${email}\n` : ''}Topic: *${topic}*\n\n${message}`;
        const chatUrl = `https://wa.me/${number}?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(chatUrl, '_blank', 'noopener,noreferrer');
        status.textContent = 'Opening your WhatsApp chat with your message ready to send.';
        return;
      }
      const emailBody = message.replace(/\r?\n/g, '\r\n');
      const composeUrl = isMobileDevice ? emailComposeUrl(topic, emailBody) : gmailWebComposeUrl(topic, emailBody);
      window.open(composeUrl, '_blank', 'noopener,noreferrer');
      status.textContent = isMobileDevice
        ? 'Opening your email app. If it does not open, use the Gmail web option.'
        : 'Opening Gmail in a new tab.';
      if (isMobileDevice) {
        const fallback = document.createElement('a');
        fallback.href = gmailWebComposeUrl(topic, emailBody);
        fallback.target = '_blank';
        fallback.rel = 'noopener noreferrer';
        fallback.textContent = ' Open Gmail web';
        status.append(fallback);
      }
    });
  }

  const socialPlatforms = [
    { key: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/wavestate.wears?mdxt=MXEzOTlyeW0zYTJ4dg==', icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle class="social-icon-dot" cx="18" cy="6" r="1"/></svg>' },
    { key: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@wavestate.wears?_r=1&_t=ZS-9AllXOV4Gsm', icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3v11.2a4.6 4.6 0 1 1-4-4.55v3.2a1.55 1.55 0 1 0 1 1.45V3h3c.25 2.1 1.48 3.55 4 4v3.05A8.15 8.15 0 0 1 15 8.5"/></svg>' },
    { key: 'snapchat', label: 'Snapchat', url: 'https://www.snapchat.com/add/akanni_mhii1?share_id=CXKQ_li8Fwo&locale=en-GB', icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2c-2.8 0-4.5 2.1-4.5 5.1 0 1 .1 2.2-.1 3.1-.2.9-1.2 1.6-2.4 1.9-.5.1-.5.7 0 .9l1.8.6c.4.2.4.4.3.8-.2.5-.7.8-1.5 1.1-.4.1-.4.6 0 .7.4.2 1 .2 1.5.2.6 0 .8.5 1.2 1 .5.6 1.3.9 2.1.6.5-.2 1-.4 1.6-.4s1.1.2 1.6.4c.8.3 1.6 0 2.1-.6.4-.5.6-1 1.2-1 .5 0 1.1 0 1.5-.2.4-.1.4-.6 0-.7-.8-.3-1.3-.6-1.5-1.1-.1-.4-.1-.6.3-.8l1.8-.6c.5-.2.5-.8 0-.9-1.2-.3-2.2-1-2.4-1.9-.2-.9-.1-2.1-.1-3.1 0-3-1.7-5.1-4.5-5.1Z"/></svg>' }
  ];
  document.querySelectorAll('.site-footer').forEach((footer) => {
    if (footer.querySelector('.social-icons')) return;
    const icons = document.createElement('nav');
    icons.className = 'social-icons';
    icons.setAttribute('aria-label', 'Social media');
    socialPlatforms.forEach(({ key, label, url, icon }) => {
      const element = document.createElement(url ? 'a' : 'span');
      element.className = `social-icon social-icon-${key}`;
      element.setAttribute('aria-label', `Wavestate on ${label}`);
      if (url) {
        element.href = url;
        element.target = '_blank';
        element.rel = 'noopener noreferrer';
      }
      element.innerHTML = icon;
      icons.append(element);
    });
    footer.querySelector('.footer-links')?.before(icons);
  });
})();
