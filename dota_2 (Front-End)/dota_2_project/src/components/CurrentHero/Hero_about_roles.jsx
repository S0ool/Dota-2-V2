import GetCurrentHeroRoles from "../../features/GetCurrentHeroRoles/GetCurrentHeroRoles.jsx";
import {useEffect} from "react";


export default function HeroAboutRoles({hero,languageData}){

    const heroRoles = GetCurrentHeroRoles(hero.id)
    useEffect(() => {
        console.log(heroRoles);
    }, []);
    return (
        <div className='hero-about-roles'>
            {heroRoles && heroRoles.map((role) => {
                return (
                    <div key={role.id} className='hero-about-role'>
                        <h4>{languageData.data.hero_data[role.role]}</h4>
                        <div><p style={
                            role.level === 0 ? {width: '0%'} :
                            role.level === 1 ? {width: '33%'} :
                            role.level === 2 ? {width: '66%'} :
                            {width: '100%'}
                        }></p></div>
                    </div>
                )
            })}
        </div>
    )
}