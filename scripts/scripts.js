// порядок в файле: перменные, функции и потом обработчики событий, инициализация или вызов функци


// const dataBase = []; // массив в котором храним все наши объявления
const dataBase = JSON.parse(localStorage.getItem('awito')) || []; // получаем данных в бд из локалстораджа и через parse приводим к объекту(распаршиваем)
// если в локал сторадже нету данных, то получим null, а в null мы запушить не можем, поэтому ставим "или" и тогда DB будет пустой массив

const modalAdd = document.querySelector('.modal__add'),
  addAd = document.querySelector('.add__ad'),
  modalBtnSubmit = document.querySelector('.modal__btn-submit'),
  modalSubmit = document.querySelector('.modal__submit'),
  catalog = document.querySelector('.catalog'),
  modalItem = document.querySelector('.modal__item'),
  modalBtnWarning = document.querySelector('.modal__btn-warning'),
  modalFileInput = document.querySelector('.modal__file-input'),
  modalFileBtn = document.querySelector('.modal__file-btn'),
  modalImageAdd = document.querySelector('.modal__image-add');

const textFileBtn = modalFileBtn.textContent;
const srcModalImage = modalImageAdd.src;

const elementsModalSubmit = [...modalSubmit.elements] // получим все эелементы формы в массив
  .filter(elem => elem.tagName !== 'BUTTON');  // отфильтруем их от кнопки

const infoPhoto = {};

const saveDB = () => localStorage.setItem('awito', JSON.stringify(dataBase)); // переводим в JSON, для читаемости в localStorage, иначе будет [object, object]

// JSON.stringify - переводить объект в строку

// хранить важные и персональные данные здесь хранить нельзя
// sessionStorage - очищается при перезагрузки браузера
// localStorage - сохраняется после перезагрузки данных (до 5мб)
// coockieStorage - маленький по сравнению с session и local страджы

const checkForm = () => {
  const validForm = elementsModalSubmit.every(elem => elem.value) // валидация, тут будет значение либо тру либо фолс
  console.log(validForm);
  modalBtnSubmit.disabled = !validForm;
  // тернанрный оператор modalBtnWarning.style.display = valid ? true : false
  modalBtnWarning.style.display = validForm ? 'none' : '';
}

const closeModal = event => {
  const target = event.target;
  // console.log(this);
  console.log(target);

  if (target.closest('.modal__close') || 
      target.classList.contains('modal') ||
      event.code === 'Escape') {
        modalAdd.classList.add('hide');
        modalItem.classList.add('hide');
        document.body.removeEventListener('keydown', closeModal);
        modalSubmit.reset();
        modalImageAdd.src = srcModalImage; // перезаписываем адрес картинки на дефолтный
        modalFileBtn.textContent = textFileBtn; // меняем название кнопки на дефолтный
        checkForm();

      }
};

const renderCard = () => {
  // перет нашу БД, перебирает ее и формирует верстку

  // очищаем каталог для дальнейшего рендеринга и перерендеринга
  catalog.textContent = '';
  // dataBase.forEach((item, i, arr) =>{ // forEach как и все остальные методы переборов принимает функцию
  dataBase.forEach((item, i) =>{
    catalog.insertAdjacentHTML('beforeend', `
				<li class="card" data-id="${i}">
				  <img class="card__image" src = "data:image//jpeg;base64,${item.image}" alt="test">
				  <div class="card__description">
            <h3 class="card__header">${item.nameItem}</h3>
          <div class="card__price">${item.costItem}₽</div></div>
        </li>      
    `); // добавляем элемент в верстку, можно добавить в 4 места. до или перед открывающимся тегом, и до или после закрывающегося тега
  }); // forEach как и все остальные методы переборов принимает функцию

};

addAd.addEventListener('click', () => {
  modalAdd.classList.remove('hide');
  modalBtnSubmit.disabled = true;
  document.body.addEventListener('keydown', closeModal);
});

catalog.addEventListener('click', event => {
  const target = event.target;
  //console.log(target.closest('.card')); // показывает что делает метод closest - получаем карточку при клике на цену, картинку или хэдер
  if (target.closest('.card')) {
    modalItem.classList.remove('hide');
    document.body.addEventListener('keydown', closeModal); // навешиваем событие, только когда модалка открыта
  }
});

modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);

// change происходит после смены фокуса, если значение до и после фокуса не поменялось - то событие не произойдет
modalFileInput.addEventListener('change', event => {
  const target = event.target;

  const reader = new FileReader(); // новый конструктор FileReader
  // конструктор это функция, которая при вызове возвращает объект
  // reader - создает объект, который помогает нам работать с файлом который мы получим. сможем асинхронно прочитать содержимое файла. и считать с файла base64 формат
  // console.log(target.files); // псевдообъект, но содержит все методы объекта. создан на основе конструктора fileList, под индексом 0 получаем уже объект файла
  const file = target.files[0];
  console.log(file);

  infoPhoto.filename = file.name;
  infoPhoto.size = file.size;
  console.log(infoPhoto);

  reader.readAsBinaryString(file); // получаем base64

  reader.addEventListener('load', event => { // load сработает как только файл будет загруже
      // органичить размер и тип файла можно здесь, но лучше через html
      if (infoPhoto.size < 200000) {
        modalFileBtn.textContent = infoPhoto.filename; // меняем название кнопки в форме на название файла (!) но при закрытии формы оно не сбросится, т.к. не относится к форме
        infoPhoto.base64 = btoa(event.target.result); // btoa функция конвертирует картинку в строку
        console.log(infoPhoto);
        modalImageAdd.src = `data:image//jpeg;base64,${infoPhoto.base64}`;
      } else {
        modalFileBtn.textContent = 'размер файла не должен превышать 200кб';
        // защита от добавления большого файла, больше 200000
        modalFileInput.validForm = '';
        checkForm();
      } 
  });
});

modalSubmit.addEventListener('input', checkForm);

modalSubmit.addEventListener('submit', event => {
  event.preventDefault(); // делаем чтобы не перезагружалась страница после нажатия кнопки отравить
  const itemObj = {}; // создаем пустой объект, в него мы будем добавлять свойства из полей модалки

  // перебранные по очереди имя и значения для элементов в модалке
  // for of - переменная каждый раз новая создается поэтому создаем ее через const
  for (const elem of elementsModalSubmit) {
    itemObj[elem.name] = elem.value;
  }
  itemObj.image = infoPhoto.base64;
  dataBase.push(itemObj); // добавляем в базу
  closeModal({target:modalAdd}); //30 минута и 37 минута // передаем объект с target  в функцию close Modal
  saveDB();
  renderCard();

});

renderCard();

// делегирование, практика: кнопки лайков - при клике на лайк - сделать обновление числа рядом с лайком


//every вернет true/false, forEach ничего не возвращает, возвращает undefined


//пишем функцию которая будет создавать и выводить карточки товала на основе базы данных

// <li class = "card" data-id="${i}" i - для модального окна

// дз - при клике на карточку товара - менять в модалке данные на основе id карты товара
