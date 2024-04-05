import React from 'react'
import {
  Box,
  Card,
  Center,
  Divider,
  Heading,
  Skeleton,
  Stack,
  Text,
  Wrap,
  WrapItem,
  useColorModeValue
} from '@chakra-ui/react'



const EntityEntryInfo = ({earningsView, expenseView, loading}) => {
  const entityEntriesTabBackgroundColor = useColorModeValue('pink.50')
  const expenseArray = expenseView.expenses || []

  function convertDates(utc) {
    const date = new Date(utc)
    let year = date.getFullYear()
    let day = date.getDay()
    let month = date.getMonth()
    let hour = date.getHours()
    let minute = date.getMinutes()
    const second = date.getSeconds()
    if(month < 10)  {
      month = `0${month}`
    } 
    if(day < 10) {
      day = `0${day}`
    }
    day = day 
    return `Submitted on ${month}/${day}/${year} @ ${hour}:${minute}:${second}`
  }
  return(
  <Box bg={entityEntriesTabBackgroundColor}>
    <Skeleton isLoaded={!loading}>
      <Wrap>
        {expenseArray.map(view => (
          <WrapItem>
            <Card m={4} p={3} key={view.id}>
              <Stack direction='row' h='100px' p={4}>
                <Divider orientation='vertical' />
                <Heading size='md'>{view.fields.entity}</Heading>
                <Text>{view.createdTime}</Text>
              </Stack>
                <Text>{view.fields.vendor}</Text>
                <Divider orientation='horizontal' />
                <Text>{view.fields.product}</Text>
                <Divider orientation='horizontal' />
                <Heading size="sm">$ {view.fields.expenseAmount}</Heading>
                <Divider orientation='horizontal' />
            </Card>
          </WrapItem>
        ))}
      </Wrap>
    </Skeleton>
  </Box>
  )
}

export default EntityEntryInfo