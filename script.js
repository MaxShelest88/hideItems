//Работает только с гридами.

// Для задания количества видимых элементов пишем в контейнере атрибут data-visible="10" - с количеством видимых объектов, остальные скроются
// Если между элементами есть какое-то пустое место, то пишем атрибут data-gap

const moreContainer = document.querySelector('._more-container');
const moreButton = document.querySelector('._more-button');
const moreItems = document.querySelectorAll('._more-item');
// Ширина при которой срабатывает скрытие
const w = 768;
let visibleItemsNumber;
// Проверка на скрытие
let isHidden = false;
// Создаем пустой массив скрытых элементов
let hiddenItems = [];
// Создаем массив из коллекции всех элементов
let moreItemsArrey = [...moreItems];

if (moreContainer) {
	// запускаем функцию
	toggleElemets();
	setHeight();
}

moreItems.forEach(el => {
	el.addEventListener("click", () => {
		el.classList.toggle("_active");
	});
});

// Функция для вычисления ширины экрана

function getClientWidth() {
	return document.documentElement.clientWidth;
}

// Функция скрытия элементов
function toggleElemets() {
	visibleItemsNumber = moreContainer.getAttribute('data-visible');
	const windowWidth = getClientWidth();
	// let element;
	//   Если ширина меньше задданой и элементы не скрыты
	if (windowWidth <= w && !isHidden) {
		// Кнопка появляется
		moreButton.classList.add("_visible");
		// Наполняем массив скрытыми элементами и удаляем их из массива всех элементов
		hiddenItems = moreItemsArrey.splice(visibleItemsNumber);

		// скрываем элементы
		hideItems(hiddenItems);

		// Теперь элементы скрыты, и скрывать их больше не нужно
		isHidden = true;
		//     Если больше заданной ширины и элементы скрыты
	} else if (windowWidth > w && isHidden) {
		// Удаяем у кнопки класс _visible и скрываем кнопку
		if (moreButton.classList.contains('_visible')) {
			moreButton.classList.remove('_visible');
		}
		if (moreButton.classList.contains('_active')) {
			moreButton.classList.remove('_active');
		}
		// Показываем элементы
		showItems(hiddenItems);
		returnHiddenItems();
		isHidden = false;
	}
}

function hideItems(arr) {
	arr.forEach(element => {
		element.classList.add('fadeout');
		setTimeout(() => {
			element.classList.add('_hidden');
		}, 200);
		element.classList.remove('fadein');
	});
}

function showItems(arr) {
	arr.forEach(element => {
		element.classList.remove('fadeout', '_hidden');
		element.classList.add('fadein');
	});
}

// Считаем ширину контейнера с элементами
function moreContainerWidth() {
	return moreContainer.offsetWidth;
}

function setHeight() {
	const containerWidth = moreContainerWidth();
	// Создаем массив из коллекции всех элементов (для контроля за изменением количества элементов)
	moreItemsArrey = [...moreItems];
	// Вычисляем количество видимых элементов
	let visibleNumber = (hiddenItems.length > 0) ? (moreItemsArrey.length - hiddenItems.length) : moreItemsArrey.length;
	// Создаем массив из видимых элементов
	let visibleItemsArrey = (visibleNumber < moreItems.length) ? moreItemsArrey.slice(0, visibleNumber) : moreItems;
	// объявляем размеры элемента
	let itemWidth = 0;
	let itemHeight = 0;

	// Функция для вычисления этого пространтсво
	const gap = function () {
		if (moreContainer) {
			const dataGap = moreContainer.hasAttribute('data-gap');
			if (visibleItemsArrey.length > 0) {
				for (let index = 0; index < visibleItemsArrey.length; index++) {
					const element = visibleItemsArrey[index];
					// определяем высоту и ширину элемента
					itemWidth = element.getBoundingClientRect().width;
					itemHeight = element.getBoundingClientRect().height;
					// если элементов больше 1 и между ними пространство
					if (visibleItemsArrey.length > 1 && dataGap) {
						const secElemet = visibleItemsArrey[index + 1];
						let elementPosition = element.offsetLeft + Math.round(element.getBoundingClientRect().width);
						let secElementPosition = secElemet.offsetLeft;
						let elementY = element.offsetTop + element.getBoundingClientRect().height;
						let secElementY = secElemet.offsetTop;
						// если горизонтально
						if (secElementPosition > elementPosition) {
							return secElementPosition - elementPosition;
						}
						// если вертикально
						return secElementY - elementY;
					}
					// иначе = 0
					return 0;
				}

			}
		}

	}
	const gapWidth = gap();
	// Количество элементов в ряду
	let itemsInRow = (gapWidth) ? Math.round((containerWidth + gapWidth) / (itemWidth + gapWidth)) : (containerWidth / itemWidth);
	// Количество рядов
	let rowNumber = Math.ceil(visibleNumber / itemsInRow);

	// Вычисляем высоту и присваеваем
	moreContainer.style.height = Math.round((rowNumber * (itemHeight + gapWidth) - gapWidth)) + "px";
}


// По нажатию показываем элементы и устанавливаем  высоту контейнера
if (moreButton) {
	visibleItemsNumber = moreContainer.getAttribute('data-visible');
	const windowWidth = getClientWidth();
	moreButton.addEventListener("click", function () {
		moreButton.classList.toggle("_active");
		if (hiddenItems.length > 0) {
			showItems(hiddenItems);
			returnHiddenItems();
			// устанавливаем  высоту контейнера
			setHeight();
		} else {
			hiddenItems = moreItemsArrey.splice(visibleItemsNumber);
			// скрваем элементы
			hideItems(hiddenItems);
			// устанавливаем  высоту контейнера
			setHeight();
		}
	});
}

function returnHiddenItems() {
	// Возвращаем скрытые элементы обратно в массив всех элементов
	moreItemsArrey = [...hiddenItems];
	// Очищаем массив скрытых элементов
	hiddenItems.length = 0;
}

// Слушаем размеры окна и выполняем функции
window.addEventListener("resize", function () {
	if (moreContainer) {
		// запускаем функцию
		toggleElemets();
		setHeight();
	}
});