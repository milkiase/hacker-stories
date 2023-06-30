import * as React from 'react'
import axios from 'axios'
const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='
// const initialStories = [
//   {
//   title: 'React',
//   url: 'https://reactjs.org/',
//   author: 'Jordan Walke',
//   num_comments: 3,
//   points: 4,
//   objectID: 0,
//   },
//   {
//   title: 'Redux',
//   url: 'https://redux.js.org/',
//   author: 'Dan Abramov, Andrew Clark',
//   num_comments: 2,
//   points: 5,
//   objectID: 1,
// },
// ]
const [storiesFetchInit, storiesFetchSuccess, storiesFetchFail, removeStory] = ['STORIES_FETCH_INIT', 'STORIES_FETCH_SUCCESS', 'STORIES_FETCH_FAIL', 'REMOVE_STORY']
const storiesReducer = (state, action)=>{
  switch (action.type){
    case storiesFetchInit:
      return {...state, isLoading: true, isError: false}
    case storiesFetchSuccess:
      return {...state, isLoading: false, isError: false, data: action.payload}
    case storiesFetchFail:
      return {...state, isLoading: false, isError: true}
    case removeStory:
      return {...state, isLoading: false, isError: false, data: state.data.filter((story)=>story.objectID != action.payload)}
    default:
      throw new Error()
  }
}
const App = ()=>{
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {data: [], isLoading: false, isError: false});
  const useStateStorage = (key, initialState)=>{
    const [value, setValue] = React.useState(localStorage.getItem(key) ?? initialState)
    React.useEffect(()=>{
      localStorage.setItem(key, value)
    }, [value, key])
    return [value, setValue]
  }
  const [searchTerm, searchTermHandler] = useStateStorage('seachTerm', 'React')
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`)
  const handleFetchStories = React.useCallback(async ()=>{
    dispatchStories({
      type: storiesFetchInit
    })
    try {
      const result = await axios.get(url)
      dispatchStories({
        type : storiesFetchSuccess,
        payload: result.data.hits
      })
    } catch{
      dispatchStories({
        type: storiesFetchFail
      })
    }
    
  }, [url])
  React.useEffect(()=>{
    handleFetchStories()
  }, [handleFetchStories])
  
  // const searchedStories = stories.data.filter((story)=>story.title.toLowerCase().includes(searchTerm.toLowerCase()))
  
  const handleSearchInput = (event)=>{
    searchTermHandler(event.target.value)
  }
  const handleSearchSubmit = (event)=>{
    event.preventDefault();
    // searchTermHandler('react')
    if(!searchTerm) return;
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  }
  const handleRemoveStory = (_id)=>{
    dispatchStories({
      type: removeStory,
      payload: _id
    })
  }
  
  return <>
            <SearchForm onSearchSubmit={handleSearchSubmit} onSearchInput={handleSearchInput} searchTerm={searchTerm} />
            {stories.isError && <p className=' text-red-800'>OOops.. there have been some server/network error.</p>}
            {stories.isLoading ? <span className="relative block">
                          <div type="div" className="inline-flex items-center px-4 py-2 font-semibold leading-6 border ml-16 mt-4 rounded-md text-sky-500 bg-white transition ease-in-out duration-150 cursor-not-allowed ring-1 ring-slate-900/10 dark:ring-slate-200/20" >
                            Loading stories...
                          </div>
                          <span className="flex absolute h-3 w-3 top-0 right-0 mt-3 -mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                          </span>
                        </span> : <List list={stories.data} onItemRemove={handleRemoveStory}/>}
        
      </>
}

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

const InputWithText = ({id, children, type = 'text', value, onValueChange, autoFocus})=>{
  const inputRef = React.useRef()
  React.useEffect(()=>{
    if(autoFocus && inputRef.current){
      inputRef.current.focus()
    }
  }, [autoFocus])
  return (
    <>
      <label htmlFor={id}>{children} </label>
      <input onChange={onValueChange} type={type} value={value} id={id} ref={inputRef}
              className=" px-2 py-1 border rounded-sm border-gray-950"/>
    </>
  );
}
const BaseBtn = ({children, onClick, classValue, type='button'})=>{
  return (
    <button type={type} onClick={onClick} className={classValue}>{children}</button>
  )
}

const SearchForm = ({onSearchSubmit, onSearchInput, searchTerm})=>{
  return (
    <form onSubmit={onSearchSubmit}>
      <InputWithText id='search'  onValueChange={onSearchInput} value={searchTerm} autoFocus>
                <strong>Search :</strong>
              </InputWithText>
              <BaseBtn type='submit' disabled={!searchTerm}
                        classValue=' bg-teal-600 rounded-sm ml-3 px-2 py-1'>Submit</BaseBtn>
    </form>
  );
}
export default App
