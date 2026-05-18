import { ElementBuilder, ParentChildBuilder } from './builders.js';

class ParagraphBuilder extends ParentChildBuilder {
  constructor() {
    super('p', 'span');
  }
}

class ListBuilder extends ParentChildBuilder {
  constructor() {
    super('ul', 'li');
  }
}

function formatRuntime(runtime) {
  const hours = Math.floor(runtime / 60)
  const minutes = runtime % 60
  return hours + 'h ' + minutes + 'm'
}

function appendMovie(movie, element) {
  const article = document.createElement('article')
  article.id = movie.imdbID

  const img = document.createElement('img')
  img.src = movie.Poster
  img.alt = movie.Title + ' Poster'
  article.append(img)

  const title = document.createElement('h1')
  title.textContent = movie.Title
  article.append(title)

  const editButton = document.createElement('button')
  editButton.textContent = 'Edit'
  editButton.onclick = function () {
    location.href = 'edit.html?imdbID=' + movie.imdbID
  }
  article.append(editButton)

  const meta = document.createElement('p')
  meta.className = 'meta'
  meta.textContent = 'Runtime ' + formatRuntime(movie.Runtime) + ' • Released on ' + movie.Released
  article.append(meta)

  const genreDiv = document.createElement('div')
  genreDiv.className = 'genres'
  movie.Genres.forEach(function (genre) {
    const genreSpan = document.createElement('span')
    genreSpan.className = 'genre'
    genreSpan.textContent = genre
    genreDiv.append(genreSpan)
  })
  article.append(genreDiv)

  const plot = document.createElement('p')
  plot.textContent = movie.Plot
  article.append(plot)

  const dirTitle = document.createElement('h2')
  dirTitle.textContent = movie.Directors.length === 1 ? 'Director' : 'Directors'
  article.append(dirTitle)
  const dirList = document.createElement('ul')
  movie.Directors.forEach(function (director) {
    const li = document.createElement('li')
    li.textContent = director
    dirList.append(li)
  })
  article.append(dirList)

  const writTitle = document.createElement('h2')
  writTitle.textContent = 'Writers'
  article.append(writTitle)
  const writList = document.createElement('ul')
  movie.Writers.forEach(function (writer) {
    const li = document.createElement('li')
    li.textContent = writer
    writList.append(li)
  })
  article.append(writList)

  const actTitle = document.createElement('h2')
  actTitle.textContent = 'Actors'
  article.append(actTitle)
  const actList = document.createElement('ul')
  movie.Actors.forEach(function (actor) {
    const li = document.createElement('li')
    li.textContent = actor
    actList.append(li)
  })
  article.append(actList)

  const ratings = document.createElement('p')
  ratings.className = 'ratings'
  ratings.textContent = 'IMDb: ' + movie.imdbRating + '/10 • Metascore: ' + movie.Metascore
  article.append(ratings)

  element.append(article)
}

function loadMovies(genre) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const mainElement = document.querySelector('main');

    while (mainElement.childElementCount > 0) {
      mainElement.firstChild.remove()
    }

    if (xhr.status === 200) {
      const movies = JSON.parse(xhr.responseText)
      for (const movie of movies) {
        appendMovie(movie, mainElement)
      }
    } else {
      mainElement.append('Daten konnten nicht geladen werden, Status ' + xhr.status + ' - ' + xhr.statusText);
    }
  }

  const url = new URL('/movies', location.href)
  if (genre) {
    url.searchParams.set('genre', genre)
  }

  xhr.open('GET', url)
  xhr.send()
}

window.onload = function () {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const listElement = document.querySelector('nav>ul');

    if (xhr.status === 200) {
      const genres = JSON.parse(xhr.responseText)

      const allButton = document.createElement('button')
      allButton.textContent = 'All'
      allButton.onclick = function () { loadMovies(null) }
      const allLi = document.createElement('li')
      allLi.append(allButton)
      listElement.append(allLi)

      genres.forEach(function (genre) {
        const button = document.createElement('button')
        button.textContent = genre
        button.onclick = function () { loadMovies(genre) }
        const li = document.createElement('li')
        li.append(button)
        listElement.append(li)
      })

      const firstButton = document.querySelector('nav button');
      if (firstButton) {
        firstButton.click();
      }
    } else {
      document.querySelector('body').append('Daten konnten nicht geladen werden, Status ' + xhr.status + ' - ' + xhr.statusText);
    }
  };
  xhr.open('GET', '/genres');
  xhr.send();
};
