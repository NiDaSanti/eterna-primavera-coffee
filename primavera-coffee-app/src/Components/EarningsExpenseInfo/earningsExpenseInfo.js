import React, { useState, useEffect } from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Card,
  Container,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import EarningsForm from '../EarningsForm/earningsForm'
import ExpenseForm from '../ExpenseForm/expenseForm'
import EntityEntryInfo from '../EntityEntryInfo/entityEntryInfo'

const EarningsExpenseInfo = () => {
  const tabBackgroundColors = useColorModeValue(
    ['red.50', 'teal.50'],
    ['red.900', 'teal.900']
  )

  const [tabIndex, setTabIndex] = useState(0)
  const background = tabBackgroundColors[tabIndex]
  const [earningsData, setEarningsData] = useState([])
  const [expenseData, setExpenseData] = useState([])
  const [totalExpenses, setTotalExpenses] = useState(0.0)
  const [totalEarnings, setTotalEarnings] = useState(0.0)
  const [totalPercentages, setTotalPercentages] = useState(0.0)
  const [netProfits, setNetProfits] = useState(0.0)
  const [changeStatArrow, setChangeStatArrow] = useState('')
  const [numValuesBgChange, setNumValuesBgChange] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const expenseResponse = await fetch(`${process.env.REACT_APP_URL}/api/expenseView`)
      const expenseData = await expenseResponse.json()
      const expenses = parseFloat(expenseData.totalExpenses.toFixed(2))
      const earningResponse = await fetch(`${process.env.REACT_APP_URL}/api/earningView`)
      const earningData = await earningResponse.json()
      const allEarningsEntries = earningData
      const earnings = parseFloat(earningData.totalEarnings.toFixed(2))
      setTotalExpenses(expenses)
      setExpenseData(expenseData)
      setTotalEarnings(earnings)
      setEarningsData(allEarningsEntries)
      updateNetVsLossPercentageAndNetProfit(expenses, earnings)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  const updateNetVsLossPercentageAndNetProfit = (expenses, earnings) => {
    const netVsLossPercentage = expenses !== 0 ? ((earnings - expenses) / expenses) * 100 : 0
    const changeStatArrowValue = netVsLossPercentage > 0 ? 'increase' : netVsLossPercentage === 0 ? ' ' : 'decrease'
    const netProfit = earnings - expenses
    const changeScreenBgBasedOnNet = netVsLossPercentage === 0 ? '#ffffff' : 
    netVsLossPercentage > 0 ? 'teal.50' : 'red.50'

    setTotalPercentages(netVsLossPercentage.toFixed(2))
    setNetProfits(netProfit.toFixed(2))
    setChangeStatArrow(changeStatArrowValue)
    setNumValuesBgChange(changeScreenBgBasedOnNet)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [totalExpenses, totalEarnings])

  return(
    <Container maxW={1400}>
    <Card bg={numValuesBgChange} p={2}>
      <StatGroup>
        <Stat>
          <StatLabel>Expenses</StatLabel>
          <StatNumber>$ {totalExpenses}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Earnings</StatLabel>
          <StatNumber>$ {totalEarnings}</StatNumber>
        </Stat>
      </StatGroup>
      <StatGroup>
        <Stat>
          <StatHelpText>
            <Heading size='4xl'>
              <StatLabel>Net</StatLabel>
              <Heading size='2xl'>$ {netProfits}</Heading>
              <StatArrow type={changeStatArrow} />
              {totalPercentages} %
            </Heading>
          </StatHelpText>
        </Stat>
      </StatGroup>
    </Card>
      <Accordion bg='#ffffff' defaultIndex={[0]} allowMultiple>
        <AccordionItem>
            <AccordionButton>
              <Box as="span" flex='1' textAlign='left'>
                <Heading size='md'>Earnings/Expense Forms.</Heading>
              </Box>
            <AccordionIcon />
          </AccordionButton>
        <AccordionPanel pb={1}>
          <Tabs onChange={(index) => setTabIndex(index)} background={background}>
            <TabList>
              <Tab>
                <Text fontSize='lg'>Expenses</Text>
              </Tab>
              <Tab>
              <Text fontSize='lg'>Earnings</Text>
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <ExpenseForm updateExpenses={setTotalExpenses} />
              </TabPanel>
              <TabPanel>
                <EarningsForm updateEarnings={setTotalEarnings} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as="span" flex='1' textAlign='left'>
              <Heading size='md'>Expenses Information.</Heading>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <EntityEntryInfo loading={loading} earningsView={earningsData} expenseView={expenseData}/>
        </AccordionPanel>
      </AccordionItem>
      </Accordion>
    </Container>
  )
}

export default EarningsExpenseInfo
