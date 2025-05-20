import React, {useEffect} from 'react';
import cooldown from '../../../public/icons/cooldown.png'


export default function SkillsList({ skill,languageData }) {
    const [description, setDescription] = React.useState(null);


    let extra_desc = null
    if (skill.ability_has_scepter && skill.scepter_description[languageData.language]) {
        extra_desc = "Scepter Ability Upgrade"
    }
    else if (skill.ability_has_shard && skill.shard_description[languageData.language]) {
        extra_desc = "Shard Ability Upgrade"
    }
    else if (skill.ability_is_granted_by_scepter) {
        extra_desc = "Scepter Grants New Ability"
    }
    else if (skill.ability_is_granted_by_shard) {
        extra_desc = "Shard Grants New Ability"
    }
    useEffect(() => {

        if (skill.scepter_description[languageData.language]) {
        setDescription(skill.scepter_description[languageData.language])
        }
        else if (skill.shard_description[languageData.language]) {
            setDescription(skill.shard_description[languageData.language])
        }
        else{
            setDescription(skill.description[languageData.language])
        }
    }, [skill,languageData]);

    return (
        <>
            <div className='skill-title'>
                <img src={skill.icon} alt={skill.name[languageData.language]}/>
                <div className='skill-desc'>
                    <h2>{skill.name[languageData.language]}</h2>
                    {extra_desc && <p className='extra_desc'>{extra_desc}</p>}
                    <p dangerouslySetInnerHTML={{__html: description}}></p>

                </div>
            </div>
            <div className='skill-effect'>
                {skill.spell_effects &&
                    Object.entries(skill.spell_effects).map(([effectKey, effectValue]) => {
                        let obj = null;

                        if (effectKey === "top") {
                            obj = Object.entries(effectValue).map(([key, value]) => {
                                if (value) {
                                    let new_key = languageData.data.hero_data[`${key}`]
                                    new_key = new_key && new_key.toUpperCase()
                                    let value_style = key == 'hero_damage_type' && value == 'ability_damage_magical' ? {color: 'rgb(163, 220, 238)'}
                                        : value == 'ability_damage_physical' ? {color: 'red'} : value == 'ability_damage_physical' ? {color: 'orange'} : {}
                                    return (
                                        <div key={key}>
                                            <strong>{new_key}:</strong>
                                            <span style={value_style}>{languageData.data.hero_data[`${value}`]}</span>
                                        </div>
                                    );
                                }
                                return null;
                            });

                            return (
                                <div className='spell-effects' key={effectKey}>
                                    {obj}
                                </div>
                            );
                        } else {
                            obj = Object.entries(effectValue).map(([key, value]) => {
                                if (value) {
                                    return (
                                        <div key={key} className="skill-effect-bottom">
                                            <strong>{value[languageData.language]}</strong>
                                            <span>{key}</span>
                                        </div>
                                    );
                                }
                                return null;
                            });

                            return (
                                <div className='spell-effects-bottom' key={effectKey}>
                                    {obj}
                                </div>
                            );
                        }
                    })
                }

                <div className='skill-cost'>
                    {skill.cooldown != 0 && <p><img src={cooldown} alt="" className='cooldown'/> {skill.cooldown} seconds</p>}
                    {skill.mana_cost != 0 && <p><div className="mana-cost"></div>{skill.mana_cost}</p>}
                </div>
                {skill.tip[languageData.language] && <p className='tip'>{skill.tip[languageData.language]}</p>}
            </div>
        </>
    );
}
