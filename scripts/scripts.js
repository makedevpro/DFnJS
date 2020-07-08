
const modalAdd = document.querySelector('.modal__add'),
  addAd = document.querySelector('.add__ad'),
  modelBtnSubmit = document.querySelector('.modal__btn-submit'),
  modelSubmit = document.querySelector('.modal__submit'),
  catalog = document.querySelector('ul.catalog'),
  modalItem = document.querySelector('.modal__item');

addAd.addEventListener('click', () => {
  modalAdd.classList.remove('hide');
  modelBtnSubmit.disabled = true;
});

modalAdd.addEventListener('click', event => {
  const target = event.target;
  // if (target.classList.contains('modal__close') ||
  if (target.closest('.modal__close') || 
      target === modalAdd) {
    modalAdd.classList.add('hide');
    modelSubmit.reset();
  }
});

catalog.addEventListener('click', event => {
  if (event.target.closest('.card')) {
    modalItem.classList.remove('hide');
  }
});

modalItem.addEventListener('click', event => {
  const target = event.target;
  if (target.closest('.modal__close') || 
      target === modalItem) {
    modalItem.classList.add('hide');
  }
});

document.body.addEventListener('keyup', event => {
  if (event.code === 'Escape') {
    modalAdd.classList.add('hide');
    modalItem.classList.add('hide');
    modelSubmit.reset();
  }
});
