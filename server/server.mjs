import express from 'express'
import cors from 'cors'
// import authRoute from './routes/auth-routes.mjs'
import { authenticateUser, createExpenseRecord, createEarningsRecord, getExpenseData, getEarningData, router} from './routes/expense-earnings-routes.mjs'
const port = process.env.PORT || 3001
const app = express()
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'https://eterna-primavera-512c65c679c2.herokuapp.com/']

app.use(cors({
  origin: (origin, callback) => {
    if(allowedOrigins.includes(origin) || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))

app.use(express.json())
app.use('/api/user', router)
app.use('/api/user', authenticateUser)
app.use('/api/expenseView', getExpenseData)
app.use('/api/earningView', getEarningData)
app.use('/api/create', createExpenseRecord)
app.use('/api/create-earning', createEarningsRecord)

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!')
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('primavera-coffee-app/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'primavera-coffee-app', 'build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Hi Primavera, this is port ${port}`)
})