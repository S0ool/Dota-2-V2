import HeroesFilter from "./heroes-filter.jsx";
import HeroesList from "./Heroes-list.jsx";
import {useEffect, useState} from "react";
import axios from "axios";


export default function HeroesMain({languageData}){
    const [selectedAttribute, setSelectedAttribute] = useState(0)
    const [selectedComplexity, setSelectedComplexity] = useState(0)
    const [searchedHero, setSearchedHero] = useState('')



    return (
        <div>
            <HeroesFilter
                setAttr={setSelectedAttribute}
                attr={selectedAttribute}
                setComplexity={setSelectedComplexity}
                comp={selectedComplexity}
                searchHero={setSearchedHero}
                languageData={languageData}
            />
            <HeroesList
                attr={selectedAttribute}
                complexity={selectedComplexity}
                searchedHero={searchedHero}
            />
        </div>
    )
}