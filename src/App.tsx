import './App.css'
import { useState } from 'react';
import Landing from './pages/Landing'
import Loader from './components/global/Loader';

function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className=''>
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      <Landing />
    </div>
  )
}

export default App