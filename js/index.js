(async function load() {
    async function getData(url) {
        const response = await fetch(url);
        const data = await response.json();
        return data
    }
    const BASE_API = 'https://yts.mx/api/v2/';
    function createTemplate(film) {
        return (
            `<figure class="alert__img">
                <img src="${film.medium_cover_image}" alt=""> 
            </figure>
            <div class="alert__description">
                <h3>Pelicula encontrada</h3>
                <p>${film.title}</p>
            </div>`
        )
    }
    form.addEventListener("submit", async e => {
        e.preventDefault();
        page.classList.add("active");
        const data = new FormData(form);
        const {
            data: {
                movies: pelis
            }
        } = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`)
        const templateHTML = createTemplate(pelis[0]);
        feature.innerHTML = templateHTML;
    })
    const actionList = await getData(`${BASE_API}list_movies.json?genre=action`);
    const dramaList = await getData(`${BASE_API}list_movies.json?genre=action`);
    function loadList(list, render) {
        render.children[0].remove();
        list.data.movies.forEach(movie => {
            const div = document.createElement('div');
            div.innerHTML = `<img src="${movie.medium_cover_image}" alt="">`;
            render.appendChild(div);
        });
    }
    loadList(actionList, series);
    loadList(dramaList, movies);
})()

