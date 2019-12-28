(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const dataPanel = document.querySelector('#data-panel')
  const genrePanel = document.querySelector('#genre-panel')
  const data = []
  const filteredData = []
  const genreList = {
    "1": "Action",
    "2": "Adventure",
    "3": "Animation",
    "4": "Comedy",
    "5": "Crime",
    "6": "Documentary",
    "7": "Drama",
    "8": "Family",
    "9": "Fantasy",
    "10": "History",
    "11": "Horror",
    "12": "Music",
    "13": "Mystery",
    "14": "Romance",
    "15": "Science Fiction",
    "16": "TV Movie",
    "17": "Thriller",
    "18": "War",
    "19": "Western"
  }

  axios.get(INDEX_URL).then((response) => {
    data.push(...response.data.results)
    setGenrePanel(genreList)
    displayDataList(data)
    insertTags()
  }).catch((err) => console.log(err))


  // --------------------- event listener ------------------------

  // 找到 genre 代碼，篩選出具備同樣代碼的電影，顯示後再加上 tag
  genrePanel.addEventListener('click', (event) => {
    const genreCode = Number(event.target.id)

    clearActiveClass()
    event.target.classList.add('active')

    filteredData.splice(0, filteredData.length)
    data.forEach((movie) => {
      if (movie.genres.includes(genreCode)) {
        filteredData.push(movie)
      }
    })
    displayDataList(filteredData)

    insertTags()
  })

  // ------------------------ functions -------------------------

  // 建立電影類別選單
  function setGenrePanel(list) {
    const genreCodes = Object.keys(list)
    const genreNames = Object.values(list)
    let entries = ''

    for (let i = 0; i < genreCodes.length; i++) {
      const li = `
        <li class="category list-group-item" id='${genreCodes[i]}'>
          ${genreNames[i]}
        </li>
    `
      entries += li
    }
    genrePanel.innerHTML = entries
  }

  // 清除電影類別選單上的 active class
  function clearActiveClass() {
    const categories = genrePanel.querySelectorAll('.category')
    categories.forEach((category) => {
      category.classList.remove('active')
    })
  }

  // 找到每部電影裡的類型代碼，依據 genreList 轉換成名稱，再放入欄位中
  function insertTags() {
    const movies = dataPanel.querySelectorAll('.movie')

    movies.forEach((movie) => {
      const tagField = movie.querySelector('.tags-field')
      const codeArray = tagField.dataset.genres.split(' ')
      const nameArray = codeArray.map((code) => genreList[code])

      nameArray.forEach((name) => {
        const div = document.createElement('div')

        div.classList.add('tag', 'btn', 'btn-light', 'mx-1', 'my-1', 'btn-sm')
        div.textContent = name
        tagField.append(div)
      })
    })
  }

  // 顯示全部電影或是篩選過的電影
  function displayDataList(data) {
    let htmlContent = ''

    data.forEach(function (item, index) {
      htmlContent += `
          <div class="col-sm-3 movie" data-movie="${item.id}">
            <div class="card mb-2">
              
              <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
              
              <div class="card-body movie-item-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
             
              <div class="tags-field flex-no-wrap" data-genres="${item.genres.join(' ')}">
                <!-- tags -->
              </div>          

            </div>
          </div>
        `

    })

    dataPanel.innerHTML = htmlContent
  }
})()
