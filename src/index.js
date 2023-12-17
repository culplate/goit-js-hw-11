import Notiflix from "notiflix";
import {fetchData} from "./pixabay-api"

// TODO (later):
// 1. Notify with total results found
// 2. SimpleLightBox
// 3. infiniteScroll
// 4. make hide/show elems functions
// TODO (latest):
// 1. Remake cards (better hover)
// 2. fav feature

let page = 1;
const refs = {
    searchBtn: document.querySelector('.search-form button'),
    searchForm: document.querySelector('.search-form'),
    searchInput: document.querySelector('.search-form input'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')
}

refs.searchBtn.addEventListener('click', handleSubmit);
refs.loadMoreBtn.addEventListener('click', loadMore);

function handleSubmit(event) {
    event.preventDefault();
    page = 1;
    const formData = new FormData(refs.searchForm);
    const { searchQuery } = Object.fromEntries(formData.entries());

    if (searchQuery === null || searchQuery.match(/^ *$/) !== null) {
        Notiflix.Notify.warning(`Your request should not be empty`)
        return;
    }

    refs.gallery.innerHTML = '';
    renderData(searchQuery);
}

function loadMore() {
    page++;
    const formData = new FormData(refs.searchForm);
    const { searchQuery } = Object.fromEntries(formData.entries());
    renderData(searchQuery, page)
}

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
        refs.loadMoreBtn.classList.add('is-hidden');
        const data = await fetchData(query, page);
        if (data.totalHits === 0) { // handling no results
            Notiflix.Notify.failure('No results matching your search :(')
            return;
        } else if (data.hits.length < 40) { // handling the end of results
            refs.loadMoreBtn.classList.add('is-hidden');
            Notiflix.Notify.info(`You've reached the end of search results!`)
            refs.gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
            return;
        } else {
            refs.gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
            refs.loadMoreBtn.classList.remove('is-hidden');
        }
    } catch (error) {
        console.log(error);
        Notiflix.Notify.failure(error)
    }
}