

export const SteamButton = ({text,play_free}) => {

    return (
        <a target='_blank' className={text ? 'main-button' : 'header-button'}
           href="https://store.steampowered.com/app/570/Dota_2/">
            <button>
                <i className='bx bxl-steam' style={{fontSize: '1.5em'}}></i>
                <div>
                    <p style={{fontSize: '1em'}}>{play_free}</p>
                    <p style={{fontSize: '0.84em'}}>{text ? text : ''}</p>
                </div>
            </button>
        </a>
    )
}