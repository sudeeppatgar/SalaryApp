import { useState } from 'react'

// import './App.css'
import SalaryApp from './Component/SalaryApp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <SalaryApp/>
    </>
  )
}

export default App
