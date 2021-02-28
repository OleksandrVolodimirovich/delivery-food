const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

//start

const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');

let login = localStorage.getItem('fastDelivery'); //замімть пустого значення змінній login присвоюэмо значення з localStorage

//console.log(buttonAuth);

function toogleModalAuth(){
  loginInput.style.borderColor = ''; //очищає поле логін від червоного бордера
  modalAuth.classList.toggle('is-open');
}

buttonAuth.addEventListener('click', function(){
  console.log('Hello');
});

buttonAuth.addEventListener('click', toogleModalAuth);
closeAuth.addEventListener('click', toogleModalAuth)

function authorized(){
  function logOut() {  //ф-ція виходу з авторизації
    login = null;  //пусте значення, замінимо на null так,як при незаповнених логін і пароль видасть null
    localStorage.removeItem('fastDelivery'); //видалення логін з localStorage
    buttonAuth.style.display = '';  //повертає стилі CSS 
    userName.style.display = '';    //повертає стилі CSS   
    buttonOut.style.display = '';   //повертає стилі CSS  
    buttonOut.removeEventListener('click', logOut);

    checkAuth(); //перевірка авторизації
  }
  console.log('авторизований');

  userName.textContent = login;  //виводить логін біля кнопки вийти

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';

  buttonOut.addEventListener('click', logOut);

}

function maskInput(string) { 
  return !!string.trim()      //видаляє пробіли
}

function notAuthorized() {
  console.log(' не авторизований');

  function logIn(event) {
    event.preventDefault();  //відміна перезавантаження сторінки, при натисканні на кнопку форми 'submit'
    
    if(maskInput(loginInput.value)){ //умова при якій не заповнені поля не проходять авторизацію

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
checkAuth();


