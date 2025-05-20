import agi from '/attr/hero_agility.png'
import int from '/attr/hero_intelligence.png'
import str from '/attr/hero_strength.png'


export default function HeroAboutAttr({ hero }) {
    return (
        <div className='hero-main-stats'>
            <div className='hero-hp'>
                <img src={hero?.icon || ""} alt=""/>
                <p>{hero?.hp?.health ?? 'No health data'} <span>+{hero?.hp?.health_regen ?? 'No health data'}</span></p>
                <p>{hero?.mp?.mana ?? 'No mana data'} <span>+{hero?.mp?.mana_regen ?? 'No mana data'}</span></p>
            </div>
            <div className='hero-all-attr'>
                <div>
                    <img src={str} alt=""/>
                    <p>{hero?.attributes?.str_base ?? 'No strength data'}</p>
                    <p className='grey'>+{hero?.attributes?.str_gain ?? 'No strength data'}</p>
                </div>
                <div>
                    <img src={agi} alt=""/>
                    <p>{hero?.attributes?.agi_base ?? 'No strength data'}</p>
                    <p className='grey'>+{hero?.attributes?.agi_gain ?? 'No strength data'}</p>
                </div>
                <div>
                    <img src={int} alt=""/>
                    <p>{hero?.attributes?.int_base ?? 'No strength data'}</p>
                    <p className='grey'>+{hero?.attributes?.int_gain ?? 'No strength data'}</p>
                </div>
            </div>
        </div>
    );
}
