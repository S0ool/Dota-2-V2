import {useEffect, useState} from "react";
import axios from "axios";

export const GetCurrentHeroSkills = ({id}) => {
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        if (id && id!== 0){
        const fetchData = async () => {
            try {
                await axios.get(`http://localhost:8000/api/v1/skills/${id}/get_skills/`)
                    .then(res => {
                        setSkills(res.data);
                    });
            } catch (e) {
                console.log('error : ', e.message)
            }
        };

        fetchData()}
    }, [id]);

    return {skills};
};
