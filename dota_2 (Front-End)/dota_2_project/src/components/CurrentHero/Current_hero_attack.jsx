import damage from "../../../public/icons/icon_damage.png";
import time from "../../../public/icons/icon_attack_time.png";
import range from "../../../public/icons/icon_attack_range.png";
import projectile_speed from "../../../public/icons/icon_projectile_speed.png";


export default function CurrentHeroAttack({hero,languageData}) {
    return (
        <div className='current-hero-atack'>
            <h2>{languageData.data.hero_data.hero_attack}</h2>
            <div>
                <img src={damage} alt=""/>
                <p>{hero && hero.attack.damage}</p>
            </div>
            <div>
                <img src={time} alt=""/>
                <p>{hero && hero.attack.attack_rate}</p>
            </div>
            <div>
                <img src={range} alt=""/>
                <p>{hero && hero.attack.attack_range}</p>
            </div>
            {hero && hero.attack.projectile_speed>900 &&
              <div>
                <img src={projectile_speed} alt=""/>
                <p>{hero && hero.attack.projectile_speed}</p>
              </div>
            }
        </div>
    )
}