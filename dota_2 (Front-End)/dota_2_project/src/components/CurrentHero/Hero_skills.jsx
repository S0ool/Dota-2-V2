import { useEffect, useState } from "react";

export default function HeroSkills({ skill, setCurrentSkill, currentSkill, languageData,under=false }) {
    const [image, setImage] = useState(false)

    const handleClick = (num) => {
        setCurrentSkill(num)
    }

    if (skill.icon) {
        const image = new Image()

        image.src = skill.icon
        image.onload = () => {
            setImage(true)
        }

        image.onerror = () => {
            setImage(false)
        }
    }
    return (
        <>
            {image && !skill.is_facet &&
                <div>
                    <div className='hero-skill-img'
                        onClick={() => handleClick(skill.number)}
                        key={skill.id+100}
                        style={currentSkill === skill.number ? {filter: " saturate(100%) brightness(100%)",backgroundImage: `url(${skill.icon})`}:{backgroundImage: `url(${skill.icon})`}}>
                        {under && (skill.scepter_description[languageData.language] != '' || skill.ability_is_granted_by_scepter || skill.shard_description[languageData.language] || skill.ability_is_granted_by_shard) &&
                            <img
                            src={skill.aghs_icon}
                            key={skill.id}
                            alt=""
                            style={currentSkill === skill.number ? {filter: " saturate(100%) brightness(100%)",} : {}}/>}
                    </div>


                </div>
            }
        </>
    )
}
