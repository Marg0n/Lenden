const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


//config
require('dotenv').config();
const app = express();
// This is stripe test secret API key.
const stripe = require("stripe")(process.env.STRIPE_API_KEY_SERVER);
const port = process.env.PORT || 5000;


//middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    // "clcient",
    // server-side
  ],
  credentials: true,
  optionsSuccessStatus: 200,
}));
app.use(express.json());
// app.use(cookieParser());

// jwt validation middleware
const verifyToken = async (req, res, next) => {

  // console.log('jtw header:', req.headers.authorization)

  const initialToken = await req.headers.authorization
  // console.log('jtw header initialToken :::>', initialToken)

  // for local storage only
  if (!initialToken) {
    return res.status(401).send({ message: 'Unauthorized access!!' });
  }
  // validate local storage token
  const token = await initialToken.split(' ')[1];

  // const token = req?.cookies?.token;
  // console.log('token :::>', token)

  if (!token) {
    return res.status(401).send({ message: 'Unauthorized access...' });
  }

  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.log('err token :::>', err)
        return res.status(401).send({ message: 'Unauthorized access' });
      }
      // console.log(decoded)
      req.decoded = decoded
      next()
    })
  }
}

//creating Token
app.post("/jwt", async (req, res) => {
  const user = req.body;
  // console.log("user for token", user);
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10h' });

  res
    // .cookie("token", token, cookieOptions)
    // .send({ success: true });
    .send({ token });
});

//clearing Token
app.get("/logout", async (req, res) => {
  const user = req.body;
  console.log("logging out", user);
  res
    // .clearCookie("token", { ...cookieOptions, maxAge: 0 })
    .send({ success: true });
});

//routes
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});


//connection to mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pqvcpai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pqvcpai.mongodb.net/`;




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    // =================================
    // DB Collections' Connection
    // =================================
    const usersCollection = client.db("lendenDB").collection("users");



    // =================================
    // Admin verify 
    // =================================

    // verify admin access after jwt validation
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      // console.log('from verify admin -->', email);
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      const isAdmin = user?.isAdmin === true;
      if (!isAdmin) {
        return res.status(403).send({ message: "Unauthorized!!" });
      }

      next();
    }

    // =================================
    // Stripe payment connection
    // =================================

    app.post("/create-payment-intent", verifyToken, async (req, res) => {
      const  {price} = req.body;
      // console.log(price)
      const amounts = parseFloat(price * 100)
      // console.log(amounts)

      // return if...
      // if (amounts <= 0) return

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        // amount: calculateOrderAmount(amounts),
        amount: amounts,
        currency: "usd",
        payment_method_types: [
          "card",
        ],
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default. it cannot be used with 'payment_method_types' parameter
        // automatic_payment_methods: {
        //   enabled: true,
        // },
      });

      // console.log(paymentIntent)

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });


    // =================================
    // API Connections for users
    // =================================

    // Get all users' data 
    app.get('/users', verifyToken, async (req, res) => {
      const results = await usersCollection.find().toArray();
      // console.log(results)
      res.send(results);
    });

    // Get a specific users' data by email
    app.get('/users/:email', async (req, res) => {
      const mail = req.params?.email;
      // console.log(mail, req.decoded.email)
      // if (mail !== req.decoded.email) {
      //   res.status(403).send({ message: 'Unauthorized email access....' });
      // }
      const results = await usersCollection.find({ email: mail }).toArray();
      // console.log(results)
      res.send(results);
    });

    // Post users registration data
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      // console.log(newUser);
      const result = await usersCollection.insertOne(newUser);
      // console.log(result);
      res.send(result);
    })

    // Patch a users' admin role by id
    app.patch('/adminRole/:id', verifyToken, verifyAdmin, async (req, res) => {
      try {
        const id = req.params?.id; // Extract the user id from the request parameters
        const updateBody = req.body; // Extract the new status from the request body
        // console.log('updateBody -->',updateBody);
        const query = { _id: new ObjectId(id) }
        const updateDoc = {
          $set: {
            isAdmin: updateBody.status
          },
        }
        const results = await usersCollection.updateOne(query, updateDoc);

        // console.log(results)
        res.send(results);
      }
      catch (err) {
        // If an error occurs during execution, catch it here
        console.error('Error updating user status:', err);
        // Send an error response to the client
        res.status(500).json({ message: 'Internal server error' });
      }
    });

    // Patch a users' data by id
    app.patch('/update_user/:id', verifyToken, verifyAdmin, async (req, res) => {
      try {
        const id = req.params?.id; // Extract the user id from the request parameters
        const updateBody = req.body; // Extract the new status from the request body
        // console.log('updateBody -->',updateBody);
        const query = { _id: new ObjectId(id) }
        const updateDoc = {
          $set: {
            status: updateBody.status
          },
        }
        const results = await usersCollection.updateOne(query, updateDoc);

        // console.log(results)
        res.send(results);
      }
      catch (err) {
        // If an error occurs during execution, catch it here
        console.error('Error updating user status:', err);
        // Send an error response to the client
        res.status(500).json({ message: 'Internal server error' });
      }
    });


    // Update users registration data by email
    app.put('/update/:email', async (req, res) => {
      // console.log(req.params?.email);
      const mail = req.params?.email;
      const request = req.body;
      const query = { email: mail };
      const options = { upsert: true };
      const data = {
        $set: {
          ...request,
        }
      }
      const result = await usersCollection.updateOne(query, data, options);
      // console.log(result);
      res.send(result);
    });

    // =================================
    // API Connections for tests
    // =================================

    // Get all tests' data 
    app.get('/tests', async (req, res) => {
      const results = await testsCollection.find().toArray();
      res.send(results);
    });

    // delete tests' data
    app.delete('/deleteTests/:id', verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params?.id;
      const result = await testsCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // Update tests' data by id
    app.put('/updateTests/:id', async (req, res) => {
      // console.log(req.params?.email);
      const id = req.params?.id;
      const request = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const data = {
        $set: {
          ...request,
        }
      }
      const result = await testsCollection.updateOne(query, data, options);
      res.send(result);
    });

    // Post a test
    app.post('/addTests', verifyToken, verifyAdmin, async (req, res) => {
      const newTest = req.body;
      // console.log(newUser);
      const result = await testsCollection.insertOne(newTest);
      // console.log(result);
      res.send(result);
    })

    // Get tests lists count for pagination
    app.get('/testsListsCount', async (req, res) => {
      const filter = req.query?.filter
      const search = req.query?.search

      let query = {
        test_name: { $regex: search, $options: 'i' },
      }
      if (filter) {
        query.test_date = { $gte: filter }; // Filter dates greater than or equal to the filter date
      }
      const counts = await testsCollection.countDocuments(query);

      // it provides a number with object form
      res.send({ counts });
    })

    // Get tests lists count for pagination with page size and page count
    app.get('/testsListPagination', async (req, res) => {
      const size = parseInt(req.query.size)
      const page = parseInt(req.query.page) - 1
      const filter = req.query?.filter
      const today = req.query?.today
      const search = req.query?.search
      // console.log(size,page);

      let query = {
        test_date: { $gte: today }, // Filter dates greater than or equal to today's date
        test_name: { $regex: search, $options: 'i' },
      }
      if (filter) {
        query = { ...query, test_date: { $gte: filter } }; // Filter dates greater than or equal to the filter date
      }

      const results = await testsCollection
        .find(query)
        .sort({ test_date: 1 }) // Sort by test_date in ascending order
        .skip(page * size)
        .limit(size)
        .toArray();

      res.send(results);
    })

    // Get tests details
    app.get('/testsLists/:id', verifyToken, async (req, res) => {
      const id = req.params?.id;
      const results = await testsCollection.find({ _id: new ObjectId(id) }).toArray();
      // console.log(results)
      res.send(results);
    })


    // =================================
    // API Connections for booking tests
    // =================================

    // get data for appointments
    app.get('/appointment', verifyToken, verifyAdmin, async (req, res) => {
      const results = await bookingsCollection.find().toArray();
      res.send(results);
    })

    // get specific data for appointments for admin statistics 
    app.get('/appointmentAdminStat', verifyToken, verifyAdmin, async (req, res) => {
      const bookingDetails = await bookingsCollection.find(
        {},
        {
          projection: {
            testPrice: 1,
            appointmentsDate: 1,
            reportStatus: 1,
          },
        },
      ).toArray();

      const totalUsers = await usersCollection.countDocuments()
      const totalBanners = await bannersCollection.countDocuments()
      const totalTests = await testsCollection.countDocuments()
      const totalPrice = bookingDetails.reduce((sum, booking) => sum + booking.testPrice, 0)

      const chartData = bookingDetails.map(booking => {
        const day = new Date(booking.appointmentsDate).getDate();
        const month = new Date(booking.appointmentsDate).getMonth() + 1;
        const year = new Date(booking.appointmentsDate).getFullYear();
        const date = day + "/" + month + "/" + year

        const data = [date, booking?.testPrice]

        return data
      })

      // const chartDataStatus = bookingDetails.map( booking => {
      //   const day = new Date(booking.appointmentsDate).getDate();
      //   const month = new Date(booking.appointmentsDate).getMonth()+1;
      //   const year = new Date(booking.appointmentsDate).getFullYear();
      //   const date = day + "/" + month + "/" + year

      //   const stat = [date, booking?.reportStatus]

      //   return stat
      // })    

      // adding date and sale to charts' 0 index
      // chartData.splice(0,0,['Date', 'Sales'])
      chartData.unshift(['Date', 'Sales'])
      // chartDataStatus.unshift(['Date', 'Status'])

      const statusCounts = {};
      bookingDetails.forEach(booking => {
        const day = new Date(booking.appointmentsDate).getDate();
        const month = new Date(booking.appointmentsDate).getMonth() + 1;
        const year = new Date(booking.appointmentsDate).getFullYear();
        const date = day + "/" + month + "/" + year;

        if (!statusCounts[date]) {
          statusCounts[date] = { pending: 0, delivered: 0, canceled: 0 };
        }

        statusCounts[date][booking.reportStatus]++;
      });

      const uniqueDates = Object.keys(statusCounts);
      const chartData2 = [['Date', 'Pending', 'Delivered', 'Canceled']];

      uniqueDates.forEach(date => {
        const { pending, delivered, canceled } = statusCounts[date];
        chartData2.push([date, pending, delivered, canceled]);
      });

      res.send({
        totalUsers,
        totalBanners,
        totalTests,
        totalBooking: bookingDetails.length,
        totalPrice,
        chartData,
        chartData2
        // chartDataStatus
      });
    })

    // get data for appointments by mail Filter by appointmentsDate
    app.get('/appointment/:email', verifyToken, async (req, res) => {
      const mail = req.params?.email;
      const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in 'YYYY-MM-DD' format  

      const query = {
        userMail: mail,
        appointmentsDate: { $gte: currentDate }, // Filter by appointmentsDate greater than or equal to the current date
        reportStatus: { $ne: 'delivered' } // Exclude 'delivered' status
      };

      const results = await bookingsCollection.find(query).toArray();
      // console.log(results)
      res.send(results);
    })

    // get data for test results by mail
    app.get('/appointmentResult/:email', verifyToken, async (req, res) => {
      const mail = req.params?.email;

      const query = { userMail: mail, reportStatus: { $eq: 'delivered' } };

      const results = await bookingsCollection.find(query).toArray();
      // console.log(results)
      res.send(results);
    })

    // Patch a users' appointment Status by id
    app.patch('/appointmentStatus/:id', verifyToken, async (req, res) => {
      try {
        const id = req.params?.id; // Extract the user id from the request parameters
        const updateBody = req.body; // Extract the new status from the request body
        // console.log('updateBody -->',updateBody);
        const query = { _id: new ObjectId(id) }
        const updateDoc = {
          $set: {
            reportStatus: updateBody.status,
          },
        }
        const results = await bookingsCollection.updateOne(query, updateDoc);

        // console.log(results)
        res.send(results);
      }
      catch (err) {
        // If an error occurs during execution, catch it here
        console.error('Error updating user status:', err);
        // Send an error response to the client
        res.status(500).json({ message: 'Internal server error' });
      }
    });

    // Post a booking
    app.post('/userBookings', verifyToken, async (req, res) => {
      const booking = req.body;
      // console.log(booking);

      // check if there is already a booking
      const query = {
        userMail: booking.userMail,
        testID: booking.testID,
        reportStatus: { $ne: 'canceled' },
      }

      const alreadyBooked = await bookingsCollection.findOne(query)

      if (alreadyBooked) {
        return res
          .status(400)
          .send("There is already a booking!")
      }

      const result = await bookingsCollection.insertOne(booking);
      // console.log(result);

      // update the test slots
      const updateDoc = {
        $inc: {
          test_slots: -1,
        },
      }

      const find = { _id: new ObjectId(booking.testID) }
      const updateSlots = await testsCollection.updateOne(find, updateDoc)
      // console.log(updateSlots)

      res.send(result);
    })

    // total price regarding status
    app.get('/appointments/totalPrice', verifyToken, async (req, res) => {
      try {
        const results = await bookingsCollection.aggregate([
          { $group: { _id: null, totalPrice: { $sum: "$testPrice" } } }
        ]).toArray();

        // If there are no results, default to 0
        const totalPrice = results.length > 0 ? results[0].totalPrice : 0;

        res.send({ totalPrice });
      } catch (err) {
        console.error('Error calculating total price:', err);
        res.status(500).json({ message: 'Internal server error' });
      }
    });



    // =================================
    // API Connections for banners
    // =================================

    // Get banners' data i
    app.get('/allBanners', async (req, res) => {
      const results = await bannersCollection.find().toArray();
      res.send(results);
    });

    // Get banners' data is active true
    app.get('/banners', async (req, res) => {
      const results = await bannersCollection.find({ isActive: true }).toArray();
      res.send(results);
    });
    // Get banners' data is active false
    app.get('/bannersSlider', async (req, res) => {
      const results = await bannersCollection.find({ isActive: false }).toArray();
      res.send(results);
    });

    // get data for banners by id
    app.get('/banners/:id', verifyToken, async (req, res) => {
      const id = req.params?.id;
      const results = await bannersCollection.find({ _id: new ObjectId(id) }).toArray();
      res.send(results);
    })

    // Post banners data
    app.post('/banners', verifyToken, verifyAdmin, async (req, res) => {
      const banners = req.body;
      const result = await bannersCollection.insertOne(banners);
      res.send(result);
    })

    // Patch a banners' data by id
    app.patch('/updateBanner/:id', verifyToken, verifyAdmin, async (req, res) => {
      try {
        const id = req.params?.id; // Extract the user id from the request parameters
        const updateBody = req.body; // Extract the new status from the request body
        // console.log('updateBody -->',updateBody);

        // Check if the new status is true
        if (updateBody.status) {
          // Set isActive to false for all other banners
          await bannersCollection.updateMany(
            { _id: { $ne: new ObjectId(id) } },
            { $set: { isActive: false } }
          );
        }

        // Update the specific banner's status
        const query = { _id: new ObjectId(id) }
        const updateDoc = {
          $set: {
            isActive: updateBody.status
          },
        }
        const results = await bannersCollection.updateOne(query, updateDoc);

        // console.log(results)
        res.send(results);
      }
      catch (err) {
        // If an error occurs during execution, catch it here
        console.error('Error updating user status:', err);
        // Send an error response to the client
        res.status(500).json({ message: 'Internal server error' });
      }
    });

    // delete banner data
    app.delete('/deleteBanner/:id', verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params?.id;
      const result = await bannersCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // =================================================================


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
