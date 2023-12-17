import axios from "axios";
const API_KEY = '41284916-bd469a2634b9bca975146e6bc';
const BASE_URL = 'https://pixabay.com/api'

export async function fetchData(query, page = 1) {
    try {
        const response = await axios(BASE_URL, {
            params: {
                key: API_KEY,
                q: query,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                per_page: 40,
                page: page
            }
        })
        return response.data;
    } catch (error) {
        Notiflix.Notify.failure(error.response.data)
    }
}