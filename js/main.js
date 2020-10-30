'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

// first module
const buttonAuth = document.querySelector('.button-auth'),
  modalAuth = document.querySelector('.modal-auth'),
  closeAuth = document.querySelector('.close-auth'),
  body = document.querySelector('body'),
  loginInput = document.querySelector('#login'),
  loginInForm = document.querySelector('#logInForm'),
  buttonOut = document.querySelector('.button-out'),
  userName = document.querySelector('.user-name'),
  modaldialog = document.querySelector('.modal-auth'),
  modalWindow = document.querySelector('.modal-dialog');

let login = localStorage.getItem('user');

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

function authorized() {
  buttonAuth.style.display = 'none';
  buttonOut.style.display = 'block';
  buttonOut.style.background = 'red';
  userName.textContent = `Здравствуйте, ${login}`;
  userName.style.display = 'inline';
  localStorage.setItem('user', login);

  setTimeout(() => {
    closeModal();
    loginInForm.reset();
  }, 1500);

  buttonOut.addEventListener('click', () => {
    userName.style.display = "";
    buttonAuth.style.display = '';
    buttonOut.style.display = 'none';
    localStorage.removeItem('user');
    login = '';
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

checkAuth();
notAuthorized();

// second module
// — Реализуйте вывод карточек на страницу по видео уроку
// — Если пользователь не авторизован и кликнет на карточку то открываться должно модальное окно с авторизацией

const cardsRestaurants = document.querySelector('.cards-restaurants'),
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
  restaurantCategory = document.querySelector('.category');


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
    cardRestaurant.info = {name, price, products, stars, kitchen};
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

  setTimeout(() => {
    if (target) {
      if (login) {
        promo.classList.add('hide');
        restaurants.classList.add('hide');
        menu.classList.remove('hide');
        cardsMenu.textContent = '';

        const {name, stars, price, kitchen} = target.info;
        console.dir(target.info);
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
  id,
  image,
  name,
  price
}) {

  const card = document.createElement('div');
  card.className = 'card';
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



// day 3
// slider

const mySwiper = new Swiper('.swiper-container', {
  sliderPerView: 1,
  loop: true,
  autoplay: true,
  effect: 'cube',
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

//third module

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