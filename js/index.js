(async function load() {
    async function getData(url) {
        const response = await fetch(url);
        const data = await response.json();
        return data
    }
    const actionList = await getData('https://yts.mx/api/v2/list_movies.json?genre=action');
    const dramaList = await getData('https://yts.mx/api/v2/list_movies.json?genre=drama');
    actionList.data.movies.forEach(movie => {
        const div = document.createElement('div');
        div.innerHTML = `<img src="${movie.medium_cover_image}" alt="">`;
        series.appendChild(div);
    });

})()