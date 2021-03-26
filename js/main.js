const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

//cart

const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart')

const openModal = function() {
	modalCart.classList.add('show');
};

const closeModal = function() {
	modalCart.classList.remove('show');
};

buttonCart.addEventListener('click', openModal);

modalCart.addEventListener('click', function(event) {
	const target = event.target;

	if (target.classList.contains('overlay') || target.classList.contains('modal-close')) {
		closeModal()
	}
})

//scroll smooth

const scrollLinks = document.querySelectorAll('a.scroll-link');

for (const scrollLink of scrollLinks) {
	scrollLink.addEventListener('click', function(event) {
		event.preventDefault();
		const id = scrollLink.getAttribute('href');
		document.querySelector(id).scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		})
	});
}

//----------GOODS---------

const more = document.querySelector('.more');
const navigationLink = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');
//Преобразует  json в массив
const getGoods = async function() {
	const result = await fetch('db/db.json');
	if (!result.ok) {
		throw 'Ошибочка вышла: ' + result.status
	}
	return await result.json();
};

/*
fetch('db/db.json')
	.then(function (responce) {
		return responce.json()
	})
	.then(function (data) {
		console.log(data)
	})
*/

const createCard = function (objCard) {
	const card = document.createElement('div');
	//className добавляет новый класс?..
	card.className = 'col-lg-3 col-sn-6'
	// добавляем верстку
	// ` ` - шаблонные строки, позволяет писать верстку в таком же виде
	card.innerHTML = ` 
	<div class="goods-card">
		${objCard.label ? `<span class="label">${objCard.label}</span>` : ''}
		<span class="label">${objCard.label}</span>
		<img src="db/${objCard.img}" alt="${objCard.name}" class="goods-image">
		<h3 class="goods-title">${objCard.name}</h3>
		<p class="goods-description">${objCard.description}</p>
		<button class="button goods-card-btn add-to-cart" data-id="${objCard.id}">
			<span class="button-price">$${objCard.price}</span>
		</button>
	</div>
	`;

	return card;
};
// Создание карточек с одеждой после удаления, преобразование передаваемого массива карточек
const renderCards = function(data) {
	//innerHTML=~textContent=~...
	longGoodsList.textContent = '';
	const cards = data.map(createCard)
	/*cards.array.forEach(element => {
		longGoodsList.append(card);
	});*/
	// ... - spread, распаковывает массив в отдельные элементы
	longGoodsList.append(...cards)
	document.body.classList.add('.show-goods')
};

more.addEventListener('click', function(event) {
	//Предотвратить перезагрузку
	event.preventDefault();
	getGoods().then(renderCards);
});

const filterCards = function(field, value) {
	getGoods().then(function(data) {
		const filteredGoods = data.filter(function(good) {
			return good[field] === value
		});
		return filteredGoods;
	})
	.then(renderCards);
};

// filterCards('gender', 'Mens')    .Совет: одинарные кавычки в js

navigationLink.forEach(function (link) {
	link.addEventListener('click', function(event) {
		event.preventDefault();
		const field = link.dataset.field;
		const value = link.textContent;
		filterCards(field, value)
	})
})