import img from "../../../public/ripple_texture.png";


export const AspectsCard = ({ aspect, languageData }) => {
    return (
        <div className='width-aspects'>
            <div className='current-aspects-card'>
                    <div className='aspect-header'>
                        <div className='aspect-header-color' style={{ background: `${aspect.color}`}}/>
                        <div className='aspect-header-img' style={{backgroundImage: `url(${img})`}}/>
                        <div className='aspect-header-info'>
                            <div className='aspect-header-info-icon-container'>
                                <img className='aspect-header-info-icon-container-icon' src={aspect.icon} alt="" />
                            </div>
                            <p className='aspect-header-info-title'>{aspect.title[languageData.language]}</p>

                        </div>
                    </div>
                <div className='current-aspects-info'>
                    <p>{aspect.description[languageData.language]}</p>
                    {aspect.ability_description[languageData.language] && (
                        <div className='aspect-skills'>
                            <img src={aspect.ability_icon} alt=""/>
                            <p>{aspect.ability_name}</p>
                        </div>
                    )}
                    <p dangerouslySetInnerHTML={{__html: aspect.ability_description[languageData.language]}}/>
                </div>
                {aspect.full_description[languageData.language] &&
                <div className='aspect-full-description'>
                    <p style={{fontSize: '16px'}} dangerouslySetInnerHTML={{__html: aspect.full_description[languageData.language]}}></p>
                </div>}

                {aspect.facet_bonuses[languageData.language] &&
                    <div className="all-sub-stats">
                        {Object.entries(aspect.facet_bonuses[languageData.language]).map((value, index) => {
                          if (value[0] && value[1] != 0) {
                            return (
                              <div className="sub-stats" key={index}>
                                <p className="sub-stats-value">
                                    <span style={{color:'#737373', paddingRight: '5px'}}>{value[0]}</span>
                                    <span style={{color:'#fff'}}>{value[1].join(' / ')}</span>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        })
                        }
                    </div>
                }




            </div>
        </div>
    );
}
