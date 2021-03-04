'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('fastDelivery'); //замімть пустого значення змінній login присвоюэмо значення з localStorage

const valid = function(str) {  //ф-ція маски валідацї login
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  if (!nameReg.test(str)){ //виводить попередження про введені не вірні дані
    if (str.length > 20){
      console.log('long string')
    }
  };
  return nameReg.test(str);
}

function toggleModal() {
  modal.classList.toggle("is-open");
}

function toogleModalAuth(){ //ф-ція виклику вікна авторизизації
  loginInput.style.borderColor = ''; //очищає поле логін від червоного бордера
  modalAuth.classList.toggle('is-open');
}

function returnMain() { //ф-ція при виході в ресторані з авторизації повертає на головну сторінку
  containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
}

function authorized(){
  function logOut() {  //ф-ція виходу з авторизації
    login = null;  //пусте значення, замінимо на null так,як при незаповнених логін і пароль видасть null
    localStorage.removeItem('fastDelivery'); //видалення логін з localStorage
    buttonAuth.style.display = '';  //повертає стилі CSS 
    userName.style.display = '';    //повертає стилі CSS   
    buttonOut.style.display = '';   //повертає стилі CSS  
    buttonOut.removeEventListener('click', logOut);
    checkAuth(); //перевірка авторизації
    returnMain(); //вихід на головну
  }
  console.log('авторизований');

  userName.textContent = login;  //виводить логін біля кнопки вийти

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';

  buttonOut.addEventListener('click', logOut);

}

function notAuthorized() {
  console.log(' не авторизований');

  function logIn(event) {
    event.preventDefault();  //відміна перезавантаження сторінки, при натисканні на кнопку форми 'submit'
    
    if(maskInput(loginInput.value) && valid(loginInput.value)){ //умова при якій не заповнені поля не проходять авторизацію

      login = loginInput.value;  //значення яке вводить користувач
      localStorage.setItem('fastDelivery', login) //збереження логіна в браузері по йпі(ip)
      toogleModalAuth();    //при натисканні кнопки "войти" модальне вікно закривається автоматично
      buttonAuth.removeEventListener('click', toogleModalAuth); //видалення класу ".is-open"
      closeAuth.removeEventListener('click', toogleModalAuth);  //видалення класу ".is-open"
      logInForm.removeEventListener('submit', logIn);  //видалення індифікатора "#login"
      logInForm.reset(); // очистка даних на полях форми авторизації (при повторному вході залишався логін)
     checkAuth();   //провірка авторизований чи неавторизований користувач
    }else{
      loginInput.style.borderColor = '#ff2400'; //умова при якій поля логін не заповненні, а тому підсвічується бордер червоним
      loginInput.value = ''; //очистка введених невырних даних
    }
  }

  buttonAuth.addEventListener('click', toogleModalAuth);  //при натисканні кнопки "Войти" відкривається модальне вікно тому, що додається класс '.is-open'
  closeAuth.addEventListener('click', toogleModalAuth);   // при натисканны на хрестик модальне выкно закриваэться, клас ".is-open" видаляється
  logInForm.addEventListener('submit', logIn); //при натисканні на кнопку в формі "submit" включається ф-ція logIn
}

function checkAuth() { //ф-ція провірки авторизації
  if(login) {
    authorized();
  } else {
    notAuthorized();
  }
}

function createCardRestaurant(){
  const card = `
    <a class="card card-restaurant">
      <img src="img/pizza-plus/preview.jpg" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">Пицца плюс</h3>
          <span class="card-tag tag">50 мин</span>
        </div>
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

function createCardGood() {
  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML('beforeend', `
      <img src="img/pizza-plus/pizza-oleole.jpg" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title card-title-reg">Пицца Оле-Оле</h3>
        </div>
        <div class="card-info">
          <div class="ingredients">Соус томатный, сыр «Моцарелла», черри, маслины, зелень, майонез
          </div>
        </div>
        <div class="card-buttons">
          <button class="button button-primary button-add-cart">
            <span class="button-card-text">В корзину</span>
            <span class="button-cart-svg"></span>
          </button>
          <strong class="card-price-bold">440 ₽</strong>
        </div>
      </div>
    `);

    cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {

  const target = event.target;
  const restaurant = target.closest('.card-restaurant');

  if(restaurant){
      
      if(login){
        cardsMenu.textContent = '';  //щоб не дублювалися піцци, очистка відбувається після натискання на ресторан
        containerPromo.classList.add('hide');
        restaurants.classList.add('hide');
        menu.classList.remove('hide');
        createCardGood();
      } else {
        toogleModalAuth();
      }
    }
}

function maskInput(string) { 
  return !!string.trim()      //видаляє пробіли
}



cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

cardsRestaurants.addEventListener('click', openGoods);

logo.addEventListener('click', returnMain); //при натисканні на лого повертає на головну


checkAuth();
createCardRestaurant();

const swiper = new Swiper('.swiper-container', {
  loop: true,
  autoplay: true,
});

// buttonAuth.addEventListener('click', function(){
//   console.log('Hello');
// });






















