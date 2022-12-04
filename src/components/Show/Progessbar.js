import '../../styles/progessbar.css'
import React from "react";


const Progress = ({done}) => {
	const [style, setStyle] = React.useState({});
	
	setTimeout(() => {
		const newStyle = {
			opacity: 1,
			width: `${done}%`
		}
		setStyle(newStyle);
	}, 200);
	
	return (
		<div className="progress">
			<div className="progress-done" style={style}>
				{done}%
			</div>
		</div>
	)
}

const ProgressBar = () => (
	<>
		<Progress done="100"/>
	</>
);

export default ProgressBar
	