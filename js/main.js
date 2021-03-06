'use strict';

const cartButton = document.querySelector('#cart-button');
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
const restaurantTitle = document.querySelector('.restaurant-title');
const rating = document.querySelector('.rating');
const minPrice = document.querySelector('.price');
const category = document.querySelector('.category');
const inputSearch = document.querySelector('.input-search');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('.clear-cart');

let login = localStorage.getItem('fastDelivery'); //замімть пустого значення змінній login присвоюэмо значення з localStorage
const cart = [];

const getData = async function(url) {

  const response = await fetch(url);
  if(!response.ok){
    throw new Error(`Помилка по адресу ${url}, статус помилки ${response.status}!`);
  }

  return await response.json();
};
console.log(getData('./db/partners.json'));

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

function toggleModalAuth(){ //ф-ція виклику вікна авторизизації
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
    cartButton.style.display = '';  //приховує кнопку корзини при logOut
    buttonOut.removeEventListener('click', logOut);
    checkAuth(); //перевірка авторизації
    returnMain(); //вихід на головну
  }
  console.log('авторизований');
  userName.textContent = login;  //виводить логін біля кнопки вийти
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';
  buttonOut.addEventListener('click', logOut);
  console.log('bom');
}

function notAuthorized() {
  console.log(' не авторизований');

  function logIn(event) {
    event.preventDefault();  //відміна перезавантаження сторінки, при натисканні на кнопку форми 'submit'
    
    if(maskInput(loginInput.value) && valid(loginInput.value)){ //умова при якій не заповнені поля не проходять авторизацію

      login = loginInput.value;  //значення яке вводить користувач
      localStorage.setItem('fastDelivery', login) //збереження логіна в браузері по йпі(ip)
      toggleModalAuth();    //при натисканні кнопки "войти" модальне вікно закривається автоматично
      buttonAuth.removeEventListener('click', toggleModalAuth); //видалення класу ".is-open"
      closeAuth.removeEventListener('click', toggleModalAuth);  //видалення класу ".is-open"
      logInForm.removeEventListener('submit', logIn);  //видалення індифікатора "#login"
      logInForm.reset(); // очистка даних на полях форми авторизації (при повторному вході залишався логін)
     checkAuth();   //провірка авторизований чи неавторизований користувач
    }else{
      loginInput.style.borderColor = '#ff2400'; //умова при якій поля логін не заповненні, а тому підсвічується бордер червоним
      loginInput.value = ''; //очистка введених невырних даних
    }
  }

  buttonAuth.addEventListener('click', toggleModalAuth);  //при натисканні кнопки "Войти" відкривається модальне вікно тому, що додається класс '.is-open'
  closeAuth.addEventListener('click', toggleModalAuth);   // при натисканны на хрестик модальне выкно закриваэться, клас ".is-open" видаляється
  logInForm.addEventListener('submit', logIn); //при натисканні на кнопку в формі "submit" включається ф-ція logIn
}

function checkAuth() { //ф-ція провірки авторизації
  if(login) {
    authorized();
  } else {
    notAuthorized();
  }
}

function createCardRestaurant({ image, kitchen, name, price, stars, products, 
      time_of_delivery : timeOfDelivery //перейменування задопомогою ":"
  }) {
    
  const card = `
    <a class="card card-restaurant" 
    data-products="${products}"
    data-info = "${[name, price, stars, kitchen]}"
    >
      <img src="${image}" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">${name}</h3>
          <span class="card-tag tag">${timeOfDelivery}</span>
        </div>
        <div class="card-info">
          <div class="rating">
            ${stars}
          </div>
          <div class="price">От ${price} ₽</div>
          <div class="category">${kitchen}</div>
        </div>
      </div>
    </a>
  `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card);

}

function createCardGood({ description, id, image, name, price }) {

  const card = document.createElement('div');
  card.className = 'card';
  // card.id = id; // добавлення id 1-варіан, отримати по карточці
  card.insertAdjacentHTML('beforeend', `
      <img src="${image}" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title card-title-reg">${name}</h3>
        </div>
        <div class="card-info">
          <div class="ingredients">${description}</div>
        </div>
        <div class="card-buttons">
            <button class="button button-primary button-add-cart" id="${id}"> <!-- добавлення id 2-варіант, отримати по кнопці -->
            <span class="button-card-text">В корзину</span>
            <span class="button-cart-svg"></span>
          </button>
          <strong class="card-price card-price-bold">${price} ₽</strong>
        </div>
      </div>
    `);

    cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) { //відкриває меню ресторану
  const target = event.target;  
  if(login){

    const restaurant = target.closest('.card-restaurant');
    if(restaurant){  

      const info = restaurant.dataset.info.split(',');
      const [name, price, stars, kitchen] = info;

        cardsMenu.textContent = '';  //очистка відбувається після натискання на ресторан
        containerPromo.classList.add('hide'); //приховує контейнер промо
        restaurants.classList.add('hide'); //приховує ресторани
        menu.classList.remove('hide');  //показує меню 
        
        restaurantTitle.textContent = name;
        rating.textContent = stars;
        minPrice.textContent = `От ${price} ₽`; //'От' + price + '₽';
        category.textContent = kitchen;

        getData(`./db/${restaurant.dataset.products}`).then(function(data){
          data.forEach(createCardGood)
        });
    } 
  }else {
    toggleModalAuth();
  }
}

function maskInput(string) { 
  return !!string.trim()      //видаляє пробіли
}

function addToCart(event){ //ф-ція працює при натисканні на корзину
  const target = event.target;
  const buttonAddToCart = target.closest('.button-add-cart');

  if(buttonAddToCart){
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent; // textContent - для отримання даних у вигляді тексту
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;

    const food = cart.find(function(item){ //провіряє чи є в нашому масиві (умова записана в callback ф-ції)
      return item.id === id; // повертаємо якщо в item id , ми будемо порівнювати id з тим який в даний момент ми добавляємо 
    })

    if(food){ //якщо food вже присутній, тоді
      //food.count = food.count + 1; <-- такий запис небажаний
      food.count += 1; //count збільшується на одиницю
    } else {  //якщо такої їди(id) немає добавимо її з нуля
      cart.push({
        //id: id,
        id, //ES6
        //title: title,
        title, //ES6
        //cost: cost,
        cost, //ES6
        count: 1  //к-сть товарів добавляється по 1 шт.
      });
    }
  }console.log(cart);
}

function renderCart(){ //опис ф-ції формування карточки корзини
  modalBody.textContent = ''; //очистка корзини

  cart.forEach(function({ id, title, cost, count }){ //перебирає товари в корзині
    const itemCart = ` <!-- формування HTML-коду корзини -->
        <div class="food-row">
					<span class="food-name">${title}</span>
					<strong class="food-price">${cost}</strong>
					<div class="food-counter">
						<button class="counter-button counter-minus" data-id=${id}>-</button>
						<span class="counter">${count}</span>
						<button class="counter-button counter-plus" data-id=${id}>+</button>
					</div>
				</div>
      `;
      modalBody.insertAdjacentHTML('afterbegin', itemCart)  //добавляємо HTML-код в кінець
  });
  const totalPrice = cart.reduce(function(result, item){ //формування ціни
    return result + (parseFloat(item.cost) * item.count); //повертає 0 + добавляє ціну і т.д. Для того щоб небуло конкатинації використовується parseFloat. Для сумування одинакових блюд * на к-сть(item.count)
  }, 0); //при першому добавленні result буде братися з item, а це буде обєкт(це не протрібно).Потрібна сума, тому другим значенням ставимо 0
  modalPrice.textContent = totalPrice + ' ₽'; //виводить результат в модальне вікно
}

function changeCount(event){ //ф-ція в корзині + -
    const target = event.target;
  
    // 1 варіант умови
    if (target.classList.contains('counter-button')){
      const food = cart.find(function(item){
        return item.id === target.dataset.id;
      });
      if(target.classList.contains('counter-minus')) {
        food.count--;
        if (food.count===0){
          cart.splice(cart.indexOf(food), 1);
        }
      };
      if(target.classList.contains('counter-plus')) food.count++;
      renderCart();
    }

    // 2 варіант умови
    /*
    if(target.classList.contains('counter-minus')){ //якщо при натисканні на мінус провіряє чи є клас counter-minus
        const food = cart.find(function(item){  //всередині корзини шукаємо
          return item.id === target.dataset.id; //елемент в якого item.id буде співпадати data-атрибутом id
        });
        food.count--; //відніміє на 1
        renderCart(); // перезапускає renderCart
    }
    if(target.classList.contains('counter-plus')){
        const food = cart.find(function(item){
          return item.id === target.dataset.id;
        });
      food.count++;
      renderCart();
    }*/
}

function init(){
  getData('./db/partners.json').then(function(data){
    data.forEach(createCardRestaurant);
  });
  
  cartButton.addEventListener("click", function(){ //при кліку на корзину виконується ф-ція
    renderCart(); //формування карточки
    toggleModal(); //викликає модальне вікно
  });
  buttonClearCart.addEventListener('click', function(){
    cart.length = 0;
    toggleModal();
  })
  modalBody.addEventListener('click', changeCount); //при кліку в корзині на + або -

  close.addEventListener("click", toggleModal);
  cardsMenu.addEventListener('click', addToCart); //обробник події, по кліку на корзину запускає ф-цію addToCart
  cardsRestaurants.addEventListener('click', openGoods);
  
  logo.addEventListener('click', returnMain); //при натисканні на лого повертає на головну
  
  inputSearch.addEventListener('keydown', function(event){
    if(event.keyCode === 13){
      const target = event.target; //target - спрацьовує при натисканні на enter
      const value = target.value.toLowerCase().trim(); //значення яке вводиться в input, передається з маленької букви. Заборона пробілів
      target.value = ''; //очищення поля вводу пошуку
      if(!value || value.length <3){ //умова: якщо введено пусте значення або текст менше 3 символів, тоді...
        target.style.backgroundColor = 'tomato'; // фон при невірному вводі даних
        setTimeout(function(){ //ф-ція, яка при невірних даних через 2сек робить поле вводу пустим(типу очистка) 
            target.style.backgroundColor = '';
        }, 2000);
        return; //для того щоб дольше код не виконувався
      }
            
      const goods = []; //відфільтровані товари
      getData('./db/partners.json')
        .then(function(data){ //callback ф-ція
            const products = data.map(function(item){ //перебирає масив методом map
                return item.products; //повертає з масиву products
            });
            products.forEach(function(product){ //перебирає масив методом forEach
              getData(`./db/${product}`) //відправка запиту product (по черзі 6 продуктів)
                .then(function(data){  //отримуємо дані data  у вигляді масиву
                    goods.push(...data) //спред оператор (...), отримаємо всі елементи в один масив
                    const searchGoods = goods.filter(function(item){
                      return item.name.toLowerCase().includes(value); //повертає те, що введено в input з маленької букви (можна добавити умову через або(||) для description і т.п.)
                    })
                        console.log(searchGoods);

                    cardsMenu.textContent = '';  //очистка відбувається після натискання на ресторан
                    containerPromo.classList.add('hide'); //приховує контейнер промо
                    restaurants.classList.add('hide'); //приховує ресторани
                    menu.classList.remove('hide');  //показує меню 
                    
                    restaurantTitle.textContent = 'Результат пошуку';
                    rating.textContent = '';
                    minPrice.textContent = '';
                    category.textContent = '';

                    return searchGoods; //повертаємо дані в data

                  })
                  .then(function(data){ //отримуємо дані з searchGoods
                    data.forEach(createCardGood); // перебираємо отримані дані в data
                  })
            })
      });
    }
  });
  
  checkAuth();
};

init();

const swiper = new Swiper('.swiper-container', {
  loop: true,
  autoplay: true,
});


/*//---альтернативний варіант добавлення [name, price, stars, kitchen] без data-атрибутів ----


function createCardRestaurant({ image, kitchen, name, price, stars, products, 
  time_of_delivery : timeOfDelivery //перейменування задопомогою ":"
}) {

const card = document.createElement('a');
card.className = 'card card-restaurant';
card.products = products;
card.info = [name, price, stars, kitchen];

card.insertAdjacentHTML('beforeend', `

  <img src="${image}" alt="image" class="card-image"/>
  <div class="card-text">
    <div class="card-heading">
      <h3 class="card-title">${name}</h3>
      <span class="card-tag tag">${timeOfDelivery}</span>
    </div>
    <div class="card-info">
      <div class="rating">
        ${stars}
      </div>
      <div class="price">От ${price} ₽</div>
      <div class="category">${kitchen}</div>
    </div>
  </div>
</a>
`);
cardsRestaurants.insertAdjacentElement('beforeend', card);
}

function openGoods(event) { //відкриває меню ресторану
  const target = event.target;  
  const restaurant = target.closest('.card-restaurant');

  if(restaurant){
    
    if(login){
        const [name, price, stars, kitchen] = restaurant.info;

        cardsMenu.textContent = '';  //очистка відбувається після натискання на ресторан
        containerPromo.classList.add('hide'); //приховує контейнер промо
        restaurants.classList.add('hide'); //приховує ресторани
        menu.classList.remove('hide');  //показує меню 
        
        restaurantTitle.textContent = name;
        rating.textContent = stars;
        minPrice.textContent = `От ${price} ₽`; //'От' + price + '₽';
        category.textContent = kitchen;

        getData(`./db/${restaurant.products}`).then(function(data){
          data.forEach(createCardGood)
        });
      } else {
        toggleModalAuth();
      }
  }
}
*/
//----------------------------------------------------------------










