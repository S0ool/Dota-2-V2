import armor from "../../../public/icons/icon_armor.png";
import mr from "../../../public/icons/icon_magic_resist.png";




export default function CurrentHeroDefense({hero,languageData}) {
    return (
        <div className='current-hero-atack'>
            <h2>{languageData.data.hero_data.hero_defense}</h2>
            <div>
                <img src={armor} alt=""/>
                <p>{hero && hero.defense.armor}</p>
            </div>
            <div>
                <img src={mr} alt=""/>
                <p>{hero && hero.defense.magic_resistance}</p>
            </div>
        </div>
    )
}