import { useState } from 'react';
import './style.css'

const Options = ({options, onOptionChange})=>{
    const [current, setCurrent] = useState('None')
    const handleInputChange = (event)=>{
        setCurrent(event.target.value);
        onOptionChange(event.target.value);
    }
    return(
        <div className="wrapper flex flex-wrap pb-1 md:pb-0">
            {options.map((option)=> <div className="option" key={option}>
                    <input className="input" type="radio" name="btn" value={option} checked={(current == option)}
                        onChange={handleInputChange}/>
                    <div className="btn">
                    <span className="span px-3">{option}</span>
                    </div>
                </div>)}
        
        {/* <div class="option">
            <input class="input" type="radio" name="btn" value="option2">
            <div class="btn">
            <span class="span">Option</span>
            </div>  </div>
        <div class="option">
          <input class="input" type="radio" name="btn" value="option3">
          <div class="btn">
            <span class="span">Option</span>
          </div>  
        </div> */}
    </div>
    );
}

export default Options;