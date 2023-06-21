import * as React from 'react'


const App = ()=>{
  const stories = [
    {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
    },
    {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
  ];
  const [searchTerm, searchTermHandler] = React.useState('react')
  const searchedStories = stories.filter((story)=>story.title.toLowerCase().includes(searchTerm.toLowerCase()))
  
  const handleSearch = (event)=>{
    searchTermHandler(event.target.value)
  }
  const resetSearchTerm = ()=>searchTermHandler('react')
  return <div className="">
        <Search onSearch={handleSearch} searchTerm={searchTerm} className=' mt-12' /> 
        <button onClick={resetSearchTerm} className=' bg-teal-600 rounded-sm ml-3 px-2 py-1'>Reset</button>
        <List list={searchedStories}/>
      </div>
}

const List = ({list})=>
    <ul>
      {
        list.map(({objectID, ...element})=>  <Item key={objectID} {...element}></Item>)
      }
    </ul>

const Item = ({url, title, author, num_comments, points})=>
    <div>
      <li className=" ">
        <span>
          <a className=" text-blue-700" href={url} target="_blank" rel="noopener noreferrer">{title}</a>
        </span>
        <br />Authors: <span>{author} </span>
        <br />Comments: <span> {num_comments} </span>
        <br />Points: <span> {points} </span>
      </li>
      <hr />
    </div>

const Search = ({searchTerm, onSearch})=>{
  return (
    <>
      <label htmlFor="message">Search: </label>
      <input onChange={onSearch} type="text" value={searchTerm} id="message" className=" px-2 py-1 border rounded-sm border-gray-950"/>
    </>
  );
}
    
  
export default App
