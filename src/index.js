import axios from "axios";
import Notiflix from "notiflix";
const API_KEY = '41284916-bd469a2634b9bca975146e6bc';
const BASE_URL = 'https://pixabay.com/api'

const refs = {
    searchBtn: document.querySelector('.search-form button'),
    searchForm: document.querySelector('.search-form'),
    searchInput: document.querySelector('.search-form input'),
    gallery: document.querySelector('.gallery')
}

refs.searchBtn.addEventListener('click', (event) => {
    event.preventDefault();
    
    const formData = new FormData(refs.searchForm);
    const { searchQuery } = Object.fromEntries(formData.entries());

    if (searchQuery.length === 0) {
        Notiflix.Notify.warning(`Your request should not be empty`)
        return;
    }

    refs.gallery.innerHTML = '';
    renderData(searchQuery);
})

function createMarkup(arr) {
    return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `
            <div class="photo-card">
                <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                <div class="info">
                    <div class="info-item">
                        <p>
                            <b>Likes:</b>
                        </p>
                        <p>
                            ${likes}
                        </p>
                    </div>
                    <div class="info-item">
                        <p>
                            <b>Views:</b>
                        </p>
                        <p>
                            ${views}
                        </p>
                    </div>
                    <div class="info-item">
                        <p>
                            <b>Comments:</b>
                        </p>
                        <p>
                            ${comments}
                        </p>
                    </div>
                    <div class="info-item">
                        <p>
                            <b>Downloads:</b>
                        </p>
                        <p>
                            ${downloads}
                        </p>
                    </div>
                </div>
            </div>
        `
    }
    ).join('')
}

async function renderData(query, page) {
    try {
        const data = await fetchData(query, page);

        if (data.length === 0) {
            Notiflix.Notify.failure('No results matching your search :(')
            return;
        }
        refs.gallery.insertAdjacentHTML('beforeend', createMarkup(data))
    } catch (error) {
        console.log(error);
    }
}

async function fetchData(query, page = 1) {
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
        return response.data.hits;
    } catch (error) {
        Notiflix.Notify.failure(error.response.data)
    }
}