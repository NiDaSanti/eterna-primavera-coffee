import fetch from 'node-fetch'
import dotenv from 'dotenv'
dotenv.config()

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const AIRTABLE_EXPENSE = process.env.AIRTABLE_EXPENSE_TABLENAME
const AIRTABLE_EARNINGS = process.env.AIRTABLE_EARNINGS_TABLENAME
const ACCESS = process.env.AIRTABLE_ACCESS_KEY
const NODEENV = process.env.NODE_ENV
const tableExpense = NODEENV === 'development' ? process.env.AIRTABLE_DEV_EXPENSE : AIRTABLE_EXPENSE
const tableEarning = NODEENV === 'development' ? process.env.AIRTABLE_DEV_EARNINGS : AIRTABLE_EARNINGS
const getTableUrl = (url) => {
  return url
}

const expenseTable = getTableUrl(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableExpense}`)
const earningsTable = getTableUrl(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableEarning}`)
// const earningsTable = getTableUrl()

export const authenticateUser = (req, res, next) => {
  const { alias, password } = req.body
  const DEVUSER = process.env.DEV_ALIAS
  const DEVPASS = process.env.DEV_PASS
  const USER1 = process.env.ALIASONE
  const PASS1 = process.env.ALIASONEPASS
  const USER2 = process.env.ALIASTWO
  const PASS2 = process.env.ALIASTWOPASS
  const USER3 = process.env.ALIASTHREE
  const PASS3 = process.env.ALIASTHREEPASS

  if(
    (alias === USER1 && password === PASS1) ||
    (alias === USER2 && password === PASS2) ||
    (alias === USER3 && password === PASS3) ||
    (alias === DEVUSER && password === DEVPASS)
  ) {
    next() // Proceed to the next middleware or route handler
  } else {
    res.status(401).json({message: 'Invalid name and/or password.'})
  }
}

export const createExpenseRecord = async (req, res) => {
  try {
    const expenseFormData = req.body
    const expenseRecord = {
      fields: {
        entity: expenseFormData.entity,
        vendor: expenseFormData.vendor,
        product: expenseFormData.product,
        expenseAmount: expenseFormData.expenseAmount,
        notes: expenseFormData.notes
      }
    }
    const response = await fetch(expenseTable, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ACCESS}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseRecord)
    })

    if(!response.ok) {
      const errorData = await response.json()
      const errorMessage = `Failed to create expense info: ${response.status}. Airtable error: ${JSON.stringify(errorData)}`
      console.error(errorMessage)
      res.status(500).json({error: 'Failed to create expense.'})
      return
    }
    const responseData = await response.json()
    res.status(201).json({message: 'Expense record created successfully ', records: [responseData]})
  } catch(err) {
    console.error('Error when attempting to create expense record.', err)
    res.status(500).json({error: 'Failed to create expense.'})
  }
}

export const createEarningsRecord = async (req, res) => {
  try {
    const earningsFormData = req.body
    const earningsRecord = {
      fields: {
        earningsAmount: earningsFormData.earningsAmount,
        entity: earningsFormData.entity,
        notes: earningsFormData.notes
      }
    }
    const response = await fetch(earningsTable, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ACCESS}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(earningsRecord)
    })
    
    if(!response.ok) {
      const errorData = await response.json()
      const errorMessage = `Failed to create earnings info: ${response.status}. Airtable error: ${JSON.stringify(errorData)}`
      console.error(errorMessage)
      res.status(500).json({error: 'Failed to create earnings.'})
      return
    }
    const responseData = await response.json()
    res.status(201).json({message: 'Earnings record created successfully ', records: [responseData]})
  } catch(err) {
    console.error('Error when attempting to create an earnings record.', err)
    res.status(500).json({error: 'Failed to create record.'})
  }

}

export const getExpenseData = async (req, res) => {
  try {
    const response = await fetch(expenseTable, {
      headers: {
        Authorization: `Bearer ${ACCESS}`,
      },
    })

    if(!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const responseData = await response.json()
    const expenseData = responseData.records
    console.log(expenseData)
    const totalExpenses = expenseData.reduce(
      (acc, expense) => acc + parseFloat(expense.fields.expenseAmount),
      0
    )

    res.json({expenses: expenseData, totalExpenses})
    
  } catch(err) {
    console.error(`Expense GET failed ${err}`)
    res.status(500).json({err: 'An error occurred while fetching expense data.'})
  }
}

export const getEarningData = async (req, res) => {
  try {
    const response = await fetch(earningsTable, {
      headers: {
        Authorization: `Bearer ${ACCESS}`,
      },
    })

    if(!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const responseData = await response.json()
    const earningData = responseData.records

    const totalEarnings = earningData.reduce(
      (acc, earning) => acc + parseFloat(earning.fields.earningsAmount),
      0
    )

    res.json({ earnings: earningData, totalEarnings })

  } catch(err) {
    console.error(`Earnings GET failed ${err}`)
    res.status(500).json({err: 'An error occurred while fetching earnings data.'})
  }
}

// export const getEarningsOrExpensesPercentages = async (req, res) => {
//   try{

//   } catch(err) {
//     console.error(`Failed to get percentage: ${err}`)
//     res.status(500).json({err: 'An error occured while fetching pecentages.'})
//   }
// } 



