import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import {HeroesIcon} from "./HeroesIcon.jsx";
import {useSelector} from "react-redux";


export default function HeroesList({attr, complexity, searchedHero}){
    const [heroesList, setHeroesList] = useState([])
    const [currentLanguage, setCurrentLanguage] = useState("english")

    const language = useSelector((state) => state.language);

    useEffect(()=> {
        const getLanguage = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/languages/${language}/`);
                setCurrentLanguage(res.data.language)
            }
            catch (e) {
                console.log(e)
            }
        }
        getLanguage()


        const fetchHeroes = async () => {
            try {
                await axios.get('http://localhost:8000/api/v1/heroes-list/')
                    .then(res => {
                        setHeroesList(res.data.sort((a, b) =>a.name[currentLanguage] > b.name[currentLanguage] ? 1 : -1))})
            }
            catch (e) {
                console.log(e)
            }
        }
        fetchHeroes()
    }, [])

    const heroes = useMemo(() => {
        let filteredHeroes = heroesList;

        if (searchedHero) {
            return filteredHeroes.filter(hero =>
                hero.name[currentLanguage   ].toLowerCase().includes(searchedHero.toLowerCase())
            );
        }

        if (attr !== 0) {
            filteredHeroes = filteredHeroes.filter(hero => hero.main_attribute == attr-1);
        }

        if (complexity !== 0) {
            filteredHeroes = filteredHeroes.filter(hero => hero.complexity == complexity);
        }
        console.log(filteredHeroes)
        return filteredHeroes;

    }, [heroesList, attr, complexity, searchedHero]);


    return (
        <div className='heroes-list'>
            {heroes.map((hero, index) => (
                <HeroesIcon
                    index={index}
                    hero={hero}
                    attr={attr}
                    complexity={complexity}
                    searchedHero={searchedHero}/>
            ))}
        </div>
    )
}