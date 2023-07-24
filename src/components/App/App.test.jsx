import {describe, it, expect, vi} from 'vitest'
import App, { storiesReducer } from "./index.jsx";
import SearchForm from '../../components/SearchForm.jsx';
import List, {Item} from '../../components/List.jsx';
import {
    render,
    screen,
    fireEvent,
    waitFor
} from '@testing-library/react'
import axios from 'axios';
vi.mock('axios')
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

describe('Item', ()=>{
    it('renders all properties', ()=>{
        render(<Item {...storyOne}></Item>);
        // screen.debug()
        expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
        expect(screen.getByText('React')).toHaveAttribute('href', 'https://reactjs.org/')
    })
    it('renders a clickble dismiss button', ()=>{
        render(<Item {...storyOne}/>)
        expect(screen.getByRole('button')).toBeInTheDocument()
    });
    it('remove handler function is being called', ()=>{
        const handleRemoveItem = vi.fn();
        render(<Item {...storyOne} onRemoveSelf={handleRemoveItem}/>);
        fireEvent.click(screen.getByRole('button'));
        expect(handleRemoveItem).toHaveBeenCalledTimes(1);
    })
})

describe('SearchForm', ()=>{
    const searchFormProps = {
        searchTerm : 'React',
        onSearchSubmit: vi.fn(),
        onSearchInput: vi.fn()
    }
    it('it renders the input field with its value', ()=>{
        render(<SearchForm {...searchFormProps}/>)
        // screen.debug()
        expect(screen.getByDisplayValue('React')).toBeInTheDocument()
    });
    it('renders the correct label', ()=>{
        render(<SearchForm {...searchFormProps}></SearchForm>)
        expect(screen.getByLabelText(/Search/)).toBeInTheDocument()
    });
    it('calls onSearchInput on input change', ()=>{
        render(<SearchForm {...searchFormProps}></SearchForm>)
        fireEvent.change(screen.getByDisplayValue('React'), {target: {value: 'Redux'}})
        expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1)
    });
    it('calls onSeachSubmit on button click', ()=>{
        render(<SearchForm {...searchFormProps} />)
        fireEvent.click(screen.getByRole('button'))
        expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1)
        // expect(searchFormProps.onSearchSubmit).toHaveBeenCalledWith('React')
    });
    it('renders snapshots', ()=>{
        const {container} = render(<SearchForm {...searchFormProps} />)
        expect(container.firstChild).toMatchSnapshot()
    })
})

describe('List', ()=>{
    it('renders all items', ()=>{
        render(<List list={stories}></List>)
        expect(screen.getAllByText(/Comments/)[1]).toBeInTheDocument()
    });
    it('renders snapshot', ()=>{
        const {container} = render(<List list={stories}/>)
        expect(container.firstChild).toMatchSnapshot()
    })
});

describe('App', ()=>{
    it('succeeds fetching data', async ()=>{
        const promise = Promise.resolve({data: {hits: stories}})

        axios.get.mockImplementationOnce(()=> promise);
        render(<App></App>)
        // screen.debug()
        expect(screen.getByText(/Loading/)).toBeInTheDocument();
        await waitFor(async ()=>await promise);
        // screen.debug()
        expect(screen.queryByText(/Loading/)).toBeNull()
        expect(screen.getByText('React')).toBeInTheDocument()
        expect(screen.getByText('Redux')).toBeInTheDocument()
        expect(screen.getAllByText(/Comments:/).length).toBe(2)
    });
    
    it('fails fetching data', async ()=>{
        const promise = Promise.reject()
        axios.get.mockImplementationOnce(()=> promise)
        render(<App></App>)
        expect(screen.getByText(/Loading/)).toBeInTheDocument()
        try{
            await waitFor(async()=>await promise)
        }catch(error){
            expect(screen.queryByText(/Loading/)).toBeNull()
            expect(screen.getByText(/error/)).toBeInTheDocument()
        }
    });

    it('removes an item when dismiss button is clicked', async ()=>{
        const promise = Promise.resolve({data: {hits: stories}})
        axios.get.mockImplementationOnce(()=> promise)

        render(<App></App>)
        expect(screen.getByText(/Loading/)).toBeInTheDocument();
        await waitFor(async()=> await promise);
        expect(screen.queryByText(/Loading/)).toBeNull()
        expect(screen.queryByText('OOops.. there have been some server/network error.')).toBeNull()

        expect(screen.getByText(/Jordan Walke/)).toBeInTheDocument()
        fireEvent.click(screen.getAllByRole('button')[1])
        expect(screen.queryByText(/Jordan Walke/)).toBeNull()
    });
    it('searches for specific stories', async ()=>{
        const anotherStory = {
            title: 'JavaScript',
            url: 'https://en.wikipedia.org/wiki/JavaScript',
            author: 'Brendan Eich',
            num_comments: 15,
            points: 10,
            objectID: 3,
            };
        const reactPromise = Promise.resolve({data: {hits: stories}})
        const jsPromise = Promise.resolve({data: {hits: [anotherStory]}})
        axios.get.mockImplementation((url)=>{
            if(url.includes('React')){
                return reactPromise
            }else if(url.includes('Javascript')){
                return jsPromise
            }else{
                throw Error
            }
        })
        render(<App></App>)
        expect(screen.getByText(/Loading/)).toBeInTheDocument()
        await waitFor(async ()=> await reactPromise)
        expect(screen.getByText('React')).toBeInTheDocument()
        expect(screen.queryByText(/Loading/)).toBeNull()
        expect(screen.getByText('Jordan Walke')).toBeInTheDocument()
        expect(screen.getByText('Dan Abramov, Andrew Clark')).toBeInTheDocument()

        expect(screen.getByDisplayValue('React')).toBeInTheDocument()
        fireEvent.change(screen.getByDisplayValue('React'), {target: {value: 'Javascript'}})
        expect(screen.getByDisplayValue('Javascript')).toBeInTheDocument()
        expect(screen.queryByDisplayValue('React')).toBeNull()
        expect(screen.queryByText('Brendan Eich')).toBeNull()

        fireEvent.submit(screen.getByText('Submit'))
        await waitFor(async()=>await jsPromise)
        expect(screen.queryByText('Jordan Walke')).toBeNull()
        expect(screen.queryByText('Dan Abramov, Andrew Clark')).toBeNull()
        expect(screen.getByText('Brendan Eich')).toBeInTheDocument()
    });
});
