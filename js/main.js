'use strict';

const buttonAuth = document.querySelector('.button-auth'),
  modalAuth = document.querySelector('.modal-auth'),
  closeAuth = document.querySelector('.close-auth'),
  body = document.querySelector('body'),
  loginInput = document.querySelector('#login'),
  loginInForm = document.querySelector('#logInForm'),
  buttonOut = document.querySelector('.button-out'),
  userName = document.querySelector('.user-name'),
  modaldialog = document.querySelector('.modal-auth'),
  modalWindow = document.querySelector('.modal-dialog'),
  cartButton = document.querySelector("#cart-button"),
  modal = document.querySelector(".modal"),
  close = document.querySelector(".close"),
  cardsRestaurants = document.querySelector('.cards-restaurants'),
  promo = document.querySelector('.swiper-container'),
  restaurants = document.querySelector('.restaurants'),
  menu = document.querySelector('.menu'),
  logo = document.querySelector('.logo'),
  cardsMenu = document.querySelector('.cards-menu'),
  menuHeading = document.querySelector('.menu-heading'),
  preloader = document.createElement('img'),
  restaurantTitle = document.querySelector('.restaurant-title'),
  restauranRating = document.querySelector('.rating'),
  restaurantPrice = document.querySelector('.price'),
  restaurantCategory = document.querySelector('.category'),
  inputSearch = document.querySelector('.input-search'),
  cardInfo = document.querySelector('.card-info'),
  modalBody = document.querySelector('.modal-body'),
  counterButton = document.querySelector('.counter-button'),
  sumProducts = document.querySelector('.modal-pricetag'),
  modalFooter = document.querySelector('.modal-footer'),
  buttonTextCounter = document.querySelector('.button-text-counter');

let login = localStorage.getItem('user');
let basket = JSON.parse(localStorage.getItem(`cartList_${login}`)) || [];


function saveCart() {
  localStorage.setItem(`cartList_${login}`, JSON.stringify(basket));
}


function toggleModal() {
  modal.classList.toggle("is-open");
}

function openModal() {
  modalAuth.classList.add('is-open');
  body.style.overflow = 'hidden';

  modaldialog.addEventListener('click', (e) => {
    if (e.target == modaldialog && e.target.classList.contains('is-open')) {
      closeModal();
    }

  });
}

function closeModal() {
  modalAuth.classList.remove('is-open');
  body.style.overflow = '';
}

function notAuthorized() {
  buttonAuth.addEventListener('click', openModal);
  closeAuth.addEventListener('click', closeModal);
  loginInForm.classList.remove('hide');
}

function cartToggle() {
  cartButton.classList.add('show');
  if (basket.length > 0) {
    cartButton.style.display = 'flex';
  } else if (basket.length === 0) {
    cartButton.style.display = 'none';
    modal.classList.remove('is-open');
  }
}

function authorized() {
  buttonAuth.style.display = 'none';
  buttonOut.style.display = 'flex';
  buttonOut.style.background = 'red';
  userName.textContent = `Здравствуйте, ${login}`;
  userName.style.display = 'inline';
  localStorage.setItem('user', login);
  cartToggle();

  setTimeout(() => {
    closeModal();
    loginInForm.reset();
  }, 1500);

  buttonOut.addEventListener('click', () => {
    localStorage.removeItem('user');
    localStorage.removeItem(`cartList_${login}`);
    userName.style.display = "";
    buttonAuth.style.display = '';
    buttonOut.style.display = 'none';
    login = '';
    cartButton.style.display = 'none';
    loginInForm.classList.remove('hide');
  });

}


function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

loginInForm.addEventListener('submit', (e) => {
  e.preventDefault();
  login = loginInput.value;
  checkAuth();
});


function createCardsRestaurant({
  image,
  kitchen,
  name,
  price,
  products,
  stars,
  time_of_delivery: timeOfDelivery
}) {

  const cardRestaurant = document.createElement('a');
  cardRestaurant.className = 'card card-restaurant';
  cardRestaurant.products = products;
  cardRestaurant.info = {
    name,
    price,
    products,
    stars,
    kitchen
  };
  const card = `
        <img src="${image}" alt="image" class="card-image"/>
        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title">${name}</h3>
            <span class="card-tag tag">${timeOfDelivery} мин</span>
          </div>
          <div class="card-info">
            <div class="rating">
            ${stars}
            </div>
            <div class="price">От ${price} ₽</div>
            <div class="category">${kitchen}</div>
          </div>
        </div>
    `;
  cardRestaurant.insertAdjacentHTML('beforeend', card);
  cardsRestaurants.insertAdjacentElement('beforeend', cardRestaurant);
}

function linkToRestaurant(e) {
  let target = e.target.closest('.card-restaurant');

  if (login) {
    cardsRestaurants.style.opacity = '0.5';
    preloader.src = 'img/original.svg';
    preloader.style.cssText = `
      position:absolute;
      content: "";
      top: 46%;
      left: 50%;
      transform: scale(2);
    `;
    cardsRestaurants.append(preloader);
  }

  setTimeout(() => {
    if (target) {
      if (login) {
        promo.classList.add('hide');
        restaurants.classList.add('hide');
        menu.classList.remove('hide');
        cardsMenu.textContent = '';

        const {
          name,
          stars,
          price,
          kitchen
        } = target.info;
        restaurantTitle.textContent = name;
        restauranRating.textContent = stars;
        restaurantPrice.textContent = `От ${price} p`;
        restaurantCategory.textContent = kitchen;

        getData(`./db/${target.products}`)
          .then(data => {
            data.forEach(createCardsMenu);
          });
      } else {
        openModal(createCardsMenu);
      }
    }
  }, 800);

}

function createCardsMenu({
  description,
  image,
  name,
  price,
  id
}) {

  const card = document.createElement('div');
  card.className = 'card';
  card.id = id;
  card.innerHTML = `
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">${description}
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">${price} ₽</strong>
      </div>
    </div>
  `;
  cardsMenu.append(card);

}


cardsRestaurants.addEventListener('click', linkToRestaurant);
logo.addEventListener('click', () => {
  promo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
  cardsRestaurants.style.opacity = '';
  preloader.style.display = "none";
});



const mySwiper = new Swiper('.swiper-container', {
  sliderPerView: 1,
  loop: true,
  autoplay: true,
  effect: "cube",
  speed: 800,
  cubeEffect: {
    shadow: false,

  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
    clickable: true,
  },
});


const getData = async function (url) {

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Could not feth ${url}, status: ${response.status}`);
  }

  return await response.json();

}

getData("./db/partners.json")
  .then(data => {
    data.forEach(createCardsRestaurant);
  });

inputSearch.addEventListener('keydown', (e) => {
  const inputValue = inputSearch.value;
  if (e.code === "Enter" && inputValue) {

    getData('./db/partners.json')
      .then(partner => {
        return partner.map(item => {
          return item.products;
        });
      })
      .then(data => {
        cardsMenu.textContent = '';
        e.target.value = '';

        data.forEach(item => {
          getData(`./db/${item}`)
            .then(arr => {

              promo.classList.add('hide');
              restaurants.classList.add('hide');
              menu.classList.remove('hide');
              restaurantTitle.textContent = "Результат поиска:";
              cardInfo.style.display = 'none';

              const searchInput = arr.filter(obj => {
                const name = obj.name.toLowerCase();
                return name.includes(inputValue.toLowerCase());
              });

              searchInput.forEach(createCardsMenu);
            });
        });
      })
  }
});

function basketCounter() {
  buttonTextCounter.textContent = JSON.parse(localStorage.getItem(`cartList_${login}`)).length;
}

cardsMenu.addEventListener('click', (e) => {
  const target = e.target;
  const buttonAddCard = target.closest('.button-add-cart');

  if (buttonAddCard) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const price = card.querySelector('.card-price-bold').textContent;
    const id = card.id;

    const food = basket.find((obj) => {
      return obj.id === id;
    });

    if (food) {
      food.count += 1;
    } else {
      basket.push({
        title: title,
        price: price,
        id: id,
        count: 1,
      });
    }
    saveCart();
    basketCounter();
    cartToggle();
  }

});

function renderBasketCard() {
  modalBody.textContent = "";

  basket.forEach(({
    title,
    price,
    id,
    count
  }) => {
    const cardBasked = `
      <div class="food-row">
        <span class="food-name">${title}</span>
        <strong class="food-price">${price}</strong>
        <div class="food-counter">
          <button class="counter-button counter-button-minus" data-id=${id}>-</button>
          <span class="counter">${count}</span>
          <button class="counter-button counter-button-plus" data-id=${id}>+</button>
        </div>
      </div>
    `;

    modalBody.insertAdjacentHTML('afterbegin', cardBasked);
  });

}

function calcSum() {
  const sum = `${basket.reduce((sum, current) => sum + (parseFloat(current.price) * current.count), 0)}`;
  sumProducts.textContent = sum + " ₽";
}

modalBody.addEventListener('click', (e) => {
  const target = e.target;

  if (target.classList.contains('counter-button-plus')) {
    const food = basket.find(function (item) {
      return item.id === target.dataset.id;
    });
    food.count++;
    renderBasketCard();

  } else if (target.classList.contains('counter-button-minus')) {
    const food = basket.find(function (item) {
      return item.id === target.dataset.id;
    });
    if (food.count === 1) {
      basket.splice(basket.indexOf(food), 1);
    } else {
      food.count--;
    }
  }
  saveCart();
  basketCounter();
  cartToggle();
  renderBasketCard();
  calcSum();
});

function clearCart() {
  basket.splice(0, basket.length);
  modalBody.textContent = '';
  sumProducts.textContent = "0 ₽";
  cartToggle();
  localStorage.removeItem(`cartList_${login}`);
}

modalFooter.addEventListener('click', (e) => {
  const target = e.target;

  if (target.classList.contains('clear-cart')) {
    clearCart();


  } else if (target.classList.contains('button-primary')) {

    if (basket) {
      modalWindow.classList.add('hide');
      const thanksModal = document.createElement('div');
      thanksModal.className = 'modal-dialog';
      thanksModal.innerHTML = `
        <div class="modal-header">
          <h3 class="modal-title">Заказ принят, ожидайте звонка</h3>
          <button class="close">&times;</button>
        </div>
      `;
      modal.insertAdjacentElement('afterbegin', thanksModal);

      setTimeout(() => {
        thanksModal.remove();
        toggleModal();
        modalWindow.classList.remove('hide');
        modalBody.textContent = '';
        clearCart(); 
       
      }, 2000);
    } 
  }
});

cartButton.addEventListener("click", () => {
  renderBasketCard();
  calcSum();
  toggleModal();
});

close.addEventListener("click", toggleModal);


checkAuth();
notAuthorized();
basketCounter();