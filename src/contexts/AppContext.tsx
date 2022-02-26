import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../services/api";


interface GenreResponseProps {
    id: number;
    name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
    title: string;
  }

  interface MovieProps {
    imdbID: string;
    Title: string;
    Poster: string;
    Ratings: Array<{
      Source: string;
      Value: string;
    }>;
    Runtime: string;
  }


type contextData = {
    handleClickButton: (value: number) => void;
    selectedGenre: GenreResponseProps;
    selectedGenreId: number;
    movies: MovieProps[];
    genres: GenreResponseProps[];
}

interface AppContextProviderProps {
    children: ReactNode;
}

export const AppContext = createContext<contextData>({} as contextData)


export function AppContextProvider({ children }: AppContextProviderProps) {

    const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);
    const [movies, setMovies] = useState<MovieProps[]>([]);
    const [selectedGenreId, setSelectedGenreId] = useState(1);
    const [genres, setGenres] = useState<GenreResponseProps[]>([]);

    useEffect(() => {
        api.get<GenreResponseProps[]>('genres').then((response: any) => {
          setGenres(response.data);
        });
      }, []);

    useEffect(() => {
        api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`).then((response: any) => {
          setMovies(response.data);
        });

        api.get<GenreResponseProps>(`genres/${selectedGenreId}`).then((response: any) => {
          setSelectedGenre(response.data);
        })
      }, [selectedGenreId]);

      function handleClickButton(id: number) {
        setSelectedGenreId(id);
      }

    return(
        <AppContext.Provider value={{ selectedGenre, selectedGenreId, movies, genres, handleClickButton}}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const appContext = useContext(AppContext);
    return appContext;
}