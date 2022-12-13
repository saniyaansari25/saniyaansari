let express=require("express");
let app=express();
app.use(express.json());
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
})
//const port=2410;
var port = process.env.PORT || 2410;
app.listen(port,()=>console.log(`Node app listening on port ${port}!`));

let {data}=require("./prodData.js")
let {shops,products,purchases}=data

let fs=require("fs")
let fname1="shops.json"
let fname2="products.json"
let fname3="purchases.json"

app.get("/reset",function(req,res){
    let data1=JSON.stringify(shops)
    fs.writeFile(fname1,data1,function(err){
        if(err)res.status(404).send(err)
        else {
            let data2=JSON.stringify(products)
            fs.writeFile(fname2,data2,function(err){
                if(err)res.status(404).send(err)
                else {
                    let data3=JSON.stringify(purchases)
                    fs.writeFile(fname3,data3,function(err){
                        if(err)res.status(404).send(err)
                        else res.send("Data in file is reset")
                    })
                }
            })
        }
    })
    
})
app.get("/shops",function(req,res){
    fs.readFile(fname1,"utf8",function(err,data){
        if(err)res.status(404).send(err)
        else{
            let shopArray=JSON.parse(data)
            res.send(shopArray)
        }
    })
})
app.post("/shops",function(req,res){
    let body=req.body
    fs.readFile(fname1,"utf8",function(err,data){
        if(err)res.status(404).send(err)
        let shopArray=JSON.parse(data)
        let maxid=shopArray.reduce((acc,curr)=>curr.shopId>acc ? curr.shopId : acc,0)
        let newid=maxid+1
        let newShop={...body,shopId:newid}
        shopArray.push(newShop)
        let dataA=JSON.stringify(shopArray)
        fs.writeFile(fname1,dataA,function(err){
            if(err)res.status(404).send(err)
            else res.send(shopArray)
        })
    })
})
app.get("/products",function(req,res){
    fs.readFile(fname2,"utf8",function(err,data){
        if(err)res.status(404).send(err)
        else{
            let productArray=JSON.parse(data)
            res.send(productArray)
        }
    })
})
app.post("/products",function(req,res){
    let body=req.body
    fs.readFile(fname2,"utf8",function(err,data){
        if(err)res.status(404).send(err)
        let productArray=JSON.parse(data)
        let maxid=productArray.reduce((acc,curr)=>curr.productId>acc ? curr.productId : acc,0)
        let newid=maxid+1
        let newProduct={...body,productId:newid}
        productArray.push(newProduct)
        let data1=JSON.stringify(productArray)
        fs.writeFile(fname2,data1,function(err){
            if(err)res.status(404).send(err)
            else res.send(productArray)
        })
    })
})
app.get("/products/:id",function(req,res){
    let id=+req.params.id
    fs.readFile(fname2,"utf8",function(err,data){
        if(err)res.status(404).send(err)
        else{
            let productArray=JSON.parse(data)
            let product=productArray.find(n=>n.productId==id)
            if(product)res.send(product)
            else res.status(404).send("No data found")
        }
    })
})
app.put("/products/:id",function(req,res){
    let id=+req.params.id
    let body=req.body
    fs.readFile(fname2,"utf8",function(err,data){
        if(err)res.status(404).send(err)
        let productArray=JSON.parse(data)
        let index=productArray.findIndex(n=>n.productId==id)
        if(index>=0)
        {
            let updatedProduct={...productArray[index],...body}
            productArray[index]=updatedProduct
            let data1=JSON.stringify(productArray)
            fs.writeFile(fname2,data1,function(err){
                if(err)res.status(404).send(err)
                else res.send(productArray)
            })
        }
        else res.status(404).send("No data Found")
    })
})
app.get("/purchases",function(req,res){
    let productid=req.query.productid
    let sort=req.query.sort
    if(productid)
    {
        fs.readFile(fname3,"utf8",function(err,data){
            if(err)res.status(404).send(err)
            else{
                let purchaseArray=JSON.parse(data)
                let purchase=purchaseArray.filter(n=>n.productid==productid)
                res.send(purchase)
            }
        }) 
    }
    else if (sort)
    {
        if(sort=='QtyAsc')
        {
            fs.readFile(fname3,"utf8",function(err,data){
                if(err)res.status(404).send(err)
                else{
                    let purchaseArray=JSON.parse(data)
                    let purchase=purchaseArray.sort((a,b)=>(+a.quantity)-(+b.quantity))
                    res.send(purchase)
                }
            }) 
        }
        if(sort=='QtyDesc')
        {
            fs.readFile(fname3,"utf8",function(err,data){
                if(err)res.status(404).send(err)
                else{
                    let purchaseArray=JSON.parse(data)
                    let purchase=purchaseArray.sort((a,b)=>(+b.quantity)-(+a.quantity))
                    res.send(purchase)
                }
            }) 
        }
        if(sort=='ValueAsc')
        {
            fs.readFile(fname3,"utf8",function(err,data){
                if(err)res.status(404).send(err)
                else{
                    let purchaseArray=JSON.parse(data)
                    let purchase=purchaseArray.sort((a,b)=>(+a.quantity*a.price)-(+b.quantity*b.price))
                    res.send(purchase)
                }
            }) 
        }
        if(sort=='ValueDesc')
        {
            fs.readFile(fname3,"utf8",function(err,data){
                if(err)res.status(404).send(err)
                else{
                    let purchaseArray=JSON.parse(data)
                    let purchase=purchaseArray.sort((a,b)=>(+b.quantity*b.price)-(+a.quantity*a.price))
                    res.send(purchase)
                }
            })
        }
    }
    else {
        fs.readFile(fname3,"utf8",function(err,data){
            if(err)res.status(404).send(err)
            else{
                let purchaseArray=JSON.parse(data)
                res.send(purchaseArray)
            }
        })
    }
    
})
app.get("/purchases/shops/:id",function(req,res){
    let id=+req.params.id
    fs.readFile(fname3,"utf8",function(err,data){
        if(err)res.status(404).send(err)
        else{
            let purchaseArray=JSON.parse(data)
            let purchase=purchaseArray.filter(n=>n.shopId==id)
            if(purchase)res.send(purchase)
            else res.status(404).send("No Data Found")
        }
    })
})
app.get("/purchases/products/:id",function(req,res){
    let id=+req.params.id
    fs.readFile(fname3,"utf8",function(err,data){
        if(err)res.status(404).send(err)
        else{
            let purchaseArray=JSON.parse(data)
            let purchase=purchaseArray.filter(n=>n.productid==id)
            if(purchase)res.send(purchase)
            else res.status(404).send("No Data Found")
        }
    })
})
app.get("/totalPurchase/shop/:id",function(req,res){
    let id=+req.params.id
    fs.readFile(fname3,"utf8",function(err,data){
        if(err)res.status(404).send(err)
        else{
            let purchaseArray=JSON.parse(data)
            let purchase=purchaseArray.filter(n=>n.shopId==id)
            let sum=purchase.reduce((acc,curr)=>acc+curr.quantity,0)
            let totalpurchase={totalpurchase:sum}
            if(sum)res.send(totalpurchase)
            else res.status(404).send("No Data Found")
        }
    })
})
app.get("/totalPurchase/product/:id",function(req,res){
    let id=+req.params.id
    fs.readFile(fname3,"utf8",function(err,data){
        if(err)res.status(404).send(err)
        else{
            let purchaseArray=JSON.parse(data)
            let purchase=purchaseArray.filter(n=>n.productid==id)
            let sum=purchase.reduce((acc,curr)=>acc+curr.quantity,0)
            let totalpurchase={totalpurchase:sum}
            if(sum)res.send(totalpurchase)
            else res.status(404).send("No Data Found")
        }
    })
})
app.post("/purchases",function(req,res){
    let body=req.body
    fs.readFile(fname3,"utf8",function(err,data){
        if(err)res.status(404).send(err)
        let purchaseArray=JSON.parse(data)
        let maxid=purchaseArray.reduce((acc,curr)=>curr.purchaseId>acc ? curr.purchaseId : acc,0)
        let newid=maxid+1
        let newPurchase={...body,purchaseId:newid}
        purchaseArray.push(newPurchase)
        let data1=JSON.stringify(purchaseArray)
        fs.writeFile(fname3,data1,function(err){
            if(err)res.status(404).send(err)
            else res.send(purchaseArray)
        })
    })
})