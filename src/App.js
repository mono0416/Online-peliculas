import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import YouTube from 'react-youtube';

function App() {
  //constantes o claves
  const API_URL = 'https://api.themoviedb.org/3'
  const API_KEY = '0fa72e2683713001e28a0d10935545ad'
  const IMAGE_PATH = 'https://image.tmdb.org/t/p/original/'
  const URL_IMAGE = 'https://image.tmdb.org/t/p/original/'

  // variables de estamdo 
  const [movies, setMovies] = useState([])
  const [searchKey, setSearchKey] = useState("")
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ title: "Loading Movies" });
  const [playing, setPlaying] = useState(false);

  //funcion para peticion get 
  const fetchMovies = async(searchKey) =>{
    const type = searchKey ? "search" : "discover"
    const { data: { results },
  } = await axios.get(`${API_URL}/${type}/movie`, {
    params: {
      api_key: API_KEY,
      query: searchKey,
    },
  });

  setMovies(results)
  setMovie(results[0])

  if(results.length){
    await fetchMovie(results[0].id)
    }
  };
  

  //funcion para la peticion y mostrar en video 
  const fetchMovie = async(id) => {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos"
      },
    });

    if (data.videos && data.videos.results){
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );
      setTrailer(trailer ? trailer: data.videos.results[0])

    }
    //return data
    setMovie(data)

  }

  const selectMovie = async(movie)=>{
    fetchMovie(movie.id)
    setMovie(movie)
    //window.screenTop(0,0)
  }

  //funcio para buscar peliculas

  const searchMovies = (e)=>{
    e.preventDefault();
    fetchMovies(searchKey)
  }

  useEffect(()=>{
    fetchMovies();
  },[])

  return (
    <div className='pantalla'>
      <h2 className='text-center mt-5 mb-5' id='title'>Peliculas Online</h2>
      {/*buscar pelucula*/}
      <form className='container mb-4' onSubmit={searchMovies}>
        <input type='text' placeholder='Buscar' onChange={(e)=> setSearchKey(e.target.value)} />
        <button className='btn btn-primary'>Buscar</button>
      </form>
      {/*contenedor de banner y el video */}

      <div>
        <main>
          {movie ? (
            <div className='viewtrailer' 
              style={{backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
              }}
            >
              {playing ? (
                <>
                  <YouTube videoId={trailer.key} className='reproductor container' containerClassName={"youtube-container amru"}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy:0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo:0,
                      },
                    }}
                  />
                  <button onClick={() => setPlaying(false)} className='boton'>X</button>
                </>
              ) : (
                <div className='container'>
                  <div className=''> {trailer ? (
                    <button className='boton' onClick={() => setPlaying(true)} type='button'>Ver Trailer</button>
                  ) :(
                    "No esta disponible"
                  )}
                  <h1 className='text-white'>{movie.title}</h1>
                  <p className='text-white'>{movie.overview}</p>

                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>



       {/*contenedor que muestar posters de las peliculas actuales*/}
      <div className='container mt-3'>
        <div className='row'>
          {movies.map((movie)=>(
            <div key={movie.id} className='col-md-4 mb-3' onClick={()=> selectMovie(movie)}>
              <img src={`${URL_IMAGE + movie.poster_path}`} alt='' height={600} width="100%"/>
                <h4 className='text-center' id='title' >{movie.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
