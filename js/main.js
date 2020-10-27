const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

const buttonAuth = document.querySelector('.button-auth'),
  modalAuth = document.querySelector('.modal-auth'),
  closeAuth = document.querySelector('.close-auth');
  body = document.querySelector('body'),
  loginInput = document.querySelector('#login'),
  loginInForm = document.querySelector('#logInForm'),
  buttonOut = document.querySelector('.button-out'),
  userName = document.querySelector('.user-name');

let login = localStorage.getItem('user');

function openModal() {
  modalAuth.classList.add('is-open');
  body.style.overflow = 'hidden';
}

function closeModal() {
  modalAuth.classList.remove('is-open');
  body.style.overflow = '';
}

function notAuthorized() {
  buttonAuth.addEventListener('click', openModal);
  closeAuth.addEventListener('click', closeModal);
  
}
notAuthorized();

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
    buttonAuth.style.display = 'flex';
    buttonOut.style.display = 'none';
    localStorage.removeItem('user');
  });

}


loginInForm.addEventListener('submit', (e) => {
  e.preventDefault();
  login = loginInput.value;
  checkAuth();

});


function checkAuth() {
  if(login) {
    authorized();
  } else {
    notAuthorized();
  }
}

checkAuth();