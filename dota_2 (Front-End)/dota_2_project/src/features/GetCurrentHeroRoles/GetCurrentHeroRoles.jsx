import {useEffect, useState} from "react";
import axios from "axios";


export default function GetCurrentHeroRoles(id){
    const [currentRoles, setCurrentRoles] = useState([])

    useEffect(()=> {

        const fetchHeroRoles = async () => {
            try {
                await axios.get(`http://localhost:8000/api/v1/hero-roles/${id}/get_hero_roles/`)
                    .then(res => {
                        setCurrentRoles(res.data)
                    })
            }
            catch (e) {
                console.log('error : ', e.message)
            }
        }
        fetchHeroRoles()
    }, [id])

    return currentRoles

}