
const dataBase = []; // массив в котором храним все наши объявления

const modalAdd = document.querySelector('.modal__add'),
  addAd = document.querySelector('.add__ad'),
  modalBtnSubmit = document.querySelector('.modal__btn-submit'),
  modalSubmit = document.querySelector('.modal__submit'),
  catalog = document.querySelector('.catalog'),
  modalItem = document.querySelector('.modal__item'),
  modalBtnWarning = document.querySelector('.modal__btn-warning');

const elementsModalSubmit = [...modalSubmit.elements] // получим все эелементы формы в массив
.filter(elem => elem.tagName !== 'BUTTON');  // отфильтруем ее от кнопки
    
// console.log(elementsModalSubmit); // получаем htmlколлекцию - получаем сразу все элементы(это хорош), а 
//плохо тем тчо нет методов которые есть в массиве, поэтому надо сделать из html коллекции массив, есть новый оператор spred
  // console.log(...elementsModalSubmit); // spred оператор, получили все элементы формы. элементов несколько но это еще не массив
  // console.log([...elementsModalSubmit]); // уже массив, со всеми методами доступными массивам
  // нам нужны все элементы кроме кнопки
  // внутри функции фильтр - коллбек функция, которая принимает три элемента, 
  // элемент, индексы, сам массив (1,2,3)
  // console.log([...elementsModalSubmit].filter((elem) =>{
  //   return elem.tagName !== 'BUTTON' && elem.type !== 'submit' // sumbit если в верстке используем input ы type='submit' или button

  // }));
  // делаем крассиваее
  // console.log([...elementsModalSubmit].filter(elem => elem.tagName !== 'BUTTON'));  // sumbit если в верстке используем //input ы type='submit' или button

const closeModalEsc = event => {
  // console.log(event);
  
  if (event.code === 'Escape') {
    modalAdd.classList.add('hide');
    modalItem.classList.add('hide');
    modalSubmit.reset();
    document.body.removeEventListener('keydown', closeModalEsc);
    // почемуто не срабатывает удаления события после закрытия модалки
  }
  };

  // input - события отрабатывают по любому изменению
  // change - см. 1:20:00

  // some - возвращает если хотя бы одно условия удовлетворяет
  // every - вертнет тру если все удовлетворят условиям
modalSubmit.addEventListener('input', () => {
  const validForm = elementsModalSubmit.every(elem => elem.value) // валидация, тут будет значение либо тру либо фолс
  // будем перебирать через every, если одна переменная возвращает фолс хотябы одна - тогда вернется фолс, если тру все, тогда вернет тру
  // так же если значение будет пусто - вернет фолс, если заполнено - тру
  console.log(validForm);
  modalBtnSubmit.disabled = !validForm;
  // тернанрный оператор modalBtnWarning.style.display = valid ? true : false
  modalBtnWarning.style.display = validForm ? 'none' : '';
  /*
  если бы записывали в ифах
  
  if (validForm) {
    modalBtnWarning.style.display = 'none'
  } else {
    modalBtnWarning.style.display = ''
  }
   или так, но так не красиво
  if (validForm) modalBtnWarning.style.display = 'none'
  else modalBtnWarning.style.display = ''
  
  */
  
});

// делаем чтобы не перезагружалась страница после нажатия кнопки отравить
modalSubmit.addEventListener('submit', event => {
  event.preventDefault();
  // alert(event.defaultPrevented); // выводит состояния true или false  у preventDefault
  const itemObj = {}; // пустой объект, в него мы будем добавлять свойства (в верстке это значения атрибута name ( в модалке, мы же оттуда их будем забирвать при добавлении объявы через модалку))
  // forOf - похож на цикл for, в обычном цикле for переменная одна и та же, но меняет значение
  // в forOf - переменная каждый раз новая создается поэтому создаем ее через const
  for (const elem of elementsModalSubmit) {
    // выведет перебранные по очереди имя и значения для элементов в модалке
    // console.log(elem.name);
    // console.log(elem.value);
    // добавить свойство
    // itemObj['sdf'] = 33;
    itemObj[elem.name] = elem.value;
  }
  console.log(itemObj);
  // добавляем в базу
  dataBase.push(itemObj);
  // очищаем форму
  modalSubmit.reset();
  // показываем что в базе
  console.log(dataBase); // но после перезагрузки странице все исчезнет, поэтому будем сохранять в locaStorage

});

addAd.addEventListener('click', () => {
  modalAdd.classList.remove('hide');
  modalBtnSubmit.disabled = true;
  document.body.addEventListener('keydown', closeModalEsc);
});

// const closeModal = event => {
//   const target = event.target;
//   console.log(event);
  
//   if (target.closest('.modal__close') ||
//   target === modalAdd || target === modalItem) {
//     modalAdd.classList.add('hide');
//     modalSubmit.reset();
//     modalItem.classList.add('hide');
//   }
// };

// this - тот элемент который отслеживался, тогда функцию из стрелочной делаем обычную
// this - объект(объектом ялвяется наш элемент, модалка) который вызвал событие
// this - это контект вызова

const closeModal = function(event) {
  const target = event.target;
  // console.log(this);

  if (target.closest('.modal__close') ||
    target === this ) {
    this.classList.add('hide');
    if (this === modalAdd) {
        modalSubmit.reset();
      }
    
  }
};

modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);
catalog.addEventListener('click', event => {
  const target = event.target;
  //console.log(target.closest('.card')); // показывает что делает метод closest - получаем карточку при клике на цену, картинку или хэдер
  if (target.closest('.card')) {
    modalItem.classList.remove('hide');
    document.body.addEventListener('keydown', closeModalEsc);
  }
});


// catalog.addEventListener('click', event => {
//   if (event.target.closest('.card')) {
//     modalItem.classList.remove('hide');
//   }
// });

// modalItem.addEventListener('click', event => {
//   const target = event.target;
//   if (target.closest('.modal__close') || 
//       target === modalItem) {
//     modalItem.classList.add('hide');
//   }
// });


// эти события будут висеть когда даже модалка закрыта, поэтому см. выше
// document.body.addEventListener('keyup', event => {
//   if (event.code === 'Escape') {
//     modalAdd.classList.add('hide');
//     modalItem.classList.add('hide');
//     modalSubmit.reset();
//   }
// });

// document.body.addEventListener('keyup', event => {
//   if (event.code === 'Escape') {
//     modalAdd.classList.add('hide');
//     modalItem.classList.add('hide');
//     modalSubmit.reset();
//   }
// });


////////////////// FORM

// будем проверять все ли поля заполнены, убирать надпись "заполните все поля"
// и разблокируем кнопку "отправить"


// дз сделать чтобы модалка закрывалась через крестик, через эск и клик вне модалки + очистка формы
// закрываем модалку после кнопки отправить

// любая функция принимает еще аргумент - как подсказка к дз.

//index.html#modal-234
// js проверяет после хэша что написано, modal-234 и открывает это
// windows.location.hash - выдает #modal-234 и js прослушивает это событие
// если #modal-234 совпадает с тем что надо - то он открыват модалку
// получается чел перешеднейш по ссылке index.html#modal-234 
// а через index.html?modal-234 будет windows.location.search
// все свойства можно получить через windows.location
// index.html?sdfsdf#modal-234 выдаст и сеарч и хэш