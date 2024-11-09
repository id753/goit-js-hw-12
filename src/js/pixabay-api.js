// pixabay-api.js

import axios from 'axios';

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "46827902-d0f0ee0995e79e4196197bc56";
const PER_PAGE = 15;

export async function fetchData(query, page) {
    const params = {
        key: API_KEY,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        q: query,
        page: page,
        per_page: PER_PAGE
    };

    try {
        const response = await axios.get(BASE_URL, { params });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch images");
    }
}
