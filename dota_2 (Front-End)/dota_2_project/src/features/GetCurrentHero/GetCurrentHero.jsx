import {useEffect, useState} from "react";
import axios from "axios";


export const GetCurrentHero = (hero_name) => {
    const [heroes, setHeroes] = useState('')

    useEffect(() => {
        const fetchCurrentHero = async () => {
            try {
                await axios.get(`http://localhost:8000/api/v1/hero/${hero_name}/`)
                    .then(res => {
                        setHeroes(res.data)
                    })
            }
            catch (e) {
                console.log('error : ', e.message)
            }
        }

        fetchCurrentHero()

    }, [hero_name])

    return {heroes}
}