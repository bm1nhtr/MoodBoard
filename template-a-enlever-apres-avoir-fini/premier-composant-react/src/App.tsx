import { type FC } from 'react'
import './App.css'

const Header = () => {
  return(
    <>
      <header>
          <img src="src/assets/react.svg" className="logo react" alt="React logo" />
          <h1>Bienvenue sur ma page React</h1>
        </header>
    </>
  )
}

const App: FC = () => {

  return (
    <div>
      <Header />
      <main>
          <h2>À propos</h2>
          <p>Ceci est un paragraphe de texte pour illustrer une page HTML basique.</p>
          <p>Vous pouvez ajouter autant de paragraphes que nécessaire.</p>

          <h2>Autre section</h2>
          <p>Voici une autre section avec un titre et un paragraphe.</p>
      </main>
    </div>  
  )
}

export default App
