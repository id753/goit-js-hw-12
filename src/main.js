
import { fetchData } from './js/pixabay-api.js';
import { createMarkup, initializeLightbox, showError, showInfo } from './js/render-functions.js';

const PER_PAGE = 15;
let currentPage = 1;
let currentQuery = '';
let totalHits = 0;
let loadedHits = 0;

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".form");
    const container = document.querySelector(".list");
    const title = document.querySelector(".title");
    const title_second = document.querySelector(".title_second");

    const loadMoreBtn = document.querySelector(".loadMoreBtn");

    form.addEventListener("submit", handleSearch);
    loadMoreBtn.addEventListener("click", handleLoadMore);

    // Обработчик сабмита формы поиска изображений
    async function handleSearch(event) {
        event.preventDefault();

        const query = event.target.elements.search.value.trim();
        if (!query) {
            showError("Please enter a search term!");
            return;
        }

        currentQuery = query;
        currentPage = 1;
        container.innerHTML = "";
        title.textContent = "Loading images, please wait...";
        loadMoreBtn.classList.remove("visible"); // Скрыть кнопку "Load more" перед поиском
        loadedHits = 0;

        try {
            const data = await fetchData(query, currentPage);
            totalHits = data.totalHits;
            loadedHits += data.hits.length;

            if (data.hits.length === 0) {
                showError("No images found. Try another search term.");
            } else {
                container.innerHTML = createMarkup(data.hits);
                initializeLightbox();
                if (loadedHits < totalHits) {
                    loadMoreBtn.classList.add("visible"); // Показываем кнопку "Load more", если есть больше изображений
                }
            }
        } catch (error) {
            showError("Failed to fetch images. Please try again later!");
        } finally {
            title.textContent = "";
            event.target.reset();
        }
    }

    // Обработчик кнопки "Load more" для подгрузки следующей страницы изображений
    async function handleLoadMore() {
        currentPage += 1;
        title_second.textContent = "Loading images, please wait...";

        try {
            const data = await fetchData(currentQuery, currentPage);
            loadedHits += data.hits.length;

            if (data.hits.length === 0 || loadedHits >= totalHits) {
                showInfo("We're sorry, but you've reached the end of search results.");
                loadMoreBtn.classList.remove("visible"); // Скрываем кнопку, если больше нет изображений
            } else {
                container.insertAdjacentHTML('beforeend', createMarkup(data.hits));
                initializeLightbox();


                // Прокрутка страницы после загрузки новых изображений
                const firstCard = document.querySelector(".list__item"); // Находим первую карточку
                const cardHeight = firstCard.getBoundingClientRect().height; // Получаем высоту карточки

                // Прокручиваем страницу на две высоты карточки
                window.scrollBy({
                    top: cardHeight * 2,
                    behavior: "smooth"
                });
            title_second.textContent = "";

            }
        } catch (error) {
            showError("Failed to fetch images. Please try again later!");
        }
    }
});
