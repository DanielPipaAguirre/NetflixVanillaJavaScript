(async function load() {
    async function getData(url) {
        const response = await fetch(url);
        const data = await response.json();
        if (data.data.movie_count > 0) {
            return data
        }
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
        try {
            const {
                data: {
                    movies: pelis
                }
            } = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`)
            const templateHTML = createTemplate(pelis[0]);
            feature.innerHTML = templateHTML;
        } catch (error) {
            page.classList.remove("active");
            alert("No se encontró la película")
        }
        form.reset();
    })
    function findByID(list, id) {
        return list.find(movie => movie.id === parseInt(id, 10))
    }
    function findMovie(id, cat) {
        switch (cat) {
            case 'drama': {
                return findByID(dramaList, id)
            }
            case 'action': {
                return findByID(actionList, id)
            }
        }
    }
    function addEventClick(element) {
        element.addEventListener('click', () => {
            overlay.classList.add("active");
            modal.style.animation = "modalIn .8s forwards"
            const id = element.dataset.id;
            const cat = element.dataset.cat;
            const data = findMovie(id, cat);
            modal.querySelector('h1').textContent = `${data.title}`;
            modal.querySelector('.modal__description img').setAttribute('src', `${data.medium_cover_image}`);
            modal.querySelector('.modal__description p').textContent = `${data.description_full}`;
        })
    }
    modalClose.addEventListener("click", () => {
        modal.style.animation = "modalOut .8s forwards"
        setTimeout(() => {
            overlay.classList.remove("active");
        }, 800);
    })
    function loadList(list, render, category) {
        render.children[0].remove();
        list.forEach(movie => {
            const div = document.createElement('div');
            div.innerHTML = `<img src="${movie.medium_cover_image}" alt="">`;
            div.setAttribute("data-id", `${movie.id}`);
            div.setAttribute("data-cat", `${category}`)
            render.appendChild(div);
            /* const images = div.querySelector('img');
            images.addEventListener("load", e => {
                e.srcElement.classList.add("fadeIn");
            }) */
            addEventClick(div);
        });
    }

    async function cacheQuery(cat) {
        const listName = `${cat}List`;
        const cacheList = localStorage.getItem(listName);
        if (cacheList) {
            return JSON.parse(cacheList);
        }
        const { data: { movies: data } } = await getData(`${BASE_API}list_movies.json?genre=${cat}`);
        localStorage.setItem(listName, JSON.stringify(data));
        return data;
    }

    const actionList = await cacheQuery('action');
    loadList(actionList, series, "action");
    const dramaList = await await cacheQuery('drama');
    loadList(dramaList, movies, "drama");
})()

