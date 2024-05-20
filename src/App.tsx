import ListGroup from './Components/ListGroup'

function App() {
  let items = ['Go shopping', 'throw rubbish away', 'learn to code', 'Finish the project presentation', 'Review and merge pull requests'];

  return (
    <>
      <div><ListGroup heading="To-Do List" items={items}/></div>
    </>
  )
}

export default App;