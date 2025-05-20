import CurrentHeroAttack from "./Current_hero_attack.jsx";
import CurrentHeroDefense from "./Current_hero_defense.jsx";
import CurrentHeroMobility from "./Current_hero_mobility.jsx";

export default function HeroStats({hero, languageData}){


    return (
        <div className='current-hero-type'>
            <CurrentHeroAttack hero={hero} languageData={languageData}/>
            <CurrentHeroDefense hero={hero} languageData={languageData}/>
            <CurrentHeroMobility hero={hero} languageData={languageData}/>
        </div>
    )
}