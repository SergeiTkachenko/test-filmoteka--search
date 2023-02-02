import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { refs } from './js/refs';
import { PixabayAPI } from './js/pixabayAPI';
import { createGalleryCard } from './js/markup';

const options = {
  root: null,
  rootMargin: '100px',
  threshold: 1.0,
};

const callback = function (entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      pixabayAPI.incrementPage();

      pixabayAPI
        .getPhotos()
        .then(({ hits }) => {
          const markup = createGalleryCard(hits);
          refs.galleryEl.insertAdjacentHTML('beforeend', markup);
          const hasMore = pixabayAPI.hasMorePhotos();
          if (hasMore) {
            const item = document.querySelector('.photo-card:last-child');
            observer.observe(item);
          } else {
            Notify.info(
              "We're sorry, but you've reached the end of search results."
            );
          }
        })
        .catch(err => Notify.failure(err));
    }
  });
};

const observer = new IntersectionObserver(callback, options);

refs.formEl.addEventListener('submit', onSearch);

const pixabayAPI = new PixabayAPI();

function onSearch(e) {
  e.preventDefault();
  const formValue = e.currentTarget.elements.searchQuery.value.trim();
  if (!formValue) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  refs.galleryEl.innerHTML = '';

  pixabayAPI.resetPage();

  pixabayAPI.query = formValue;

  pixabayAPI
    .getPhotos()
    .then(({ hits, total, totalHits }) => {
      //   if (hits.length === 0) {
      //     return Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      //   }
      const markup = createGalleryCard(hits);
      refs.galleryEl.innerHTML = markup;
      Notify.success(`Hooray! We found ${totalHits} images.`);
      pixabayAPI.setTotalPhotos(total);
      const hasMore = pixabayAPI.hasMorePhotos();
      if (hasMore) {
        const item = document.querySelector('.photo-card:last-child');
        observer.observe(item);
      }
    })
    .catch(err => Notify.failure(err));
}
