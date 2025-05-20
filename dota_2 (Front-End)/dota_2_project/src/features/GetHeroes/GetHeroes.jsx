import {useEffect, useState} from "react";
import axios from "axios";

export const GetHeroes = ({page}) => {
    const [heroes, setHeroes] = useState([])

    useEffect(()=> {
        axios.get(`http://localhost:8000/api/v1/heroes/?page=${page}`)
            .then(res => {
                setHeroes(res.data.results)
            })
    }, [])

    return {heroes}
}