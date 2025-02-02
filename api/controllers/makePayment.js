import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51Ph7haRxahYVGxLcIxIW7dmeOS7dvmnzuZfKG0n4sgUrOtzPdCHY1hFLesfeNKf7OapkowXfs4VMZzWvqCAsg5fP008VkWSV5Z');

export const makepayment=async(req,res)=>{
    try {
        const hotelDetails=req.body;
        console.log("rooms", hotelDetails);

        const lineItems = hotelDetails.rooms.map((product)=>({
            price_data:{
                currency:"inr",
                product_data:{
                    name:product.title,
                },
                unit_amount:product.price* 100,
            },
            quantity:product.maxPeople
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:lineItems,
            mode:"payment",
            success_url:"http://localhost:8800/sucess",
            cancel_url:"http://localhost:8800/cancel",
        });
        console.log("session", session);
        return res.json({id:session.id}); // u can store details 
    } catch (error) {
        console.log("error",error)
    }
}