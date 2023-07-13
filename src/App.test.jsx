import {describe, it, expect} from 'vitest'
import { storiesReducer } from "./App.jsx";
const storyOne = {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
}
const storyTwo = {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
}
const stories = [storyOne, storyTwo]

describe('storiesReducer', ()=>{
    it('removes a story from all the stories', ()=>{
        const state = {
            data : stories,
            isLoading: false,
            isError: false
        }
        const action = {
            type: 'REMOVE_STORY',
            payload: storyTwo.objectID
        }
        const newState = storiesReducer(state, action)
        const expectedState = {
            data: [storyOne],
            isLoading: false,
            isError: false
        }
        expect(newState).toStrictEqual(expectedState)
    });
    it('set isLoading to true on FetchInit', ()=>{
        const state = {
            data: [],
            isLoading: false,
            isError: true
        }
        const action = {
            type: 'STORIES_FETCH_INIT'
        }
        const newState = storiesReducer(state, action)
        const expectedState = {
            data: [],
            isError: false,
            isLoading: true
        }
        expect(newState).toStrictEqual(expectedState)
    });
    it('fetch success test', ()=>{
        const state = {
            data: [],
            isLoading: true,
            isError: true
        }
        const action = {
            type: 'STORIES_FETCH_SUCCESS',
            payload: stories
        }
        const newState = storiesReducer(state, action)
        const expectedState = {
            data: stories,
            isError: false,
            isLoading: false
        }
        expect(newState).toStrictEqual(expectedState)
    });
    it('fetch stories Failed', ()=>{
        const state = {
            data: [],
            isLoading: true,
            isError: false
        }
        const action = {
            type: 'STORIES_FETCH_FAIL'
        }
        const expectedState = {
            data: [],
            isLoading: false,
            isError: true
        }
        const newState = storiesReducer(state, action)
        expect(newState).toStrictEqual(expectedState)
    })
})