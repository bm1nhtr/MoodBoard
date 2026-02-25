import React from 'react';
import './App.css'
import User from './components/User'
import { useUsers } from './hooks/useUsers';

function App() {

  const { data: users, loading } = useUsers();

  const usersList = users?.map( el => {
    return(
      <li>
      <React.Fragment key={el.id}>
        <User id={el.id} name={el.name} email={el.email} />
      </React.Fragment>
      </li>
      )
  })

  return (
    <>
      <h2>Test</h2>
      <User id="id-test" name="test-name" email="test@gmail.com"/>
      <h2>List of Users</h2>
      <ul className='users-list'>
      {loading ? <p>loading ...</p> : usersList}
      </ul>
    </>
  )
}

export default App
