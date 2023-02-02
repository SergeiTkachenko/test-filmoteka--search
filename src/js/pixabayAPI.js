import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '33034340-c8a9f1364e27c54e88b731628';
  #query = '';
  #page = 1;
  #per_page = 40;
  #totalPhotos = 0;

  async getPhotos() {
    try {
      const response = await axios.get(`${this.#BASE_URL}?key=${
        this.#API_KEY
      }&q=${this.#query}&image_type=photo
          &orientation=horizontal&safesearch=true
          &page=${this.#page}&per_page=${this.#per_page}`);
      return response.data;
    } catch (error) {
      Notify.failure(error);
    }
  }

  //   async getPhotos() {
  //     try {
  //       const response = await fetch(
  //         `${this.#BASE_URL}?key=${this.#API_KEY}&q=${
  //           this.#query
  //         }&image_type=photo
  //           &orientation=horizontal&safesearch=true
  //           &page=${this.#page}&per_page=${this.#per_page}`
  //       );
  //       if (!response.ok) {
  //         throw new Error(response.statusText);
  //       }
  //       const data = await response.json();
  //       return data;
  //     } catch (error) {
  //       Notify.failure(error);
  //     }
  //   }

  setTotalPhotos(totalPhotos) {
    this.#totalPhotos = totalPhotos;
  }

  hasMorePhotos() {
    return this.#page < Math.ceil(this.#totalPhotos / this.#per_page);
  }

  incrementPage() {
    this.#page += 1;
  }

  resetPage() {
    this.#page = 1;
  }

  get query() {
    return this.#query;
  }
  set query(newQuery) {
    this.#query = newQuery;
  }
}
