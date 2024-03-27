import React, {useState, useRef} from 'react'
import {
  Box,
  Button,
  Card,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Textarea
} from '@chakra-ui/react'

const EarningsForm = ({updateEarnings}) => {
  const [earningsFormData, setEarningsFormData] = useState({
    earningsAmount: '',
    entity: '',
    notes: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const selectRef = useRef(null)

  const handleChange = (e) => {
    const {name, value} = e.target
    setEarningsFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleEntityEntryChange = (e) => {
    const entityEntry = e.target.value
    setEarningsFormData({...earningsFormData, entity: entityEntry})
  }

  const handleSubmit = async (e, data) => {
    e.preventDefault()
    try {
      const earningFormDataObject = {
        earningsAmount: earningsFormData.earningsAmount,
        entity: earningsFormData.entity,
        notes: earningsFormData.notes
      }

      if(earningsFormData.earningsAmount && earningsFormData.entity && earningsFormData.notes) {
        setLoading(true)
        const response = await fetch(`http://localhost:3001/api/create-earning/earning`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(earningFormDataObject)
        })

        if(response.ok) {
          // const responseData = await response.json()
          setEarningsFormData({
            earningsAmount: '',
            entity: '',
            notes: ''
          })
          setLoading(false)
          updateEarnings(prevEarnings => prevEarnings + parseFloat(earningsFormData.earningsAmount))
        }

        if(selectRef.current) {
          selectRef.current.value = 'Select Entity'
        }

      }
    } catch(err) {
      console.error(`Failed to create earnings record ${err}`)
      setErrorMessage(`Failed to create earnings record ${err}`)
    }
  }
  return(
    <Card p={2}>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <Heading size='md'>Earnings Form.</Heading>
          <FormLabel>Amount</FormLabel>
            <NumberInput max={999} min={1}>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  color='gray.300'
                  fontSize='1.2em'
                >$
                </InputLeftElement>
              <NumberInputField paddingLeft={7} type='text' name='earningsAmount' value={earningsFormData.earningsAmount} onChange={handleChange}/>
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
              </InputGroup>
            </NumberInput>
            <FormHelperText>Add total earnings amount for the week.</FormHelperText>
          <FormLabel>Entity</FormLabel>
            <Select placeholder='Select Entity' name='entity' id='entity' value={earningsFormData.entity} onChange={handleEntityEntryChange} ref={selectRef}>
              <option>Alice</option>
              <option>Damaris</option>
              <option>Joanna</option>
            </Select>
            <FormHelperText>Which prima is creating this record?</FormHelperText>
            <FormLabel>Describe the earnings.</FormLabel>
            <Textarea placeholder='Add context of the event. (Ex...)Think of any new possible leads.' type='text' name='notes' value={earningsFormData.notes} onChange={handleChange}/>
            <Button
              isLoading={loading}
              type='submit'
              loadingText='Submitting'
              colorScheme='pink'
              variant='outline'
              mt={2}
            >
              Submit
          </Button>
        </FormControl>
      </form>
    </Card>
  )
}

export default EarningsForm