// import * as React from 'react'

function App() {
  const blockElements = [
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
  
  let favBooks = ['Rich dad poor dad', 'Get Strong', 'The Male Advantage', 'The Power of Habits', 'Can\'t Hurt Me', 'So Good They Cannot Ignore You']
  return (
      <div className="">
        <ul>
          {
            blockElements.map((element)=>{
              return (
                <li key={element.objectID}>
                  <span>
                    <a className=" text-blue-700" href={element.url} target="_blank" rel="noopener noreferrer">{element.title}</a>
                  </span>
                  <span>{element.author} </span>
                  <span> {element.num_comments} </span>
                  <span> {element.points} </span>
                </li>
              );
            })
          }
        </ul>
        <ul className=" list-disc">
          {
            favBooks.map((book, index)=>{
              return (<li className="list-disc" key={index}>{book}</li>)
            })
          }
        </ul>
        <label htmlFor="message">Message: </label>
        <input type="text" id="message" />
      </div>
  )
}

export default App
