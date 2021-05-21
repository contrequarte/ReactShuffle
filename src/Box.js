import React, { useState } from "react";
import './Box.css';
import ShuffleButton from "./ShuffleButton";

const BOX_ROWS = 4;
const BOX_SIZE = BOX_ROWS * BOX_ROWS;

function Box() {

    const [boxState, setBoxState] = useState(InitBox());

    // Array Mixing Part required for creating a mixed box, which is solvable Begin-------------------------------------------------------------------------------------------

    function GetNewFreePos(ar, freeCell_rc) {
        var a01 = ar.filter(c => (c.position !== freeCell_rc.absolutePosition)).map(c => ({ ...c }));
        var a02 = a01.map(c => GetRowCol(c.position));
        var a03 = a02.filter(c => ((c.row === freeCell_rc.row) || (c.col === freeCell_rc.col))).map(d => d.absolutePosition); //getting cells being movable

        var retVal = a03[Math.floor(Math.random() * 6)]; // picking a random value out of the cells being movable

        return GetRowCol(retVal);
    }

    function moveBlocks(curFree, newFree, arr) {
        var arrCopy = arr.map(c => ({ ...c }));
        var pos;

        if (newFree.row === curFree.row) {
            //horizontal move
            if (newFree.col > curFree.col) {// move to left
                for (pos = curFree.absolutePosition; pos < newFree.absolutePosition; pos++) {
                    arrCopy[pos].value = arr[pos + 1].value;
                }
            } else {// move to right
                for (pos = curFree.absolutePosition; pos > newFree.absolutePosition; pos--) {
                    arrCopy[pos].value = arr[pos - 1].value;
                }
            }
        } else {
            if (newFree.row > curFree.row) {// move up
                for (pos = curFree.absolutePosition; pos < newFree.absolutePosition; pos += BOX_ROWS) {
                    arrCopy[pos].value = arr[pos + BOX_ROWS].value;
                }
            } else {// move down
                for (pos = curFree.absolutePosition; pos > newFree.absolutePosition; pos -= BOX_ROWS) {
                    arrCopy[pos].value = arr[pos - BOX_ROWS].value;
                }
            }
        }
        arrCopy[newFree.absolutePosition].visible = false;
        arrCopy[curFree.absolutePosition].visible = true;
        return arrCopy.map(c => ({ ...c }));
    }

    function MixIt() {

        var a = [];
        var currentFreeCell_rc = GetRowCol(15); // first free position
        var newFreeCell_rc;
        a = InitBox();

        for (var r = 1; r < 101; r++) {
            newFreeCell_rc = GetNewFreePos(a, currentFreeCell_rc);
            console.log(newFreeCell_rc)
            a = moveBlocks(currentFreeCell_rc, newFreeCell_rc, a);
            currentFreeCell_rc = GetRowCol(newFreeCell_rc.absolutePosition)
        }
        setBoxState(a.map(c => ({ ...c })));
    }
    // Array Mixing Part End---------------------------------------------------------------------------------------------

    function doShuffle(cell) {
        return <ShuffleButton key={cell.position} position={cell.position} number={cell.value} onShuffleClick={ShuffleClick} isVisible={cell.visible} />
    }

    function ShuffleClick(e) {
        const clickPosition = GetRowCol(e.target.attributes.position.value);

        const freePosition = GetRowCol(boxState.filter(c => !c.visible)[0].position);

        if (clickPosition.row === freePosition.row) {
            MoveHorizontally(clickPosition, freePosition);
        } else {
            if (clickPosition.col === freePosition.col) {
                MoveVertically(clickPosition, freePosition);
            }
        }
    }

    function MoveHorizontally(cPos, fPos) {
        setBoxState(prevBoxState => {
            return HorizontalArrayMoving(cPos, fPos, prevBoxState)
        });
    }

    function HorizontalArrayMoving(cPos, fPos, oldBoxState) {
        var boxCopy = oldBoxState.map(c => ({ ...c }));
        var pos;
        if (cPos.col > fPos.col) {// move to left
            for (pos = fPos.absolutePosition; pos < cPos.absolutePosition; pos++) {
                boxCopy[pos].value = oldBoxState[pos + 1].value;
            }
        } else {// move to right
            for (pos = fPos.absolutePosition; pos > cPos.absolutePosition; pos--) {
                boxCopy[pos].value = oldBoxState[pos - 1].value;
            }
        }
        boxCopy[cPos.absolutePosition].visible = false;
        boxCopy[fPos.absolutePosition].visible = true;
        return boxCopy.map(c => ({ ...c }));
    }

    function MoveVertically(cPos, fPos) {
        setBoxState(prevBoxState => {
            return VerticalArrayMoving(cPos, fPos, prevBoxState)
        });
    }

    function VerticalArrayMoving(cPos, fPos, oldBoxState) {
        var boxCopy = oldBoxState.map(c => ({ ...c }));
        var pos;
        if (cPos.row > fPos.row) {// move up
            for (pos = fPos.absolutePosition; pos < cPos.absolutePosition; pos += BOX_ROWS) {
                boxCopy[pos].value = oldBoxState[pos + BOX_ROWS].value;
            }
        } else {// move down
            for (pos = fPos.absolutePosition; pos > cPos.absolutePosition; pos -= BOX_ROWS) {
                boxCopy[pos].value = oldBoxState[pos - BOX_ROWS].value;
            }
        }
        boxCopy[cPos.absolutePosition].visible = false;
        boxCopy[fPos.absolutePosition].visible = true;
        return boxCopy.map(c => ({ ...c }));
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
        boxArray[BOX_SIZE - 1].value = -1;
        return boxArray.map(c => ({ ...c }));
    }

    const result = boxState.map((e) => doShuffle(e))

    return (<div>
        <div className="gamebox">
            {result}
        </div>
        <button onClick={MixIt}>Mix it!</button>
    </div>)
}

export default Box;