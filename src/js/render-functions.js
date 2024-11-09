

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Функция для создания HTML-разметки для массива изображений
export function createMarkup(arr) {
    return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        `<li class="list__item">
            <a href="${largeImageURL}">
                <img src="${webformatURL}" alt="${tags}" class="list__image"/>
            </a>
            <div class="info">
                <p class="info-item"><b>Likes:</b> ${likes}</p>
                <p class="info-item"><b>Views:</b> ${views}</p>
                <p class="info-item"><b>Comments:</b> ${comments}</p>
                <p class="info-item"><b>Downloads:</b> ${downloads}</p>
            </div>
        </li>`
    ).join("");
}

// Функция для инициализации SimpleLightbox
export function initializeLightbox() {
    const lightbox = new SimpleLightbox('.list a', {
        captionDelay: 250,
        captionsData: 'alt',
    });
    lightbox.refresh();
}

// Функция для отображения ошибок с использованием iziToast
export function showError(message) {
    iziToast.error({
        title: "Error",
        message: message,
        position: 'topRight'
    });
}

// Функция для отображения информации с использованием iziToast
export function showInfo(message) {
    iziToast.info({
        title: "Info",
        message: message,
        position: 'topRight'
    });
}
