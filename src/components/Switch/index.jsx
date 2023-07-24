import './style.css'

const Switch = ({onSwitchToggle, switchOn})=>{
    return (
        <>
        <input type="checkbox" id="checkboxInput" onChange={onSwitchToggle} checked={switchOn}/>
    <label htmlFor="checkboxInput" className="toggleSwitch ml-2">

<div className="speaker w-5">
    <img src="https://img.icons8.com/?size=512&id=kK48r4Y0UNpR&format=png" alt="asc" />
</div>

<div className="mute-speaker w-5">    
    <img src="https://img.icons8.com/?size=512&id=31487&format=png" alt="desc" />
</div>

    </label>





    </>
    );
}

export default Switch