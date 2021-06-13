import galleryCardTpl from '../templates/galleryCardTpl.hbs';
import ImageApiService from '../js/apiService';
import LoadMoreBtn from '../js/components/load-more-btn';

const refs = {
  searchForm: document.querySelector('.js-search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('[data-action="load-more"]'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

const imageApiService = new ImageApiService();

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

function onSearch(event) {
  event.preventDefault();

  imageApiService.query = event.currentTarget.elements.query.value;

  if (!imageApiService.query.trim()) {
    return;
  }
  loadMoreBtn.show();
  imageApiService.resetPage();
  clearCardContainer();
  fetchImages();
}

async function onLoadMore() {
  const scroll = document.documentElement.scrollHeight;
  await fetchImages();
  onScroll(scroll);
}

async function fetchImages() {
  loadMoreBtn.disable();
  await imageApiService.fetchImages().then(data => {
    appendCardMarkup(data);
    if (data.length >= 12) {
      return;
    }
    loadMoreBtn.hide();
  });
  loadMoreBtn.enable();
}

function appendCardMarkup(data) {
  refs.gallery.insertAdjacentHTML('beforeend', galleryCardTpl(data));
}

function onScroll() {
  refs.loadMoreBtn.scrollIntoView({behavior: 'smooth', block: 'end',});
}

function clearCardContainer() {
  refs.gallery.innerHTML = '';
}