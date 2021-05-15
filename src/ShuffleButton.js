import React from "react";
import './ShuffleButton.css';

function ShuffleButton(props) {
    return (
        
        (props.isVisible===true) 
            ? <div className="grid-item shufflebutton" key={props.position} onClick={props.onShuffleClick} position={props.position}>
                <h1 position={props.position} >{props.number}</h1>
              </div>
            : <div className="shufflebutton" onClick={props.onShuffleClick} key={props.position} position="-1"/>
    )
}

export default ShuffleButton;