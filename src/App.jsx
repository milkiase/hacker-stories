import * as React from 'react'

const initialStories = [
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
]
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
  // const [isLoading, setIsLoading] = React.useState(false)
  // const [thereIsError, setThereIsError] = React.useState(false)
  const getAsyncStories = new Promise((resolve, reject)=>{
    setTimeout(()=>{
      resolve({data: {
        stories: initialStories
      }})
      reject()
    }, 2000)
  })
  React.useEffect(()=>{
    // setIsLoading(true)
    dispatchStories({
      type: storiesFetchInit
    })
    getAsyncStories.then((response)=>{
      dispatchStories({
        type : storiesFetchSuccess,
        payload: response.data.stories
      })
      // setIsLoading(false)
    }).catch(()=>{
      dispatchStories({
        type: storiesFetchFail
      })
      // setThereIsError(true)
      // setIsLoading(false)
    })
  }, [])
  const useStateStorage = (key, initialState)=>{
    const [value, setValue] = React.useState(localStorage.getItem(key) ?? initialState)
    React.useEffect(()=>{
      localStorage.setItem(key, value)
    }, [value, key])
    return [value, setValue]
  }
  const [searchTerm, searchTermHandler] = useStateStorage('seachTerm', 'React')
  const searchedStories = stories.data.filter((story)=>story.title.toLowerCase().includes(searchTerm.toLowerCase()))
  
  const handleSearch = (event)=>{
    searchTermHandler(event.target.value)
  }
  const resetSearchTerm = ()=>{
    searchTermHandler('react')
  }
  const handleRemoveStory = (_id)=>{
    dispatchStories({
      type: removeStory,
      payload: _id
    })
  }
  
  return <>
            <InputWithText id='search'  onValueChange={handleSearch} value={searchTerm} autoFocus>
              <strong>Search :</strong>
            </InputWithText>
            <BaseBtn onClick={resetSearchTerm} classValue=' bg-teal-600 rounded-sm ml-3 px-2 py-1'>Reset</BaseBtn>
            {stories.isError && <p className=' text-red-800'>OOops.. there have been some server/network error.</p>}
            {stories.isLoading ? <span className="relative block">
                          <div type="div" className="inline-flex items-center px-4 py-2 font-semibold leading-6 border ml-16 mt-4 rounded-md text-sky-500 bg-white transition ease-in-out duration-150 cursor-not-allowed ring-1 ring-slate-900/10 dark:ring-slate-200/20" >
                            Loading stories...
                          </div>
                          <span className="flex absolute h-3 w-3 top-0 right-0 mt-3 -mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                          </span>
                        </span> : <List list={searchedStories} onItemRemove={handleRemoveStory}/>}
        
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
const BaseBtn = ({children, onClick, classValue})=>{
  return (
    <button type="button" onClick={onClick} className={classValue}>{children}</button>
  )
}
export default App
