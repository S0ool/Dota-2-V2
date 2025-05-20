import {useEffect, useState} from "react";
import axios from "axios";


export const GetCurrentAspects = ({id}) => {

    const [currentAspects, setCurrentAspects] = useState([])

    useEffect(() => {

        const fetchAspects = async () => {
            try {
                await axios.get(`http://localhost:8000/api/v1/aspects/${id}/get_aspects/`)
                    .then(res => {
                        setCurrentAspects(res.data)
                    })
            } catch (e) {
                console.log('error : ', e.message)
            }
        }

        fetchAspects()
    }, [id])

    return currentAspects
}