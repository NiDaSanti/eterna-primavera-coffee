import React, {useState} from 'react'
import {
  Alert,
  AlertIcon,
  Box,
  Card,
  Container,
  Heading,
  useColorModeValue
} from '@chakra-ui/react'
import EarningsExpenseInfo from '../Components/EarningsExpenseInfo/earningsExpenseInfo'

const EternaDashboard = () => {
  return(
    <Box>
      <Card>
        <Heading size='md' textAlign='center' p={2}>Welcome to Eterna Primavera Landing.</Heading>
        <Alert status='info'>
          <AlertIcon />
          This is a monetary visualization tool. An easy way to keep count of your business earnings and expesnes.
        </Alert>
      </Card>
      <EarningsExpenseInfo/>
    </Box>
  )
}

export default EternaDashboard