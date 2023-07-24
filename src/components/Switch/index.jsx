import './style.css'

const Switch = ({onSwitchToggle, switchOn})=>{
    return (
        <>
        {// <div className="ml-3 mt-1 toggle-button-cover">
        // <div id="button-3" className="button r">
        //     <input className="checkbox" type="checkbox" onChange={onSwitchToggle} checked={switchOn}/>
        //     <div className="knobs"></div>
        //     <div className="layer"></div>
        // </div>
        }
        <input type="checkbox" id="checkboxInput" onChange={onSwitchToggle} checked={switchOn}/>
    <label htmlFor="checkboxInput" className="toggleSwitch ml-2">

<div className="speaker w-5">
    <img src="src\components\Switch\assets\sort-ascending.png" alt="asc" />
</div>

<div className="mute-speaker w-5">    
    <img src="src\components\Switch\assets\sort-descending.png" alt="desc" />
</div>

    </label>





    </>
    );
}

export default Switch