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
  modalImageAdd = document.querySelector('.modal__image-add'),
  modalImageItem = document.querySelector('.modal__image-item'),
  modalHeaderItem = document.querySelector('.modal__header-item'),
  modalStatusItem = document.querySelector('.modal__status-item'),
  modalDescriptionItem = document.querySelector('.modal__description-item'),
  modalCostItem = document.querySelector('.modal__cost-item');
  searchInput = document.querySelector('.search__input'),
  menuContainer = document.querySelector('.menu__container');

let counter = dataBase.length; // счетчик количества объявлений в бд

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

const renderCard = (DB = dataBase) => {
  // перет нашу БД, перебирает ее и формирует верстку

  // очищаем каталог для дальнейшего рендеринга и перерендеринга
  catalog.textContent = '';
  // dataBase.forEach((item, i, arr) =>{ // forEach как и все остальные методы переборов принимает функцию
  // dataBase.forEach((item) =>{
  DB.forEach((item) =>{ // поменяли на DB после добавления renderCard(result) для поиска
    catalog.insertAdjacentHTML('beforeend', `
				<li class="card" data-id-item="${item.id}">
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
  const card = target.closest('.card')
  //console.log(target.closest('.card')); // показывает что делает метод closest - получаем карточку при клике на цену, картинку или хэдер
  if (card) {
    // console.log(dataBase[card.dataset.idItem]); // получаем объект по id-item

    // const item = dataBase[card.dataset.idItem];
    // const item = dataBase.find(obj => obj.id === +card.dataset.idItem); // находим объявления из базы данных объект, делаем так чтобы при ререндеринге id карточек не менялось
    const item = dataBase.find(obj => obj.id === parseInt(card.dataset.idItem)); // находим объявления из базы данных объект, делаем так чтобы при ререндеринге id карточек не менялось
    // const item = dataBase.find(obj => {
    //   // obj.id === +card.dataset.id
    //   console.log(typeof obj.id);
    //   console.log(typeof card.dataset.idItem);
    //   });
    modalImageItem.src = `data:image//jpeg;base64,${item.image}`;
    modalHeaderItem.textContent = item.nameItem;
    modalStatusItem.textContent = item.status === 'new' ? 'Новый' : 'Б/у';
    modalDescriptionItem.textContent = item.descriptionItem;
    modalCostItem.textContent = item.costItem;
    modalItem.classList.remove('hide');
    document.body.addEventListener('keydown', closeModal); // навешиваем событие, только когда модалка открыта
  }
});

modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);

menuContainer.addEventListener('click', event => {
  const target = event.target;
  
  if (target.tagName === 'A') {
    const result = dataBase.filter(item => item.category  === target.dataset.category);
    renderCard(result);
  }

});

searchInput.addEventListener('input', () => {
  
  // console.log(searchInput.value); // выводится текст который будет вводится в поле input
  // console.log(searchInput.value.trim()); // обрезаем пробелы с обоих сторон, trimstart, trimend - убирает в начале и в конце, и есть еще два метода, всего 4 их у tream
  // console.log(searchInput.value.trim().toLowerСase()); // приводим к нижнему регистру

  const valueSearch = searchInput.value.trim().toLowerCase(); //.toLowerСase;

  if (valueSearch.length > 2) {// больше * сивмолов в строке
    console.log(valueSearch);
    const result = dataBase.filter(item => item.nameItem.toLowerCase().includes(valueSearch) || item.descriptionItem.toLowerCase().includes(valueSearch));
    console.log(result); // отобразили в консоль результаты поиска
    renderCard(result); // генерируется верстка на хоту, отображется найденное. (а не display none - display block)
  }
});

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
  itemObj.id = counter++;
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




/// поиск, для поиска нужна функция, которая получит инпут