	class CartManager {
		constructor() {
				this.cart = JSON.parse(localStorage.getItem('cart')) || []
				this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || []
				this.compare = JSON.parse(localStorage.getItem('comparison')) || []
				this.user = JSON.parse(localStorage.getItem('currentUser'))

				this.createMiniModal()

				this.events()
				this.syncIcons()
				this.updateCartCount()
				this.updateUserUI()
		}

		// MINI MODAL 

		createMiniModal() {
				const miniModal = document.createElement('div')
				miniModal.className = 'mini-modal'

				miniModal.innerHTML = `
						<p class="mini-modal-p"></p>
						<button class="mini-modal-btn">
								<i class="fas"></i>
								<a class="mini-modal-a" href=""></a>
						</button>
				`

				document.body.appendChild(miniModal)
				this.miniModal = miniModal
				this.modalText = miniModal.querySelector('p')
				this.modalButton = miniModal.querySelector('button')
				this.modalLink = miniModal.querySelector('a')
				this.modalIcon = miniModal.querySelector('i')
		}

		showMiniModal(message, buttonText, icon, link) {
				this.modalText.textContent = message
				this.modalLink.textContent = buttonText
				this.modalIcon.className = icon
				this.modalLink.href = link

				this.miniModal.style.display = 'flex'

				setTimeout(() => {
						this.miniModal.style.transform = 'translateX(-50%) translateY(0)'
						this.miniModal.style.opacity = '1'
				}, 10)

				setTimeout(() => {
						this.hideMiniModal()
				}, 3000)
		}

		hideMiniModal() {
				this.miniModal.style.transform = 'translateX(-50%) translateY(100px)'
				this.miniModal.style.opacity = '0'

				setTimeout(() => {
						this.miniModal.style.display = 'none'
				}, 300)
		}

		// EVENTS 

		events() {
				document.addEventListener('click', e => {
						if (e.target.closest('.cart-btn')) {
								e.preventDefault()
								const btn = e.target.closest('.cart-btn')
								this.addToCart(btn)
						}

						if (e.target.closest('.action-btn .fa-heart')) {
								e.preventDefault()
								const btn = e.target.closest('.action-btn')
								this.toggleWishlist(btn)
						}

						if (e.target.closest('.action-btn .fa-balance-scale')) {
								e.preventDefault()
								const btn = e.target.closest('.action-btn')
								this.toggleCompare(btn)
						}

						if (e.target.closest('.mini-modal')) {
								e.preventDefault()
								this.hideMiniModal()
						}
				})
		}

		getProduct(card) {
				let priceText = card.querySelector('.current-price')?.innerText || '0'
				let price = Number(priceText.replace(/[^\d]/g, '')) || 0

				return {
						id: card.dataset.productId || Date.now().toString(),
						title: card.querySelector('.product-title')?.innerText || 'Product',
						price: price,
						image: card.querySelector('img')?.src || './images/product.png',
						count: 1,
				}
		}

		checkLogin() {
				if (!this.user) {
						this.showMiniModal(
								'Please log in first',
								'Go to login page',
								'fas fa-sign-in-alt',
								'./authPage.html'
						)
						return false
				}
				return true
		}

		// CART

		addToCart(btn) {
				if (!this.checkLogin()) return

				let card = btn.closest('.product-card')
				let product = this.getProduct(card)
				let id = product.id

				let existingItem = this.cart.find(item => item.id === id)

				if (existingItem) {
						this.showMiniModal(
								`Product is already in your cart`,
								'Go to cart',
								'fas fa-shopping-cart',
								'./basket.html'
						)
						return
				}

				this.cart.push(product)
				localStorage.setItem('cart', JSON.stringify(this.cart))

				this.updateCartButton(card, true)

				this.showMiniModal(
						`Product added to cart`,
						'Go to cart',
						'fas fa-check',
						'./basket.html'
				)

				this.updateCartCount()
				this.syncIcons()
		}

		updateCartButton(card, added = true) {
				const btn = card.querySelector('.cart-btn')
				if (!btn) return

				if (added) {
						btn.style.background = '#ffc107'
						btn.style.color = '#fff'
						btn.innerHTML = '<i class="fas fa-check"></i>'

						btn.onclick = e => {
								e.preventDefault()
								window.location.href = './basket.html'
						}
				} else {
						btn.style.background = ''
						btn.style.color = ''
						btn.innerHTML = '<i class="fas fa-shopping-cart"></i>'

						btn.onclick = e => {
								e.preventDefault()
								this.addToCart(btn)
						}
				}
		}

		updateCartCount() {
				let count = this.cart.reduce((total, item) => total + item.count, 0)

				document
						.querySelectorAll('.cart-badge, .mobile-nav-badge')
						.forEach(badge => {
								badge.innerText = count
						})
		}

		// WISHLIST

		toggleWishlist(btn) {
				if (!this.checkLogin()) return

				let card = btn.closest('.product-card')
				let product = this.getProduct(card)
				let icon = btn.querySelector('i')

				let existingIndex = this.wishlist.findIndex(item => item.id === product.id)

				if (existingIndex > -1) {
						this.wishlist.splice(existingIndex, 1)

						icon.classList.remove('fas')
						icon.classList.add('far')
						icon.style.color = ''
				} else {
						this.wishlist.push(product)

						icon.classList.remove('far')
						icon.classList.add('fas')
						icon.style.color = '#dc3545'

						this.showMiniModal(
								`Product added to wishlist`,
								'Go to wishlist',
								'fas fa-heart',
								'./wishlist.html'
						)
				}

				localStorage.setItem('wishlist', JSON.stringify(this.wishlist))
		}

		// COMPARE 

		toggleCompare(btn) {
				if (!this.checkLogin()) return

				let card = btn.closest('.product-card')
				let product = this.getProduct(card)
				let icon = btn.querySelector('i')

				let existingIndex = this.compare.findIndex(item => item.id === product.id)

				if (existingIndex > -1) {
						this.compare.splice(existingIndex, 1)

						icon.style.color = ''
				} else {
						this.compare.push(product)

						icon.style.color = '#0058ab'

						this.showMiniModal(
								`Product added to comparison`,
								'Go to comparison',
								'fas fa-balance-scale',
								'./comparison.html'
						)
				}

				localStorage.setItem('comparison', JSON.stringify(this.compare))
		}

		// SYNC ICONS

		syncIcons() {
				document.querySelectorAll('.product-card').forEach(card => {
						let id = card.dataset.productId

						if (!id) return

						let heart = card.querySelector('.action-btn .fa-heart')
						if (heart) {
								let inWishlist = this.wishlist.some(
										item => item.id.toString() === id.toString()
								)

								if (inWishlist) {
										heart.classList.remove('far')
										heart.classList.add('fas')
										heart.style.color = '#dc3545'
								} else {
										heart.classList.remove('fas')
										heart.classList.add('far')
										heart.style.color = ''
								}
						}

						let scale = card.querySelector('.action-btn .fa-balance-scale')
						if (scale) {
								let inCompare = this.compare.some(
										item => item.id.toString() === id.toString()
								)
								scale.style.color = inCompare ? '#0058ab' : ''
						}

						let cartBtn = card.querySelector('.cart-btn')
						if (cartBtn) {
								let inCart = this.cart.some(
										item => item.id.toString() === id.toString()
								)

								if (inCart) {
										cartBtn.style.background = '#ffc107'
										cartBtn.style.color = '#fff'
										cartBtn.innerHTML = '<i class="fas fa-check"></i>'
										cartBtn.title = 'Product already in cart'
										cartBtn.onclick = e => {
												e.preventDefault()
												window.location.href = './basket.html'
										}
								} else {
										cartBtn.style.background = ''
										cartBtn.style.color = ''
										cartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i>'
										cartBtn.title = 'Add to cart'
										cartBtn.onclick = e => {
												e.preventDefault()
												this.addToCart(cartBtn)
										}
								}
						}
				})
		}

		// USER UI

		updateUserUI() {
				const currentUser = JSON.parse(localStorage.getItem('currentUser'))
				const userIcon = document.querySelector('.icon-btn .fa-user')
				const userText = document.querySelector('.icon-btn span')

				if (currentUser && userIcon && userText) {
						userIcon.classList.remove('fa-regular')
						userIcon.classList.add('fa-solid')
						userText.textContent = currentUser.name.split(' ')[0]

						const userLink = userIcon.closest('.icon-btn')
						if (userLink && userLink.href.includes('index.html')) {
								userLink.href = './profile.html'
						}
				}
		}

		// PUBLIC METHODS

		getCartItems() {
				return this.cart
		}

		getWishlistItems() {
				return this.wishlist
		}

		getCompareItems() {
				return this.compare
		}

		removeFromCart(productId) {
				this.cart = this.cart.filter(item => item.id !== productId)
				localStorage.setItem('cart', JSON.stringify(this.cart))
				this.updateCartCount()
				this.syncIcons()
		}

		updateQuantity(productId, quantity) {
				let item = this.cart.find(item => item.id === productId)
				if (item) {
						item.count = quantity
						localStorage.setItem('cart', JSON.stringify(this.cart))
						this.updateCartCount()
				}
		}

		clearCart() {
				this.cart = []
				localStorage.setItem('cart', JSON.stringify(this.cart))
				this.updateCartCount()
				this.syncIcons()
		}
	}

	class BasketManager {
		constructor() {
				this.cart = JSON.parse(localStorage.getItem('cart')) || []
				this.user = JSON.parse(localStorage.getItem('currentUser'))

				this.init()
				this.events()
				this.updateUI()
		}

		init() {
				this.loadCart()
		}

		loadCart() {
				if (!this.user) {
						this.cart = []
						localStorage.removeItem('cart')
						this.showEmptyBasket()
						return
				}

				if (this.cart.length === 0) {
						this.showEmptyBasket()
						return
				}

				this.displayCartItems()
		}

		displayCartItems() {
				const productList = document.querySelector('.product-list-basket')
				if (!productList) return

				productList.innerHTML = ''

				productList.innerHTML = `
						<div class="select-all-section">
								<div class="checkbox-wrapper">
										<div class="custom-checkbox checked">
												<i class="bi bi-check2"></i>
										</div>
										<span class="select-all-label">Select All</span>
								</div>
								<span class="delete-selected">Delete Selected</span>
						</div>
				`

				this.cart.forEach((item, index) => {
						const productCard = this.createProductCard(item, index)
						productList.appendChild(productCard)
				})
		}

		createProductCard(item, index) {
				const card = document.createElement('div')
				card.className = 'product-card-basket'
				card.dataset.productId = item.id

				card.innerHTML = `
						<div class="product-checkbox-basket">
								<div class="custom-checkbox checked" data-index="${index}">
										<i class="bi bi-check2"></i>
								</div>
						</div>
						<div class="product-image-basket">
								<img src="${item.image}" alt="${item.title}" onerror="this.src='./images/product.png'">
								${item.discount ? `<div class="discount-badge-basket">${item.discount}</div>` : ''}
						</div>
						<div class="product-info-basket">
								<h3 class="product-title-basket">${item.title}</h3>
								${item.color ? `<div class="product-color-basket">Color: ${item.color}</div>` : ''}
								${item.memory ? `<div class="product-memory-basket">Memory: ${item.memory}</div>` : ''}
								<span class="product-store-basket">Available</span>
						</div>
						<div class="product-actions-basket">
								<div class="price-section-basket">
										<div class="price-container-basket">
												<div class="current-price-basket">${this.formatPrice(item.price)} UZS</div>
												${item.oldPrice ? `<div class="old-price-basket">${this.formatPrice(item.oldPrice)} UZS</div>` : ''}
										</div>
								</div>
								<div class="quantity-controls-basket">
										<button class="qty-btn-basket minus-btn" data-index="${index}">−</button>
										<span class="qty-display-basket" data-index="${index}">${item.count}</span>
										<button class="qty-btn-basket plus-btn" data-index="${index}">+</button>
										<div class="action-icons-basket">
												<button class="icon-btn-basket wishlist-btn" data-index="${index}">
														<i class="bi bi-heart"></i>
												</button>
												<button class="icon-btn-basket delete-basket" data-index="${index}">
														<i class="bi bi-trash"></i>
												</button>
										</div>
								</div>
						</div>
				`

				return card
		}

		formatPrice(price) {
				return Number(price).toLocaleString('en-US')
		}

		events() {
				document.addEventListener('click', e => {
						if (e.target.closest('.delete-basket') || e.target.classList.contains('bi-trash')) {
								const deleteBtn = e.target.closest('.delete-basket')
								const index = deleteBtn?.dataset.index
								if (index !== undefined) {
										this.removeFromCart(parseInt(index))
								}
						}
				})
		}

		removeFromCart(index) {
				if (index >= 0 && index < this.cart.length) {
						const item = this.cart[index]

						if (confirm(`Are you sure you want to remove "${item.title}" from your cart?`)) {
								this.cart.splice(index, 1)
								localStorage.setItem('cart', JSON.stringify(this.cart))

								this.loadCart()
						}
				}
		}

		showEmptyBasket() {
				const productList = document.querySelector('.product-list-basket')
				if (productList) {
						productList.innerHTML = `
								<div class="empty">
										<div class="empty-icon">
												<i class="bi bi-cart-x"></i>
										</div>
										<h2 class="empty-title">Cart is empty</h2>
										<p class="empty-text">Your cart is currently empty</p>
								</div>
						`
				}
		}
	}

	// START 
	document.addEventListener('DOMContentLoaded', () => {
		window.cartManager = new CartManager()
		window.basketManager = new BasketManager()
	})