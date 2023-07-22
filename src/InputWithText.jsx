import React from "react";

const InputWithText = ({id, children, type = 'text', value, onValueChange, autoFocus})=>{
    const inputRef = React.useRef()
    React.useEffect(()=>{
      if(autoFocus && inputRef.current){
        inputRef.current.focus()
      }
    }, [autoFocus])
    return (
      <div>
        <label htmlFor={id}>{children} </label>
        <input onChange={onValueChange} type={type} value={value} id={id} ref={inputRef}
                className=" px-2 py-1 border rounded-sm border-gray-950"/>
      </div>
    );
  }

export default InputWithText