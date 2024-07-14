import React from 'react'
import {
  Alert,
  AlertIcon,
  Box,
  Heading,
  Skeleton,
  Text,
  VStack,
  useColorModeValue
} from '@chakra-ui/react'

const EntityEntryInfo = ({earningsView, expenseView, loading}) => {
  const entityEntriesTabBackgroundColor = useColorModeValue('pink.50')
  const expenseArray = expenseView.expenses || []

  function convertDates(utc) {
    const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
    const date = new Date(utc)
    let year = date.getFullYear()
    let day = date.getDate()
    let month = months[date.getMonth()]
    return `${month} ${day}, ${year}`
  }

  return(
  <Box bg={entityEntriesTabBackgroundColor}>
    <Skeleton isLoaded={!loading}>
      <Alert status='info' variant='subtle'>
        <AlertIcon />
        <Text>This is a beta version. More features coming soon.</Text>
      </Alert>
      <Alert status='warning' variant='subtle'>
        <AlertIcon />
        <Text>IMPORTANT: The contents below indicates a record of contributions per person. Please ensure all inforamtion is accurate.</Text>
      </Alert>
      <VStack spacing={4} align='stretch'>
        {expenseArray.map(view => (
            <Box h='90px' bg='#ffffff' key={view.id}>
		{/*<Divider orientation='vertical' /> */}
		<Heading size='md'>{view.fields.vendor}</Heading>
                <Text size='md'>{view.fields.entity}</Text>
                <Text>{convertDates(view.createdTime)}</Text>
                <Heading size='sm'>{view.fields.expenseAmount}</Heading>
		{/*<Divider orientation='horizontal' / >
                <Text>{view.fields.product}</Text>
                <Divider orientation='horizontal' />
                <Heading size="sm">$ {view.fields.expenseAmount}</Heading>
                <Divider orientation='horizontal' />*/}
            </Box>
        ))}
     </VStack>
    </Skeleton>
  </Box>
  )
}

export default EntityEntryInfo
