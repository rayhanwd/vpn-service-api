const express = require('express')
const app = express()
const port = process.env.PORT || 5200
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

//mongodb connection
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tcatg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const Services = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION_NAME}`)
  const AdminInfo = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_ADMIN_COLLECTION_NAME}`)
  const FeedbackStore = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_FEEDBACK_COLLECTION_NAME}`)
  const OrderStore = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_ORDER_COLLECTION_NAME}`)

  app.get('/services', (req, res) => {
    Services.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.post('/addNewAdmin', (req, res) => {
    const newAdmin = req.body
    AdminInfo.insertOne(newAdmin)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })


  app.post('/AddService', (req, res) => {
    const newService = req.body
    Services.insertOne(newService)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/AddReview', (req, res) => {
    const newFeedback = req.body
    FeedbackStore.insertOne(newFeedback)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/services/:id', (req, res) => {
    Services.find({ id: req.params.id })
      .toArray((err, docs) => {
        res.send(docs[0])
      })
  })

  app.get('/ShowFeedback', (req, res) => {
    FeedbackStore.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })
  app.get('/ShowOrderList', (req, res) => {
    OrderStore.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })
///


  app.post("/TakeNewOrder", (req, res) => {
    const TakeNewOrder = req.body;
    //console.log(order);
    OrderStore.insertOne(TakeNewOrder)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.post("/AddStatus", (req, res) => {
    const newStatus = req.body;
    //console.log(order);
    OrderStore.update(newStatus)
      .then(result => {
        res.send(result.updatedCount > 0)
      })
  })
  
  app.get('/orderedList', (req, res) => {
    OrderStore.find({ email: req.query.email })
      .toArray((err, docs) => {
        //console.log(docs);
        res.send(docs)
      })
  })

    app.get('/statusList', (req, res) => {
    OrderStatusStore.find({})
      .toArray((err, docs) => {
        //console.log(docs);
        res.send(docs)
      })
  })

  app.get('/findAdmin', (req, res) => {
  
    AdminInfo.find()
      .toArray((err, documents) => {
        res.send(documents)
      })
  })
  
  app.delete('/delete/:id', (req, res) => {
    Services.deleteOne({ id: req.params.id })
      .then((result) => {
        res.send(result.deletedCount > 0);
      })
  })


})
//mongodb closed



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`${port}`, 'server connected')
})
