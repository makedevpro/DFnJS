
const dataBase = []; // массив в котором храним все наши объявления

const modalAdd = document.querySelector('.modal__add'),
  addAd = document.querySelector('.add__ad'),
  modalBtnSubmit = document.querySelector('.modal__btn-submit'),
  modalSubmit = document.querySelector('.modal__submit'),
  catalog = document.querySelector('.catalog'),
  modalItem = document.querySelector('.modal__item'),
  modalBtnWarning = document.querySelector('.modal__btn-warning');

const elementsModalSubmit = [...modalSubmit.elements] // получим все эелементы формы в массив
.filter(elem => elem.tagName !== 'BUTTON');  // отфильтруем их от кнопки
    
const closeModalEsc = event => {
  // console.log(event);
  if (event.code === 'Escape') {
    modalAdd.classList.add('hide');
    modalItem.classList.add('hide');
    modalSubmit.reset();
    document.body.removeEventListener('keydown', closeModalEsc);
  }
  };

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

const closeModal = function (event) {
  const target = event.target;
  const code = event.code;
  // console.log(this);
  console.log(target);

  if (target.closest('.modal__close') ||
    target === this) {
    this.classList.add('hide');
    if (this === modalAdd) {
      modalSubmit.reset();
    }
    document.body.removeEventListener('keydown', closeModal);
  }
  
};

addAd.addEventListener('click', () => {
  modalAdd.classList.remove('hide');
  modalBtnSubmit.disabled = true;
  document.body.addEventListener('keydown', closeModalEsc);
});

catalog.addEventListener('click', event => {
  const target = event.target;
  //console.log(target.closest('.card')); // показывает что делает метод closest - получаем карточку при клике на цену, картинку или хэдер
  if (target.closest('.card')) {
    modalItem.classList.remove('hide');
    document.body.addEventListener('keydown', closeModalEsc); // навешиваем событие, только когда модалка открыта
  }
});

modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);

modalSubmit.addEventListener('input', () => {
  const validForm = elementsModalSubmit.every(elem => elem.value) // валидация, тут будет значение либо тру либо фолс
  console.log(validForm);
  modalBtnSubmit.disabled = !validForm;
  // тернанрный оператор modalBtnWarning.style.display = valid ? true : false
  modalBtnWarning.style.display = validForm ? 'none' : '';
});

modalSubmit.addEventListener('submit', event => {
  event.preventDefault(); // делаем чтобы не перезагружалась страница после нажатия кнопки отравить
  const itemObj = {}; // создаем пустой объект, в него мы будем добавлять свойства из полей модалки

  // перебранные по очереди имя и значения для элементов в модалке
  // for of - переменная каждый раз новая создается поэтому создаем ее через const
  for (const elem of elementsModalSubmit) {
    itemObj[elem.name] = elem.value;
  }
  console.log(itemObj);
  dataBase.push(itemObj); // добавляем в базу
  modalSubmit.reset(); // очищаем форму
  console.log(dataBase);
  modalAdd.classList.add('hide');
  
});


// дз сделать чтобы модалка закрывалась через крестик, через эск и клик вне модалки + очистка формы
// закрываем модалку после кнопки отправить

// любая функция принимает еще аргумент - как подсказка к дз.
