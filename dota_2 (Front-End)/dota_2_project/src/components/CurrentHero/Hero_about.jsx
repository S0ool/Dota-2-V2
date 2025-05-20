import HeroAboutAttr from "./Hero_about_attr.jsx";
import HeroAboutRoles from "./Hero_about_roles.jsx";
import HeroStats from "./Hero_stats.jsx";


export default function HeroAbout({hero,languageData}){
    return (
        <>
            <HeroAboutAttr hero={hero}/>
            {hero && languageData && <HeroAboutRoles hero={hero} languageData={languageData}/>}
            {languageData && <HeroStats hero={hero} languageData={languageData}/>}
        </>
    )
}