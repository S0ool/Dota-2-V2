
export default function HeroVideo({hero}){
    return (
        <div className='hero-background'>
            <div className='black-line'>

            </div>
            {hero.video && (
                <video autoPlay loop muted preload='auto'>
                    <source src={hero.video} type='video/webm'/>
                </video>
            )}
        </div>
    )
}