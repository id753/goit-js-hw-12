import { fetchData } from './js/pixabay-api';
import { createMarkup, initializeLightbox } from './js/render-functions';
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

let currentPage = 1;
let currentQuery = '';
let totalHits = 0;
let loadedHits = 0;

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".form");
    const container = document.querySelector(".list");
    const title = document.querySelector("h1");
    const loadMoreBtn = document.querySelector(".loadMoreBtn");

    form.addEventListener("submit", handleSearch);
    loadMoreBtn.addEventListener("click", handleLoadMore);

    async function handleSearch(event) {
        event.preventDefault();

        const query = event.target.elements.search.value.trim();
        if (!query) {
            iziToast.error({ title: "Error", message: "Please enter a search term!", position: 'topRight' });
            return;
        }

        currentQuery = query;
        currentPage = 1;
        container.innerHTML = "";
        title.textContent = "Loading images, please wait...";
        loadMoreBtn.classList.remove("visible");
        loadedHits = 0;

        try {
            const data = await fetchData(query, currentPage);
            totalHits = data.totalHits;
            loadedHits = data.hits.length;

            if (loadedHits === 0) {
                iziToast.error({ title: "Error", message: "No images found. Try another search term.", position: 'topRight' });
            } else {
                container.innerHTML = createMarkup(data.hits);
                initializeLightbox();

                if (loadedHits < totalHits) {
                    loadMoreBtn.classList.add("visible");
                }
            }
        } catch (error) {
            iziToast.error({ title: "Error", message: "Failed to fetch images. Please try again later!", position: 'topRight' });
        } finally {
            title.textContent = "";
            event.target.reset();
        }
    }

    async function handleLoadMore() {
        currentPage += 1;
        title.textContent = "Loading images, please wait...";

        try {
            const data = await fetchData(currentQuery, currentPage);
            loadedHits += data.hits.length;

            if (loadedHits >= totalHits) {
                iziToast.info({ title: "Info", message: "We're sorry, but you've reached the end of search results.", position: 'topRight' });
                loadMoreBtn.classList.remove("visible");
            } else {
                container.insertAdjacentHTML('beforeend', createMarkup(data.hits));
                initializeLightbox();

                const firstCard = document.querySelector(".list__item");
                const cardHeight = firstCard.getBoundingClientRect().height;

                window.scrollBy({
                    top: cardHeight * 2,
                    behavior: "smooth"
                });
            }
        } catch (error) {
            iziToast.error({ title: "Error", message: "Failed to fetch images. Please try again later!", position: 'topRight' });
        } finally {
            title.textContent = "";
        }
    }
});
