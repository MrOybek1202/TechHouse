const listBtn = document.getElementById('listViewBtn')
const tileBtn = document.getElementById('tileViewBtn')
const productGrid = document.getElementById('productGrid')

listBtn.addEventListener('click', function () {
	productGrid.classList.add('list-view')
	listBtn.classList.add('active')
	tileBtn.classList.remove('active')
})

tileBtn.addEventListener('click', function () {
	productGrid.classList.remove('list-view')
	tileBtn.classList.add('active')
	listBtn.classList.remove('active')
})
// Modal Open
function toggleFilters() {
	const sidebar = document.getElementById('sidebar')
	const overlay = document.getElementById('sidebarOverlay')
	sidebar.classList.toggle('mobile-open')
	overlay.classList.toggle('active')
}

function setListView() {
	document.getElementById('productGrid').classList.add('list-view')
	document.getElementById('listViewBtn').classList.add('active')
	document.getElementById('tileViewBtn').classList.remove('active')
}

function setTileView() {
	document.getElementById('productGrid').classList.remove('list-view')
	document.getElementById('tileViewBtn').classList.add('active')
	document.getElementById('listViewBtn').classList.remove('active')
}
//  Open Modal
function toggleCatalog() {
	const modal = document.getElementById('catalogModal')
	const isActive = modal.classList.contains('active')

	if (isActive) {
		modal.classList.remove('active')
		document.body.style.overflow = ''
	} else {
		modal.classList.add('active')
		document.body.style.overflow = 'hidden'
	}
}

// Prevent scroll on body when modal is open
window.addEventListener('resize', function () {
	const modal = document.getElementById('catalogModal')
	if (window.innerWidth > 768 && modal.classList.contains('active')) {
		toggleCatalog()
	}
})
