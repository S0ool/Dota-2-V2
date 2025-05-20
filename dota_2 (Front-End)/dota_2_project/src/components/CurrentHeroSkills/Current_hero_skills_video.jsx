import './skills-video.css';
import { useState, useEffect } from "react";
import HeroSkills from "../CurrentHero/Hero_skills.jsx";
import { CleanUrl } from "../../features/CleanUrl/CleanUrl.jsx";
import back from '../../../public/back.jpg';
import loadingGif from '../../../public/loading.gif';
import errorImage from '../../../public/error.jpg';
import SkillsVideo from "./Skills_info.jsx";

export default function CurrentHeroSkillsVideo({ skills,languageData }) {
	const [currentSkill, setCurrentSkill] = useState(0);
	const [videoError, setVideoError] = useState(false);
	const [videoLoaded, setVideoLoaded] = useState(false);
	const [currentVideo, setCurrentVideo] = useState(null);

	useEffect(() => {
		const video = skills.find(skill => skill.number === currentSkill && !skill.is_facet);
		if (video) {
			setCurrentVideo(video);
			setVideoError(false);
		} else {
			let nextSkill = currentSkill + 1;
			while (nextSkill < skills.length) {
				const nextVideo = skills.find(skill => skill.number === nextSkill && !skill.is_facet);
				if (nextVideo) {
					setCurrentSkill(nextSkill);
					break;
				}
				nextSkill++;
			}
		}
	}, [currentSkill, skills]);

	useEffect(() => {
		setVideoError(false);
		setVideoLoaded(false);
	}, [currentVideo]);

	const handleVideoLoaded = () => {
		setVideoLoaded(true);
		setVideoError(false);
	};

	const handleVideoError = () => {
		console.log("Ошибка загрузки видео");
		setVideoError(true);
	};

	const cleanedUrl = currentVideo && currentVideo.video ? CleanUrl({ url: currentVideo.video }) : null;

	const [sortedSkills, setSortedSkills] = useState([])
	{/* if ability_has_shard or ability_is_granted_by_shard -> skills[-2]
           if ability_has_scepter or ability_is_granted_by_scepter -> skills[-1]*/}
	useEffect(() => {
		let computedSkills = [...skills]
		computedSkills = computedSkills.filter(skill => !(skill.is_innate))
		let computedSkills2 = []
		let shard = null
		let scepter = null
		computedSkills.forEach((skill,index)=>{
			if ((skill.ability_has_shard && skill.shard_description[languageData.language]) || skill.ability_is_granted_by_shard && !shard){
				shard = skill
			}
			else if((skill.ability_has_scepter && skill.scepter_description[languageData.language]) || skill.ability_is_granted_by_scepter && !scepter){
				scepter = skill
			}
			else{computedSkills2.push(skill)}
		})
		computedSkills2.push(shard)
		computedSkills2.push(scepter)
		setSortedSkills(computedSkills2);
	}, [skills]);

	return (
		<div className='current-hero-skills-videos'>
			<div className='current-skills'>
				{cleanedUrl ? (
					<div className="video-container" style={{ position: "relative" }}>
						<video
							key={cleanedUrl}
							autoPlay
							loop
							muted
							preload='auto'
							onLoadedData={handleVideoLoaded}
							onError={handleVideoError}
							playsInline
							className="current-video"
							style={{ width: "100%", height: "100%" }}
						>
							<source src={cleanedUrl} type='video/mp4' />
						</video>
						{!videoLoaded && !videoError && (
							<img
								className="loading-overlay"
								src={loadingGif}
								alt="Загрузка видео"
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									width: "100%",
									height: "100%",
									objectFit: "cover",
									zIndex: 1
								}}
							/>
						)}
						{videoError && (
							<img
								className="error-overlay"
								src={errorImage}
								alt="Ошибка загрузки видео"
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									width: "100%",
									height: "100%",
									objectFit: "cover",
									zIndex: 1
								}}
							/>
						)}
					</div>
				) : (
					<img className='current-hero-img' src={back} alt="" />
				)}
				<div className='current-skills-icons'>
					{sortedSkills && sortedSkills.map(skill => {
							if (skill)
							return (
								<HeroSkills
									under={true}
									key={skill.id}
									skill={skill}
									setCurrentSkill={setCurrentSkill}
									currentSkill={currentSkill}
									languageData={languageData}
								/>
							)
					})}
				</div>
			</div>
			<div className='current-skill-info'>
				{currentVideo && <SkillsVideo skill={currentVideo} languageData={languageData}/>}
			</div>
		</div>
	);
}
