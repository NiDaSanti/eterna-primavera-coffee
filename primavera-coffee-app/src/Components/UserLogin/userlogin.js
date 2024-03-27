import React, {useState} from 'react'
import coffeeCup from '../../Images/coffee-cup.jpg'
import {
  Box,
  Button,
  Card,
  Center, 
  Container,
  Image,
  Input,
  Text,
  VStack
} from '@chakra-ui/react'

const UserLogin = ({setAuthenticated}) => {

  const RESPONSE_URL = process.env.REACT_APP_LOGIN_API_URL
  const [primaCredential, setPrimaCredential] = useState({
    userName: '',
    password: ''
  })
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setPrimaCredential((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const requestBody = {
        alias: primaCredential.userName,
        password: primaCredential.password
      }
      const response = await fetch(RESPONSE_URL, {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if(response.ok) {
        const data = await response.json()
        setMessage(data.message)
        setAuthenticated(true)
      } else {
        const errorMessage = await response.text()
        console.log('Error message:', errorMessage)
        setMessage('Check again foo! ', errorMessage)
      }
      
    } catch(error) {
      setMessage(`Error occured: ${error}`)
    }
  }
  return(
    <Card p={2}>
      <VStack>
        <Center h='100vh'>
          <Container p={3} maxW='container.sm'>
            <Center>
              <Text color='rgba(92, 64, 51, 1)' fontSize='2xl'>Eterna Primavera.</Text>
            </Center>
            <Center>
              <Image borderRadius='full' p={3} src={coffeeCup} boxSize='250px' alt='Cup of Coffee' />
            </Center>
            <Input mt={3} variant='flushed' p={3} type="text" name="userName" placeholder="Which prima are you?" value={primaCredential.userName} onChange={handleChange} />
            <Input variant='flushed' p={3} type="password" name="password" placeholder="Password" value={primaCredential.password} onChange={handleChange} />
            <Button size='lg' variant='outline' mt={3} colorScheme='pink' onClick={handleLogin}>Login</Button>
          </Container>
        </Center>
      </VStack>
    </Card>
  )
}

export default UserLogin