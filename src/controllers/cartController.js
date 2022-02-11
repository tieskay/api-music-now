import db from "../db.js";

export async function postCart(req, res) {
  const user = res.locals.user;
  const product = req.body;

  try {
    const searchedUserCart = await db.collection("cart").findOne({ userId: user._id });
    if(!searchedUserCart){
      await db.collection("cart").insertOne({ 
        cart: [ { ...product } ], 
        userId: user._id,
        finshedPurchase: false
      });
      res.sendStatus(200);
    }else{
      const updatedUserCart = {
        ...searchedUserCart,
        cart: [ ...searchedUserCart.cart, { ...product } ]
      }
      await db.collection("cart").updateOne(
        { _id: searchedUserCart._id },
        { $set: updatedUserCart }
      );
      res.sendStatus(200);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getCart(req, res) {
  const user = res.locals.user;
  
  try {
    const searchedUser = await db.collection("cart").findOne({ userId: user._id });
    if(!searchedUser){
      res.sendStatus(404);
    }

    res.send(searchedUser.cart);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}