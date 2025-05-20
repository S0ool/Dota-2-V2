import './aspects.css'
import {GetCurrentAspects} from "../../features/GetCurrentHeroAspects/GetCurrentHeroAspects.jsx";
import {AspectsCard} from "./Aspects_card.jsx";
import {useEffect} from "react";

export default function CurrentHeroAspects({hero, languageData}) {
    const aspects = GetCurrentAspects({id: hero.id})
    useEffect(() => {
        console.log(aspects)
    }, [aspects]);
    return (
        <div className='current-hero-aspects'>
            {aspects && aspects.map(aspect => {
                return <AspectsCard key={aspect.id} aspect={aspect} languageData={languageData}/>
            })}
        </div>
    )
}