const BaseBtn = ({children, onClick, classValue, type='button'})=>{
    return (
      <button type={type} onClick={onClick} className={classValue}
      >{children}</button>
    )
  }

export default BaseBtn