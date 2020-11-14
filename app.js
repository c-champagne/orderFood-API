const express = require('express');
const app = express();

const port = 3000;

orders = [];
let primaryId = 1;

//middleware - "intercepts" data and exectues a function on it.
//This is going to capture the request body and run it through 
//JSON.parse(), returning an object that will be available as req.body
app.use(express.json());  //
app.use(express.urlencoded({extended: false}));

//routes
app.get('/orders', (req, res, next) => {
    if (!orders.length) {
        next();
    }
    res.status(200).send(orders);
})

app.post('/orders', (req, res) => {
    orders.push({
        id: primaryId,
        food_name: req.body.food_name,
        customer_name: req.body.customer_name,
        quantity: req.body.quantity
    });
    primaryId++;

    res.status(200).json({
        message: "Order created successfully"
    })
})

app.delete('/orders/:id', (req, res) => {
    const id = req.params.id;
    let order = orders.find((order) => {
        return order.id === Number(id)
    })

    let orderIndex = orders.findIndex((o) => {
        return o === order;
    })

    if (orderIndex > -1){
        orders.splice(orderIndex, 1);
    }
    res.status(200).send(orders)
    /* for (let order of orders) {
        if (order.id == id) {
          orders.splice(orders.indexOf(order), 1);
    
          return res.status(200).json({
            message: "Deleted Successfully"
          });
        }
      } */
    
      res.status(404).json({ message: "Invalid Order Id" });
})

app.get("/orders/:id", (req, res) => {
    const id = req.params.id;
    let order = orders.find((order) => {
        return order.id === Number(id)
    });

    const filter = req.body.filter || [];
    if (filter.length) {
        let newOrder = {};
        filter.forEach((f) => {
            newOrder[f] = order[f]
        })
        res.send(newOrder)
    }

    

    res.send(order.customer_name)
})

// example endpoint: /search?q="search term here"
app.get('/search', (req, res) => {
    let query = req.query.q
    res.send(query)
})

app.get("*", (req, res) => {
    res.status(404).send("Not found")
})


app.listen(port, () => {
    console.log('Server listening')
})

