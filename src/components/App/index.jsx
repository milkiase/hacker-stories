/* eslint-disable react-refresh/only-export-components */
import * as React from 'react'
import axios from 'axios'
import { sortBy } from 'lodash'

import List from '../List'
import SearchForm from '../SearchForm'
import Options from "../Options";
import Switch from '../Switch';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='
const SORT_KEY_MAPPING = {
  None: '',
  Title: 'title',
  Author: 'author',
  Comments: 'num_comments',
  Points: 'points'
}

const [storiesFetchInit, storiesFetchSuccess, storiesFetchFail, removeStory] = ['STORIES_FETCH_INIT', 'STORIES_FETCH_SUCCESS', 'STORIES_FETCH_FAIL', 'REMOVE_STORY']
const storiesReducer = (state, action)=>{

  switch (action.type){
    case storiesFetchInit:
      return {...state, isLoading: true, isError: false}
    case storiesFetchSuccess:
      return {...state, isLoading: false, isError: false, isSorted: false, data: action.payload}
    case storiesFetchFail:
      return {...state, isLoading: false, isError: true}
    case removeStory:
      return {...state, isLoading: false, isError: false, data: state.data.filter((story)=>story.objectID != action.payload)}
    case 'SORT_STORIES':
      if((state.data.length == 0) || (action.payload.sortBy == 'None')){
        return {...state, isSorted: true}
      }
      if(isNaN(state.data[0][SORT_KEY_MAPPING[action.payload.sortBy]])){
        if(action.payload.sortInDescending){
          return { ...state, isSorted: true, data: sortBy(state.data, SORT_KEY_MAPPING[action.payload.sortBy])}
        }else{
          return {...state, isSorted: true, data: sortBy(state.data, SORT_KEY_MAPPING[action.payload.sortBy]).reverse()}
        }
      }else{
        if(action.payload.sortInDescending){
          return { ...state, isSorted: true, data: sortBy(state.data, SORT_KEY_MAPPING[action.payload.sortBy]).reverse()}
        }else{
          return {...state, isSorted: true, data: sortBy(state.data, SORT_KEY_MAPPING[action.payload.sortBy])}
        }
      }
      
    default:
      throw new Error()
  }
}

const App = ()=>{
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {data: [], isLoading: false, isError: false, isSorted: false});
  const useStateStorage = (key, initialState)=>{
    const [value, setValue] = React.useState(localStorage.getItem(key) ?? initialState)
    React.useEffect(()=>{
      localStorage.setItem(key, value)
    }, [value, key])
    return [value, setValue]
  }
  const [searchTerm, searchTermHandler] = useStateStorage('seachTerm', 'React')
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`)
  // const [sort.isDescending, setIsDescending] = React.useState(true)
  const [sort, setSort] = React.useState({sortBy: 'None', isDescending: true})
  // const [sort.sortBy, setSortBy] = React.useState('None')
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
  
  const handleSortStory = React.useCallback(()=>{
    dispatchStories({
      type: 'SORT_STORIES',
      payload: {
        sortBy: sort.sortBy,
        sortInDescending: sort.isDescending
      }
    })
  }, [sort.isDescending, sort.sortBy])

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

  React.useEffect(()=>{
    if(!stories.isSorted){
      handleSortStory()
    }
  }, [stories, handleSortStory])

  React.useEffect(()=>{
    handleSortStory()
  }, [handleSortStory])
  
  return <div className='p-3'>
            <div className="flex flex-col gap-5 pb-4 border-b">
              <SearchForm onSearchSubmit={handleSearchSubmit} onSearchInput={handleSearchInput} searchTerm={searchTerm} />
              <div className="flex align-top text-xs">
                <Options options={['None', 'Title', 'Author', 'Comments', 'Points']} onOptionChange={(value)=>{setSort({sortBy: value, isDescending: sort.isDescending})}}></Options>
                {(sort.sortBy != 'None') && <Switch switchOn={sort.isDescending} onSwitchToggle={()=>{ setSort({sortBy: sort.sortBy, isDescending: !sort.isDescending}) }}></Switch>}
              </div>
            </div>
            {stories.isError && <p className=' text-red-800'>OOops.. there have been some server/network error.</p>}
            {stories.isLoading ? <span className="relative block">
                          <div type="div" className="inline-flex items-center px-4 py-2 font-semibold leading-6 border ml-16 mt-4 rounded-md text-sky-500 bg-white transition ease-in-out duration-150 cursor-not-allowed ring-1 ring-slate-900/10 dark:ring-slate-200/20" >
                            Loading stories...
                          </div>
                          <span className="flex absolute h-3 w-3 top-0 right-0 mt-3 -mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                          </span>
                        </span> : (
                          <List list={stories.data} onItemRemove={handleRemoveStory}/>
                        )}
        
      </div>
}


export default App
export {storiesReducer}