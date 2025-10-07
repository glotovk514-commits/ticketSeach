document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const searchBtn = document.getElementById('search-btn');
    const fromInput = document.getElementById('from');
    const toInput = document.getElementById('to');
    const dateInput = document.getElementById('date');
    const trainList = document.getElementById('train-list');
    const resultsCount = document.getElementById('results-count');
    const loadingElement = document.getElementById('loading');

    // Элементы корзины
    const cartContainer = document.querySelector('.cart-container');
    const cartItems = document.querySelector('.cart-items');
    const totalPrice = document.querySelector('.total-price');
    const checkoutBtn = document.querySelector('.checkout-btn');

    // Массив для хранения товаров в корзине
    let cart = [];

    // Инициализация
    setDefaultDate();
    loadTrains(); // Загружаем поезда при загрузке страницы

    // Установка даты по умолчанию (завтра)
    function setDefaultDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }

    // Обработчик поиска
    searchBtn.addEventListener('click', function() {
        loadTrains();
    });

    // Функция загрузки поездов
    async function loadTrains() {
        const from = fromInput.value.trim();
        const to = toInput.value.trim();
        const date = dateInput.value;

        if (!from || !to) {
            showError('Пожалуйста, укажите пункты отправления и назначения');
            return;
        }

        showLoading();
        clearTrainList();

        try {
            // Парсим данные с сайта РЖД (симуляция)
            const trains = await parseRzhdData(from, to, date);
            displayTrains(trains);
            updateResultsCount(trains.length);
        } catch (error) {
            showError('Ошибка при загрузке данных: ' + error.message);
        } finally {
            hideLoading();
        }
    }

    // Функция парсинга данных РЖД (симуляция)
    async function parseRzhdData(from, to, date) {
        // В реальном приложении здесь будет парсинг с сайта РЖД
        // Для демонстрации используем имитацию запроса

        return new Promise((resolve) => {
            setTimeout(() => {
                // Имитация данных с сайта РЖД
                const trains = [
                    {
                        number: '022А',
                        name: 'Ночной Экспресс',
                        type: 'ТВЕРСК - Скорый',
                        from: {
                            city: 'Москва',
                            station: 'Ленинградский вокзал',
                            date: formatDate(date),
                            time: '21:25'
                        },
                        to: {
                            city: 'Санкт-Петербург',
                            station: 'Московский вокзал',
                            date: formatDate(date, 1),
                            time: '06:26'
                        },
                        duration: '09 ч 01 м',
                        prices: [
                            { type: 'Купе', info: 'Мест.1', price: 9349.5 },
                            { type: 'СВ', info: 'Мест.2', price: 17495.3 }
                        ]
                    },
                    {
                        number: '016А',
                        name: 'Арктика',
                        type: 'ФПК - Скорый • Фирменный',
                        from: {
                            city: 'Москва',
                            station: 'Ленинградский вокзал',
                            date: formatDate(date),
                            time: '23:46'
                        },
                        to: {
                            city: 'Санкт-Петербург',
                            station: 'Ладожский вокзал',
                            date: formatDate(date, 1),
                            time: '08:13'
                        },
                        duration: '08 ч 27 м',
                        prices: [
                            { type: 'Купе', info: 'Мест.2', price: 9666.7 }
                        ]
                    },
                    {
                        number: '782А',
                        name: 'Сапсан',
                        type: 'Скоростной',
                        from: {
                            city: 'Москва',
                            station: 'Ленинградский вокзал',
                            date: formatDate(date),
                            time: '07:00'
                        },
                        to: {
                            city: 'Санкт-Петербург',
                            station: 'Московский вокзал',
                            date: formatDate(date),
                            time: '11:30'
                        },
                        duration: '04 ч 30 м',
                        prices: [
                            { type: 'Эконом', info: 'Мест.2', price: 2540.0 },
                            { type: 'Бизнес', info: 'Мест.1', price: 5340.0 }
                        ]
                    },
                    {
                        number: '754А',
                        name: 'Ласточка',
                        type: 'Скоростной',
                        from: {
                            city: 'Москва',
                            station: 'Ленинградский вокзал',
                            date: formatDate(date),
                            time: '14:20'
                        },
                        to: {
                            city: 'Санкт-Петербург',
                            station: 'Московский вокзал',
                            date: formatDate(date),
                            time: '19:45'
                        },
                        duration: '05 ч 25 м',
                        prices: [
                            { type: 'Сидячий', info: 'Мест.2', price: 1890.0 },
                            { type: 'Бизнес', info: 'Мест.1', price: 3890.0 }
                        ]
                    }
                ];

                resolve(trains);
            }, 2000); // Имитация задержки сети
        });
    }

    // Функция форматирования даты
    function formatDate(dateString, addDays = 0) {
        const date = new Date(dateString);
        date.setDate(date.getDate() + addDays);

        const options = { day: 'numeric', month: 'long', weekday: 'short' };
        const formattedDate = date.toLocaleDateString('ru-RU', options);

        // Преобразуем "4 окт., сб" в "04 октября, сб"
        const parts = formattedDate.split(' ');
        if (parts[0].length === 1) {
            parts[0] = '0' + parts[0];
        }

        return parts.join(' ');
    }

    // Функция отображения поездов
    function displayTrains(trains) {
        trainList.innerHTML = '';

        if (trains.length === 0) {
            trainList.innerHTML = '<div class="error-message">Поездов по заданному маршруту не найдено</div>';
            return;
        }

        trains.forEach(train => {
            const trainCard = createTrainCard(train);
            trainList.appendChild(trainCard);
        });

        // Добавляем обработчики для кнопок "В корзину"
        addCartEventListeners();
    }

    // Функция создания карточки поезда
    function createTrainCard(train) {
        const card = document.createElement('div');
        card.className = 'train-card';

        card.innerHTML = `
            <div class="train-header">
                <div class="train-number">№ ${train.number} • ${train.name}</div>
                <div class="train-type">${train.type}</div>
            </div>

            <div class="route-info">
                <div class="route">
                    <div class="city">${train.from.city}</div>
                    <div class="station">${train.from.station}</div>
                </div>

                <div class="journey">
                    <div class="date">${train.from.date}</div>
                    <div class="duration">${train.duration}</div>
                    <div class="time">${train.to.date}<br>${train.to.time}</div>
                </div>

                <div class="route">
                    <div class="city">${train.to.city}</div>
                    <div class="station">${train.to.station}</div>
                </div>
            </div>

            <div class="train-actions">
                <button class="info-btn">О поезде</button>
                <button class="info-btn">МЕСТА / СТОИМОСТЬ</button>
                <button class="info-btn">Маршрут</button>
                <button class="info-btn">Годовой график</button>
            </div>

            <div class="prices">
                ${train.prices.map(price => `
                    <div class="price-item">
                        <div class="seat-type">${price.type}</div>
                        <div class="seat-info">${price.info}</div>
                        <div class="price">от ${price.price.toLocaleString('ru-RU')} ₽</div>
                        <button class="add-to-cart"
                                data-train="${train.number}"
                                data-name="${train.name}"
                                data-type="${price.type}"
                                data-price="${price.price}">
                            В корзину
                        </button>
                    </div>
                `).join('')}
            </div>
        `;

        return card;
    }

    // Функции управления UI
    function showLoading() {
        loadingElement.style.display = 'flex';
    }

    function hideLoading() {
        loadingElement.style.display = 'none';
    }

    function clearTrainList() {
        trainList.innerHTML = '';
    }

    function updateResultsCount(count) {
        resultsCount.textContent = `Найдено ${count} поездов`;
    }

    function showError(message) {
        trainList.innerHTML = `<div class="error-message">${message}</div>`;
    }

    // Функции корзины
    function addCartEventListeners() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const train = this.getAttribute('data-train');
                const name = this.getAttribute('data-name');
                const type = this.getAttribute('data-type');
                const price = parseFloat(this.getAttribute('data-price'));

                addToCart(train, name, type, price);
                showCart();
            });
        });
    }

    function addToCart(train, name, type, price) {
        const existingItem = cart.find(item =>
            item.train === train && item.type === type
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                train: train,
                name: name,
                type: type,
                price: price,
                quantity: 1
            });
        }

        updateCartDisplay();
    }

    function updateCartDisplay() {
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-train">${item.name} №${item.train}</div>
                    <div class="cart-item-type">${item.type}</div>
                </div>
                <div class="cart-item-price">${itemTotal.toLocaleString('ru-RU')} ₽</div>
                <button class="remove-item" data-index="${index}">×</button>
            `;

            cartItems.appendChild(cartItem);
        });

        totalPrice.textContent = `${total.toLocaleString('ru-RU')} ₽`;

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeFromCart(index);
            });
        });
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCartDisplay();

        if (cart.length === 0) {
            hideCart();
        }
    }

    function showCart() {
        cartContainer.classList.add('open');
    }

    function hideCart() {
        cartContainer.classList.remove('open');
    }

    // Обработчики для фильтров
    document.querySelectorAll('.filter-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.filter-item').forEach(i => {
                i.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Обработчик для кнопки оформления заказа
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Корзина пуста');
            return;
        }

        alert('Переход к оформлению заказа. В реальном приложении здесь будет форма оформления.');
    });

    // Автозаполнение при нажатии Enter в полях ввода
    [fromInput, toInput, dateInput].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loadTrains();
            }
        });
    });
});