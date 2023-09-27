


// export const assignJob = async (req, res) => {
//     const productId = req.params.id;
//     const { lawyerId } = req.body;
//     try {
//         const product = await Product.findById(productId)
//         const lawyer = await Lawyer.findById(lawyerId)
//         if(!product || !lawyer){
//             return res.status(400).json({ error: 'Product or Lawyer not found'})
//         }

//         if(product.assignedTo.includes(lawyerId)){
//             return res.status(400).json({ error: 'Lawyer already assigned to this task'})
//         }

//         product.assignedTo.push(lawyerId)
//         await product.save()
//         // const updateProduct = await Product.findByIdAndUpdate(req.params.id, 
//         //     {$set: {productName, productPrice, productDescription}}, {new: true});
//         // res.status(200).json(updateProduct);
//         // if(!updateProduct) throw Error('Something went wrong while updating the product');
//     }
//     catch{
//         res.send(error)
//         console.log(error)
//     }       
// }
