//TMDB API

const API_KEY='api_key=28b82d331082dd6b7524a87f94bb8899';
const BASE_URL='https://api.themoviedb.org/3';
const API_URL= BASE_URL+'/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMG_URL= 'https://image.tmdb.org/t/p/w500/';
const searchURL= BASE_URL+ '/search/movie?'+ API_KEY;

const genres=[
       {
          "id":28,
          "name":"Action"
       },
       {
          "id":12,
          "name":"Adventure"
       },
       {
          "id":16,
          "name":"Animation"
       },
       {
          "id":35,
          "name":"Comedy"
       },
       {
          "id":80,
          "name":"Crime"
       },
       {
          "id":99,
          "name":"Documentary"
       },
       {
          "id":18,
          "name":"Drama"
       },
       {
          "id":10751,
          "name":"Family"
       },
       {
          "id":14,
          "name":"Fantasy"
       },
       {
          "id":36,
          "name":"History"
       },
       {
          "id":27,
          "name":"Horror"
       },
       {
          "id":10402,
          "name":"Music"
       },
       {
          "id":9648,
          "name":"Mystery"
       },
       {
          "id":10749,
          "name":"Romance"
       },
       {
          "id":878,
          "name":"Science Fiction"
       },
       {
          "id":10770,
          "name":"TV Movie"
       },
       {
          "id":53,
          "name":"Thriller"
       },
       {
          "id":10752,
          "name":"War"
       },
       {
          "id":37,
          "name":"Western"
       }
    ]

const main= document.getElementById('main');
const form= document.getElementById('form');
const search= document.getElementById('search');
const tagsEl=document.getElementById('tags');

const prev=document.getElementById('prev');
const next=document.getElementById('next');
const current=document.getElementById('current');


var currentPage=1;
var nextPage=2;
var prevPage=3;
var lastUrl='';
var total=100;

var selectedGenre=[]; //contain all id's of genre that have been clicked

setGenre();

function setGenre(){
    tagsEl.innerHTML="";
    //console.log(genres);
    fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=28b82d331082dd6b7524a87f94bb8899')
    .then(res => res.json())
    .then(data => myFunc(data.genres)) //IMPORTANT! Must access genres in the object FIRST //Prev mistake: .then(genres=>myFunc(genres));
}

function myFunc(genres){
    console.log(genres);
    genres.forEach(genre => {
        const t= document.createElement('div');
        t.classList.add('tag');
        t.id= genre.id;
        t.innerText= genre.name;
        t.addEventListener('click', () => {
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id);
            }else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id, idx) => { //id in forEach parameter is the value of the id in the selectedGenre array, idx is index of the element in array
                        if(id== genre.id){
                            selectedGenre.splice(idx,1); //cut from which index (1st param), and starting from that index, cut by how many? (2nd param)
                        }
                    })
                }else{
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre);
            getMovies(API_URL+'&with_genres='+encodeURI(selectedGenre.join(',')));
            highlightSelection();
        })
        tagsEl.appendChild(t);
    });
}

function highlightSelection(){
    const tags= document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight');
    })
    clearBtn();
    if(selectedGenre.length != 0){
    selectedGenre.forEach(id => {
        const highlightedTag= document.getElementById(id);
        highlightedTag.classList.toggle('highlight');
    })
  }
}

function clearBtn(){
    let clearBtn=document.getElementById('clear');
    if(clearBtn){
        clearBtn.classList.add('highlight');
    }else{
    let clear=document.createElement('div');
    clear.classList.add('tag','highlight');
    clear.id='clear';
    clear.innerText='Clear x';
    clear.addEventListener('click', () => {
        selectedGenre= [];
        setGenre();
        getMovies(API_URL);
    })
    tagsEl.appendChild(clear);
    }
}

//.join() default is comma , (to join the elements of array into a string separated by comma)
//since its a GET request, we need to do a URL encode

getMovies(API_URL);

function getMovies(url){
    lastUrl= url; 
    fetch(url).then(res => res.json()).then(data => {
        //console.log(data.results);
        if(data.results.length != 0){
            showMovies(data.results); //need results only
            currentPage = data.page;
            nextPage = currentPage+1;
            prevPage = currentPage-1;
            totalPages = data.total_pages;

            current.innerText= currentPage;

            if(currentPage <= 1){
                prev.classList.add('disabled');
                next.classList.remove('disabled');
            }else if(currentPage >= totalPages){
                prev.classList.remove('disabled');
                next.classList.add('disabled');
            }else{
                prev.classList.remove('disabled');
                next.classList.remove('disabled')
            }
            
        }else{
            main.innerHTML=`<h1 class="no-results">No Results Found!</h1>`
        }
    })
}

function showMovies(data){
    main.innerHTML='';

   // console.log(data);
    //  data returned is in the format of objects with key-value pairs (CAN USE OBJECT DESTRUCTURING)
    //    {
    //     adult: false
    //     backdrop_path: "/ugS5FVfCI3RV0ZwZtBV3HAV75OX.jpg"
    //     genre_ids: (3) [16, 878, 28]
    //     id: 610150
    //     original_language: "ja"
    //     original_title: "ドラゴンボール超 スーパーヒーロー"
    //     overview: "The Red Ribbon Army, an evil organization that was once destroyed by Goku in the past, has been reformed by a group of people who have created new and mightier Androids, Gamma 1 and Gamma 2, and seek vengeance against Goku and his family."
    //     popularity: 7195.285
    //     poster_path: "/rugyJdeoJm7cSJL1q4jBpTNbxyU.jpg"
    //     release_date: "2022-06-11"
    //     title: "Dragon Ball Super: Super Hero"
    //     video: false
    //     vote_average: 7.5
    //     vote_count: 148
    //    }

    data.forEach(movie =>{
        const {title, poster_path, vote_average, overview, id}= movie; //JavaScript Object Destructuring concept
        const movieEl= document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML= `
                <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}"/>

                <div class="movie-info">
                    <h3>${title}</h3>
                    <span class="${getColor(vote_average)}">${vote_average}</span><!--Based on rating, the color of the class will change!-->
                </div>
                
                <div class="overview">
                    <h3>Overview</h3>
                    ${overview}
                    <br>
                    <button class='know-more' id="${id}">Know More</button>
                </div>
        `

        main.appendChild(movieEl);

        document.getElementById(id).addEventListener('click', () => {
            console.log(id);
            openNav(movie);
        })
    })
}

const overlayContent=document.getElementById('overlay-content');
/* Open when someone clicks on the span element */
function openNav(movie) {
    let id=movie.id;
    fetch(BASE_URL +'/movie/'+id+'/videos?'+ API_KEY).then(res => res.json())
    .then(videoData => {
        console.log(videoData);
        if(videoData){
            document.getElementById("myNav").style.width = "100%";
            if(videoData.results.length >0){
                var embed=[];
                var dots=[];
                videoData.results.forEach((video, idx) => {
                    let {name, key, site} = video;

                    if(site == 'YouTube'){

                    embed.push(`
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}"
                        title="${name}" class='embed hide' frameborder="0" allow="accelerometer; autoplay; 
                        clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                        </iframe>
                        `)

                        dots.push(`
                        <span class='dot'>${idx+1}</span>
                        `)
                        //idx+1 because index of array starts from 0
                    }
                })

                var content= `
                <h1 class="no-results">${movie.original_title}</h1>
                <br/>

                ${embed.join('')}
                <br/>

                <div class='dots'>${dots.join('')}</div>
                `

                overlayContent.innerHTML= content; //concatenate everything in array with nothing
                activeSlide=0;
                showVideos();
            }else{
                overlayContent.innerHTML= `<h1 class="no-results">No Results Found!</h1>`;
            }
        }
    }) 
  }

  /* Close when someone clicks on the "x" symbol inside the overlay */
  function closeNav() {
    document.getElementById("myNav").style.width = "0%";
  }


  var activeSlide = 0; 
  var totalVideos=0;


  //Loop thru each video in embedClasses and see if variable activeSlide == idx, then only show that vid
  function showVideos(){
    let embedClasses= document.querySelectorAll('.embed'); //return an array like a node list
    let dots= document.querySelectorAll('.dot'); 
    totalVideos= embedClasses.length;
    embedClasses.forEach((embedTag, idx) => {
        if(activeSlide == idx){ //activeSlide=0 , idx=0: SHOW!
            embedTag.classList.add('show');
            embedTag.classList.remove('hide');
        }else{
            embedTag.classList.add('hide')
            embedTag.classList.remove('show');
        }
    })

    dots.forEach((dot, idx) => {
        if(activeSlide == idx){
            dot.classList.add('active');
        }else{
            dot.classList.remove('active');
        }
    });
  }

const leftArrow=document.getElementById('left-arrow');
const rightArrow=document.getElementById('right-arrow');

leftArrow.addEventListener('click', () => {
    //check if activeSlide>0, if greater then reduce activeSlide by 1 and call showVideos func();
    if(activeSlide > 0){
        activeSlide--;
    }else{
        activeSlide= totalVideos-1;
    }
    showVideos();
})

rightArrow.addEventListener('click', () => {
    if(activeSlide < totalVideos-1){
        activeSlide++;
    }else{
        activeSlide= 0;
    }
    showVideos();
})


function getColor(vote){
    if(vote>=8){
        return 'green'
    }else if(vote >=5){
        return 'orange'
    }else{
        return 'red'
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
  
    const searchTerm= search.value;
    selectedGenre=[];
    setGenre();
    if(searchTerm){
        getMovies(searchURL+'&query='+searchTerm);
}else{
    getMovies(API_URL);
}

});

//Query for page in query parameter for pagination!

prev.addEventListener('click', () => {
    if(prevPage>0){
        pageCall(prevPage); //call pageCall function!
        tagsEl.scrollIntoView({behavior : 'smooth'});
    }
})

next.addEventListener('click', () => {
    if(nextPage <= totalPages){
        pageCall(nextPage); //call pageCall function!
        tagsEl.scrollIntoView({behavior : 'smooth'});
    }
})

//https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=28b82d331082dd6b7524a87f94bb8899&page=1/2/3;

function pageCall(page){ //add a 3rd parameter in query param with query of page=?
    let urlSplit= lastUrl.split('?');
    let queryParams= urlSplit[1].split('&');
    let key= queryParams[queryParams.length-1].split('=');
    if(key[0] != 'page'){
        let url= lastUrl+ '&page='+ page;
        getMovies(url);
    }else{
        key[1]= page.toString();
        let a= key.join('='); //page=3;
        queryParams[queryParams.length-1]=a;
        let b=queryParams.join('&');
        let url= urlSplit[0]+'?'+ b;
        getMovies(url);
    }
}

