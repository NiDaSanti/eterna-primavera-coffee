import express from 'express'
const router = express.Router()

import {authenticateUser, createExpenseRecord, createEarningsRecord, getExpenseData, getEarningData} from '../controllers/monetary-controller.mjs'

router.post('/auth', authenticateUser, (req, res, next) => {
  authenticateUser(req, res, next)
}, (req, res) => {
  res.json({message: 'Welcome to Eterna Primavera Health.'})
})

router.post('/expense', createExpenseRecord)
router.post('/earning', createEarningsRecord)
router.get('/expenseView', getExpenseData)
router.get('/earningView', getEarningData)

export {
  authenticateUser,
  createEarningsRecord, 
  createExpenseRecord, 
  getExpenseData, 
  getEarningData,
  router
}