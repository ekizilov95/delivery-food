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
  promo = document.querySelector('.container-promo'),
  restaurants = document.querySelector('.restaurants'),
  menu = document.querySelector('.menu'),
  logo = document.querySelector('.logo'),
  cardsMenu = document.querySelector('.cards-menu');



function createCardsRestaurant() {

  const card = `
      <a class="card card-restaurant">
        <img src="img/pizza-plus/preview.jpg" alt="image" class="card-image"/>
        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title">Пицца плюс</h3>
            <span class="card-tag tag">50 мин</span>
          </div>
          <!-- /.card-heading -->
          <div class="card-info">
            <div class="rating">
              4.5
            </div>
            <div class="price">От 900 ₽</div>
            <div class="category">Пицца</div>
          </div>
        </div>
      </a>
    `;
  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

function linkToRestaurant(e) {
  let target = e.target.closest('.card-restaurant');

  if (target) {
    if(login) {
      promo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');
    } else {
      openModal();
    }
 
  } 

}

function createCardsMenu() {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="img/pizza-plus/pizza-vesuvius.jpg" alt="image" class="card-image" />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">Пицца Везувий</h3>
      </div>
      <!-- /.card-heading -->
      <div class="card-info">
        <div class="ingredients">Соус томатный, сыр «Моцарелла», ветчина, пепперони, перец
          «Халапенье», соус «Тобаско», томаты.
        </div>
      </div>
      <!-- /.card-info -->
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">545 ₽</strong>
      </div>
  `;
  cardsMenu.append(card);

}


cardsRestaurants.addEventListener('click', linkToRestaurant);
logo.addEventListener('click', () => {
  promo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
});

createCardsMenu();
createCardsMenu();
createCardsMenu();
createCardsMenu();

createCardsRestaurant();
createCardsRestaurant();
createCardsRestaurant();