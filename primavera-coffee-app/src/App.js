import React, {useState} from 'react'
import UserLogin from './Components/UserLogin/userlogin';
import EternaDashboard from './EternaDashboard/eternaDashboard'
import { ChakraProvider } from '@chakra-ui/react'
import './App.css';

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  return (
    <ChakraProvider>
      {authenticated ? (<EternaDashboard/>) : (<UserLogin setAuthenticated={setAuthenticated}>Account Locked.</UserLogin>)}
    </ChakraProvider>
  );
}

export default App;