import BaseBtn from "./BaseBtn";

const List = ({list, onItemRemove})=>{
    return (
      <ul>
        {
          list.map((element)=>  <Item key={element.objectID} {...element} onRemoveSelf={onItemRemove}></Item>)
        }
      </ul>
    );
  }

  const Item = ({url, title, author, num_comments, points, objectID, onRemoveSelf})=>
      {
        return (<div>
        <li className=" ">
          <span>
            <a className=" text-blue-700" href={url} target="_blank" rel="noopener noreferrer">{title}</a>
            <BaseBtn classValue="px-2 mt-1 mx-3 bg-red-500 hover:bg-red-600 text-white" onClick={()=>onRemoveSelf(objectID)}>X</BaseBtn>
          </span>
          <br />Authors: <span>{author} </span>
          <br />Comments: <span> {num_comments} </span>
          <br />Points: <span> {points} </span>
        </li>
        <hr />
      </div>)}

export default List;
export {Item}