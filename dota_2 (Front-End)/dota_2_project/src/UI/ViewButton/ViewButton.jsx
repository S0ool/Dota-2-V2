import {Link} from "react-router-dom";
import './styles.css'

export const ViewButton = ({text, link, blank=false}) => {

    return (
        <div className='view-button'>
            <Link target={blank ? '_blank' : '_self'} className='view-button' to={link}>{text}</Link>
        </div>

    )
}