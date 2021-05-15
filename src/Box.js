import React, { useState } from "react";
import './Box.css';
import ShuffleButton from "./ShuffleButton";

const BOX_ROWS = 4
const BOX_SIZE = BOX_ROWS * BOX_ROWS;

function Box() {
    
    const [boxState, setBoxState] = useState(InitBox());

    function doShuffle(cell) {
        return <ShuffleButton key={cell.position} position={cell.position} number={cell.value} onShuffleClick={ShuffleClick} isVisible={cell.visible} />
    }

    function ShuffleClick(e) {
        //console.log(e.target.attributes["position"]);
        const clickPosition = GetRowCol(e.target.attributes["position"].value);
        //console.log(clickPosition);

        const freePosition = GetRowCol(boxState.filter(c => !c.visible)[0].position);
        //console.log(freePosition);

        if (clickPosition.row === freePosition.row) {
            //console.log("horizontal move");
            MoveHorizontally(clickPosition, freePosition);
        } else {
            if (clickPosition.col === freePosition.col) {
                //console.log("vertical move");
                MoveVertically(clickPosition, freePosition);
            } //else {
                //console.log("no move possible");
            //}
        }

    }

    function MoveHorizontally(cPos, fPos) {

        setBoxState(prevBoxState => {
            var boxCopy = prevBoxState.map(c => ({ ...c }));
            var pos;
            if (cPos.col > fPos.col) {// move to left
                for (pos = fPos.absolutePosition; pos < cPos.absolutePosition; pos++) {
                    boxCopy[pos].value = prevBoxState[pos + 1].value;
                }
            } else {// move to right
                for (pos = fPos.absolutePosition; pos > cPos.absolutePosition; pos--) {
                    boxCopy[pos].value = prevBoxState[pos - 1].value;
                }
            }
            boxCopy[cPos.absolutePosition].visible = false;
            boxCopy[fPos.absolutePosition].visible = true;
            return boxCopy;
        });

    }

    function MoveVertically(cPos, fPos) {
        setBoxState(prevBoxState => {
            var boxCopy = prevBoxState.map(c => ({ ...c }));
            var pos;
            if (cPos.row > fPos.row) {// move up
                for (pos = fPos.absolutePosition; pos < cPos.absolutePosition; pos += BOX_ROWS) {
                    boxCopy[pos].value = prevBoxState[pos + BOX_ROWS].value;
                }
            } else {// move down
                for (pos = fPos.absolutePosition; pos > cPos.absolutePosition; pos -= BOX_ROWS) {
                    boxCopy[pos].value = prevBoxState[pos - BOX_ROWS].value;
                }
            }
            boxCopy[cPos.absolutePosition].visible = false;
            boxCopy[fPos.absolutePosition].visible = true;

            return boxCopy;
        });
    }

    function GetRowCol(position) {
        return { absolutePosition: position, row: Math.floor(position / BOX_ROWS), col: position % BOX_ROWS }
    }

    function InitBox() {
        var boxArray = Array(BOX_SIZE);
        for (var i = 0; i < BOX_SIZE; i++) {
            boxArray[i] = { position: i, value: i + 1, visible: true };
        }
        boxArray[BOX_SIZE - 1].visible = false;
        //console.log(boxArray);
        return boxArray
    }

    //function Box() {
    // eslint-disable-next-line
    //const [boxState, setBoxState] = useState(InitBox());


    const result = boxState.map((e) => doShuffle(e))
    //console.log(result);

    return (<div className="gamebox">

        {result}


    </div>)
}

export default Box;