import React, {useState, useRef} from 'react'
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Card,
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  NumberInput,
  // NumberInputField,
  // NumberInputStepper,
  // NumberIncrementStepper,
  // NumberDecrementStepper,
  Select,
  Textarea
} from '@chakra-ui/react'

const ExpenseForm = ({updateExpenses}) => {
  const [expenseFormData, setExpenseFormData] = useState({
    entity: '',
    vendor: '',
    expenseAmount: '',
    notes: ''
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [responseStatus, setResponseStatus] = useState(0)
  const [loading, setLoading] = useState(false)
  const selectRef = useRef(null)

  const handleChange = (e) => {
    const {name, value} = e.target
    setExpenseFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleEntityChange = (e) => {
    const newEntity = e.target.value
    setExpenseFormData({...expenseFormData, entity: newEntity})
  }

  const handleSubmit = async (e, data) => {
    e.preventDefault()
    // const expenseFormDataObject = {}
    try {
      const expenseFormDataObject = {
        entity: expenseFormData.entity,
        vendor: expenseFormData.vendor,
        product: expenseFormData.product,
        expenseAmount: expenseFormData.expenseAmount,
        notes: expenseFormData.notes
      }
      if(expenseFormData.entity && expenseFormData.vendor && expenseFormData.expenseAmount && expenseFormData.notes) {
        setLoading(true)
        const response = await fetch(`https://eterna-primavera-512c65c679c2.herokuapp.com/api/create/expense`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(expenseFormDataObject),
        })
        setLoading(true)
  
        if(response.ok) {
          setExpenseFormData({
            entity: '',
            vendor: '',
            product: '',
            expenseAmount: '',
            notes: ''
          })
          setLoading(false)
          setResponseStatus(response.status)
          setShowAlert(true)
          setErrorMessage(response.statusText)
          updateExpenses(prevExpenses => prevExpenses + parseFloat(expenseFormData.expenseAmount))
        } else {
          setLoading(false)
          setResponseStatus(response.status)
          setShowAlert(true)
          setErrorMessage(response.text)
        }
  
        if(selectRef.current) {
          selectRef.current.value = 'Select Entity'
        }
      }

    } catch(err) {
      setErrorMessage(`Failed to create expense record ${err}`)
      console.error(`Failed to create expense record ${err}`)
    }
  }
  return(
    // <Container>
      <Card p={2}>
        <Heading size='md' as='h2' colorScheme='red'>Expense Form.</Heading>
          <form  onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Entity</FormLabel>
              <Select placeholder='Select Entity' name='entity' id='entity' onChange={handleEntityChange}>
                <option>Alice</option>
                <option>Damaris</option>
                <option>Joanna</option>
              </Select>
              <FormHelperText>Who created this expense?</FormHelperText>
              <FormLabel>Vendor</FormLabel>
              <Input type='text' name='vendor' value={expenseFormData.vendor} onChange={handleChange}/>
              <FormHelperText>Ex. Costco, A distributor, etc...</FormHelperText>
              <FormLabel>Product</FormLabel>
              <Input type='text' name='product' value={expenseFormData.product} onChange={handleChange}/>
              <FormHelperText>Ex. (Coffee Beans, Cups, etc...)</FormHelperText>
              <FormLabel>Amount</FormLabel>
              <NumberInput max={999} min={1}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents='none'
                    color='gray.300'
                    fontSize='1.2em'
                  >$
                  </InputLeftElement>
                  <Input paddingLeft={7} type='text' name='expenseAmount' value={expenseFormData.expenseAmount} onChange={handleChange}/>
                  {/* <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper> */}
                </InputGroup>
                </NumberInput>
                <FormHelperText>Enter amount in format like 0.00</FormHelperText>
                <FormLabel>Describe the expenses.</FormLabel>
                <Textarea placeholder='Describe the expense and why it was purchased.' type='text' name='notes' value={expenseFormData.notes} onChange={handleChange}/>
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
              {showAlert ? <Alert status={responseStatus === 201 ? 'success' : 'error'} variant='subtle' mt={4}>
                <AlertIcon />
                {errorMessage}
              </Alert> : null}
            </FormControl>
          </form>
      </Card>
    // </Container>
  )
}

export default ExpenseForm