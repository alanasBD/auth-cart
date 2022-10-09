const { Product, validate } = require("../models/product");
const _ = require("lodash");
const formidable = require("formidable");
const fs = require("fs");

module.exports.createProduct = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(400).send("Something went wrong.");
    const { error } = validate(
      _.pick(fields, ["name", "description", "price", "quantity", "category"])
    );
    if (error) return res.status(400).send(error.details[0].message);

    const product = new Product(fields);

    if (files.photo) {
      console.log(fields, files);
      fs.readFile(files.photo.filepath, (err, data) => {
        if (err) return res.status(400).send("Problem in file data!");
        product.photo.data = data;
        product.photo.contentType = files.photo.mimetype;
        product.save((err, result) => {
          if (err) return res.status(500).send("Internal server error!");
          return res.status(200).send({
            msg: "product created",
            data: _.pick(result, [
              "name",
              "description",
              "price",
              "quantity",
              "category",
            ]),
          });
        });
      });
    } else {
      return res.send("No image provided!");
    }
  });
};

//api/product?order=desc&sortBy=name&limit=10

module.exports.getProducts = async (req, res) => {
  const order = req.query.order === "desc" ? -1 : 1;
  const sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  const limit = req.query.limit ? parseInt(req.query.limit) : 3;
  // query
  const products = await Product.find()
    .select({ description: 0 })
    .sort({ [sortBy]: order })
    .limit(limit)
    .populate("category", "name");
  return res.status(200).send(products);
};

module.exports.getProductById = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId)
    .select({ photo: 1 })
    .populate("category", "name");
  if (!product) return res.status(404).send("product is not found!");
  return res.status(200).send(product);
};

module.exports.getPhoto = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId).select({
    photo: 1,
    _id: 0,
  });
  res.set("Content-Type", product.photo.contentType);
  res.status(200).send(product.photo.data);
};

//get the product by id
//collect form data
//update data by form fields
//Update photo if needed
module.exports.updateProductById = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
   
    if (error) return res.status(400).send("Something wrong!");
    const updatedFields = _.pick(fields, [
      "name","description",
      "price",
      "category",
      "quantity",
    ]);

    _.assignIn(product, updatedFields);

    console.log(product);

   

    if(files.photo) {
      fs.readFile(files.photo.filepath, (err, data) => {
        if (err) return res.status(400).send("Something wrong!");
        product.photo.data = data;
        product.photo.contentType = files.photo.mimetype;
        product.save((err, result) => {
          if (err) return res.status(400).send("Something failed");
          else return res.status(200).send("Product updated successful!");
        });
      });
    } 
    else {
      console.log('Inside else');
      product.save((err, result) => {
        if (err) return res.status(400).send("Something failed");
        return res.status(200).send("Product updated successful!");
      });
    }
  });
};

//filter by any field names (flexible)
const body = {
  order:'desc',
  sortBy:'price',
  limit:5,
  skip:20,
  filters:{
    price:[0,1000],
    category:[]
  }
}
module.exports.filterProducts = async(req,res) =>{
  const order = req.body.order === "desc" ? -1 : 1;
  const sortBy = req.body.sortBy ? req.query.sortBy : "_id";
  const limit = req.body.limit ? parseInt(req.query.limit) : 3;
  const skip = parseInt(req.body.skip);

  const filters = req.body.filters;
  const args = {}; 
  for (const key in filters){
      if(filters[key].length>0){
         if(key === 'price'){
            args['price'] = {
              $gte:filters['price'][0],
              $lte:filters['price'][1]
            }
         }

         console.log(args.price);

         if(key === 'category'){
            //category:{$in:["","",""]}
            args['category'] = {
              $in:filters['category']
            }
         }
      
      }
  }
 
  const products = await Product.find(args)
  .select({photo:0})
  .populate('category','name')
  .sort({[sortBy]:order})
  .skip(skip)
  .limit(limit);

  return res.status(200).send(products);
}
