(() => {
  // Set the store's public inbox here; the Contact page and email form use this value.
  const siteContactEmail = 'wavestatewears.ws@gmail.com';
  const emailComposeUrl = (subject = '', body = '') => {
    const params = new URLSearchParams();
    if (subject) params.set('subject', subject);
    if (body) params.set('body', body);
    const query = params.toString();
    return `mailto:${siteContactEmail}${query ? `?${query}` : ''}`;
  };
  const revealItems = document.querySelectorAll('.intro, .featured, .quote-band, .newsletter, .shop-toolbar, .product-card, .story-image, .story-copy, .story-founder, .story-chapter, .story-philosophy, .story-manifesto, .values > div, .contact-intro, .contact-details > div, .contact-form');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reveal-ready');
    const observer = new IntersectionObserver((entries, currentObserver) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); currentObserver.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach((item) => { item.classList.add('reveal'); observer.observe(item); });
  }

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
  const updateBagCount = () => document.querySelectorAll('.bag-count').forEach((count) => { count.textContent = String(getBagCount()); });
  let renderCart = () => {};
  const saveCart = (items) => { localStorage.setItem(cartKey, JSON.stringify(items)); updateBagCount(); renderCart(); };
  const addBagItem = (item, quantity = 1) => {
    const items = getCartItems();
    const existing = items.find((entry) => entry.name === item.name && entry.color === item.color && entry.size === item.size);
    if (existing) existing.quantity += quantity; else items.push({ ...item, quantity });
    saveCart(items);
  };

  const cart = document.createElement('div');
  cart.className = 'cart-overlay';
  cart.setAttribute('aria-hidden', 'true');
  cart.innerHTML = '<aside class="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title"><header class="cart-header"><div><p class="eyebrow">YOUR WAVESTATE EDIT</p><h2 id="cart-title">Your cart <span class="cart-item-count"></span></h2></div><button class="cart-close" type="button" aria-label="Close cart">\u00d7</button></header><div class="cart-items"></div><div class="cart-empty" hidden><p>Your cart is taking a little pause.</p><a class="text-link" href="shop.html">Explore the collection <span>\u2197</span></a></div><section class="cart-summary"><div class="cart-total"><span>Total</span><strong class="cart-total-value">\u20a60</strong></div><p class="cart-shipping-note">Delivery and any applicable fees are calculated at checkout.</p><button class="button button-dark cart-checkout" type="button">Continue to checkout <span>\u2197</span></button><button class="cart-clear" type="button">Delete all items</button><form class="checkout-form" hidden><p class="eyebrow">A FEW DETAILS</p><label for="checkout-name">Full name</label><input id="checkout-name" name="name" autocomplete="name" required><label for="checkout-email">Email</label><input id="checkout-email" name="email" type="email" required><label for="checkout-address">Delivery address</label><textarea id="checkout-address" name="address" rows="2" required></textarea><p class="checkout-note">Online payment is not connected yet. Your selected items and total are ready for checkout.</p><button class="button button-dark" type="submit">Review order <span>\u2197</span></button><p class="checkout-message" aria-live="polite"></p></form></section></aside>';
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
      return `<article class="cart-item"><img src="${item.image}" alt="${item.name}"><div class="cart-item-info"><h3>${item.name}</h3><p class="cart-item-color">${item.color}</p><div class="cart-edit-row">${sizeEditor}<div class="cart-qty-control"><span>Quantity</span><div class="cart-quantity"><button type="button" data-cart-action="decrease" data-index="${index}" aria-label="Decrease quantity">\u2212</button><span>${item.quantity}</span><button type="button" data-cart-action="increase" data-index="${index}" aria-label="Increase quantity">+</button></div></div></div><p class="cart-unit-price">Unit price <strong>${formatNaira(item.price)}</strong></p><div class="cart-line-total"><span>Item total</span><strong>${formatNaira(item.price * item.quantity)}</strong></div></div><button class="cart-remove" type="button" data-cart-action="remove" data-index="${index}" aria-label="Remove ${item.name}">Remove</button></article>`;
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
  cart.querySelector('.checkout-form').addEventListener('submit', (event) => { event.preventDefault(); cart.querySelector('.checkout-message').textContent = 'Your order details are ready. Online payment still needs to be connected.'; });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && cart.classList.contains('is-open')) closeCart(); });
  updateBagCount();

  let openProductOptions = null;
  document.querySelectorAll('.add-button').forEach((button) => button.addEventListener('click', () => {
    const card = button.closest('.product-card'); if (!card) return;
    if (openProductOptions) { openProductOptions(card); return; }
    addBagItem({ name: card.querySelector('h3')?.textContent.trim() || 'Wavestate item', color: card.querySelector('.product-info p')?.textContent.trim() || 'Standard', size: card.dataset.category === 'bags' ? 'One size' : 'M', price: Number(card.dataset.price || 0), image: card.querySelector('.product-image img')?.src || '' });
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
    modal.innerHTML = '<section class="options-dialog" role="dialog" aria-modal="true" aria-labelledby="options-title"><button class="options-close" type="button" aria-label="Close options">\u00d7</button><div class="options-visual"><div class="options-image"><img alt=""></div></div><div class="options-content"><p class="eyebrow">MADE TO MOVE WITH YOU</p><h2 id="options-title"></h2><p class="options-description">Choose your favourite shade and find the fit that feels like you.</p><div class="variant-heading"><span>Available shades</span><span class="options-price"></span></div><div class="variant-list"></div><div class="options-size"><label for="option-size">Your size</label><select id="option-size"><option>XS</option><option>S</option><option selected>M</option><option>L</option><option>XL</option></select></div><div class="options-quantity"><label for="option-quantity">Quantity</label><div class="quantity-stepper"><button type="button" data-quantity="minus" aria-label="Decrease quantity">\u2212</button><input id="option-quantity" type="number" min="0" max="99" value="0" inputmode="numeric"><button type="button" data-quantity="plus" aria-label="Increase quantity">+</button></div></div><button class="button button-dark options-add" type="button">Add to Cart <span>\u2197</span></button><p class="options-status" aria-live="polite"></p></div></section>';
    document.documentElement.appendChild(modal);
    const closeModal = () => { modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('modal-open'); document.documentElement.classList.remove('modal-open'); };
    const shades = {
      outerwear: [['Sandstone','#c3b39a','photo-1591047139829-d91aecb6caea',0],['Sage','#858b70','photo-1548126032-079a0fb0099d',12000],['Midnight','#333b3a','photo-1598033129183-c4f50c736f10',8000]],
      bottoms: [['Soft ivory','#e9e4d8','photo-1594633312681-425c7b97ccd1',0],['Warm taupe','#a99b89','photo-1506629905607-d9a7c2a6d6b0',7000],['Deep olive','#656953','photo-1583496661160-fb5886a0aaaa',5000]],
      bags: [['Burnt caramel','#9c623d','photo-1548036328-c9fa89d128fa',0],['Dark olive','#555b45','photo-1584917865442-de89df76afd3',5000],['Espresso','#41332b','photo-1590874103328-eac38a683ce7',11000]],
      dresses: [['Washed white','#eeeae1','photo-1551232864-3f0890e580d9',0],['Sea glass','#9aa99b','photo-1515886657613-9f3515b0c78f',9000],['Clay rose','#b78173','photo-1539008835657-9e8e9680c956',6000]],
      knitwear: [['Oat milk','#d7cbbb','photo-1620799140408-edc6dcb6d633',0],['Cloud grey','#aaa9a1','photo-1576566588028-4147f3842f27',5000],['Forest','#485648','photo-1618354691373-d851c5c3a990',8000]]
    };
    let chosenName = ''; let chosenColor = ''; let chosenPrice = 0; let draftKey = '';
    const drafts = new Map();
    const saveQuantity = () => {
      if (!draftKey || !chosenColor) return;
      const draft = drafts.get(draftKey) || {}; const amount = Math.max(0, Math.min(99, Number.parseInt(modal.querySelector('#option-quantity').value, 10) || 0));
      const selection = draft[chosenColor] || { quantity: 0, size: 'M' }; selection.quantity = amount;
      if (!modal.querySelector('.options-size').hidden) selection.size = modal.querySelector('#option-size').value;
      draft[chosenColor] = selection; drafts.set(draftKey, draft);
    };
    const updateQuantities = () => modal.querySelectorAll('.variant-choice').forEach((choice) => {
      const selection = (drafts.get(draftKey) || {})[choice.dataset.color] || {}; const amount = Number(selection.quantity || 0);
      const size = modal.querySelector('.options-size').hidden ? '' : ` \u00b7 ${selection.size || 'M'}`;
      choice.querySelector('.variant-selected-qty').textContent = amount ? `${amount} selected${size}` : 'Choose size & quantity';
    });
    const showOptions = (card) => {
      chosenName = card.querySelector('h3')?.textContent.trim() || 'Wavestate piece';
      const photo = card.querySelector('.product-image img'); const basePrice = Number(card.dataset.price || 0);
      chosenPrice = basePrice; draftKey = chosenName; if (!drafts.has(draftKey)) drafts.set(draftKey, {});
      chosenColor = card.querySelector('.product-info p')?.textContent.trim() || 'Sandstone';
      modal.querySelector('#options-title').textContent = chosenName; modal.querySelector('.options-image img').src = photo?.src || ''; modal.querySelector('.options-image img').alt = photo?.alt || chosenName;
      const choices = shades[card.dataset.category] || shades.outerwear; modal.querySelector('.options-size').hidden = card.dataset.category === 'bags';
      modal.querySelector('.variant-list').innerHTML = choices.map(([color, , image, adjustment], index) => {
        const price = basePrice + adjustment;
        return `<button type="button" class="variant-choice ${color.toLowerCase() === chosenColor.toLowerCase() || index === 0 ? 'selected' : ''}" data-color="${color}" data-price="${price}" data-image="https://images.unsplash.com/${image}?auto=format&fit=crop&w=700&q=80"><img class="variant-preview" src="https://images.unsplash.com/${image}?auto=format&fit=crop&w=240&q=75" alt="${color} ${chosenName}"><span class="variant-detail"><span class="variant-name">${color}</span><span class="variant-price">${formatNaira(price)}</span><span class="variant-selected-qty">Select quantity</span></span></button>`;
      }).join('');
      const selected = modal.querySelector('.variant-choice.selected'); chosenColor = selected?.dataset.color || chosenColor; chosenPrice = Number(selected?.dataset.price || basePrice);
      const draft = drafts.get(draftKey)[chosenColor] || { quantity: 0, size: 'M' };
      modal.querySelector('#option-quantity').value = String(draft.quantity); if (!modal.querySelector('.options-size').hidden) modal.querySelector('#option-size').value = draft.size;
      modal.querySelector('.options-price').textContent = formatNaira(chosenPrice); if (selected) modal.querySelector('.options-image img').src = selected.dataset.image;
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
      modal.querySelector('#option-quantity').value = String(selection.quantity); if (!modal.querySelector('.options-size').hidden) modal.querySelector('#option-size').value = selection.size;
      chosenPrice = Number(choice.dataset.price); modal.querySelector('.options-price').textContent = formatNaira(chosenPrice);
      const image = modal.querySelector('.options-image img'); image.src = choice.dataset.image; image.alt = `${chosenColor} ${chosenName}`; updateQuantities();
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
      const variants = [...modal.querySelectorAll('.variant-choice')].map((choice) => ({ color: choice.dataset.color, price: Number(choice.dataset.price), image: choice.dataset.image, ...((drafts.get(draftKey) || {})[choice.dataset.color] || { quantity: 0, size: 'M' }) })).filter((variant) => variant.quantity > 0);
      if (!variants.length) { modal.querySelector('.options-status').textContent = 'Choose a quantity for at least one color.'; return; }
      variants.forEach((variant) => addBagItem({ name: chosenName, color: variant.color, size: modal.querySelector('.options-size').hidden ? 'One size' : variant.size, price: variant.price, image: variant.image }, variant.quantity));
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
  document.querySelectorAll('[data-site-contact-link]').forEach((link) => { link.href = emailComposeUrl(); });
  document.querySelectorAll('[data-site-contact-email]').forEach((link) => {
    link.href = emailComposeUrl();
    link.textContent = `${siteContactEmail} \u2197`;
  });
  if (contactForm) {
    const methodChoices = contactForm.querySelectorAll('input[name="contact-method"]');
    const sendButton = contactForm.querySelector('#contact-send');
    const emailField = contactForm.querySelector('#email');
    const status = contactForm.querySelector('.form-message');
    const selectedMethod = () => contactForm.querySelector('input[name="contact-method"]:checked')?.value || 'email';
    const updateSendLabel = () => {
      if (sendButton) sendButton.innerHTML = selectedMethod() === 'whatsapp' ? 'Continue in WhatsApp <span>\u2197</span>' : 'Send via email <span>\u2197</span>';
      if (emailField) emailField.required = selectedMethod() === 'email';
    };
    methodChoices.forEach((choice) => choice.addEventListener('change', updateSendLabel));
    updateSendLabel();
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const values = new FormData(contactForm);
      const name = String(values.get('name') || '').trim();
      const email = String(values.get('email') || '').trim();
      const topic = String(values.get('topic') || 'General hello').trim();
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
      status.textContent = 'Opening your email app with your message ready to send.';
      window.location.href = emailComposeUrl(topic, message.replace(/\r?\n/g, '\r\n'));
    });
  }
})();
