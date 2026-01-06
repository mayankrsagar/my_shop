import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const { category, sort, search, page = 1, limit = 12 } = req.query;
    let query = {};

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: "i" };

    let products = Product.find(query);

    if (sort === "price_asc") products = products.sort({ price: 1 });
    else if (sort === "price_desc") products = products.sort({ price: -1 });

    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(query);
    const result = await products.skip(skip).limit(parseInt(limit)).exec();

    res.json({
      products: result,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('sellerId', 'name email');
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.sellerId.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this product' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const seedProducts = async (req, res) => {
  const sampleData = [
    {
      name: "Classic White V-Neck",
      category: "Innerwear",
      price: 499,
      description: "Soft cotton v-neck for daily comfort.",
      image: "https://placehold.co/300x400?text=White+V-Neck",
    },
    {
      name: "Premium Boxer Briefs",
      category: "Innerwear",
      price: 699,
      description: "Stretchable fabric with elastic band.",
      image: "https://placehold.co/300x400?text=Boxer+Briefs",
    },
    {
      name: "Thermal Vest",
      category: "Innerwear",
      price: 899,
      description: "Keeps you warm during winters.",
      image: "https://placehold.co/300x400?text=Thermal+Vest",
    },
    {
      name: "Cotton Trunks Pack",
      category: "Innerwear",
      price: 999,
      description: "Pack of 3 breathable trunks.",
      image: "https://placehold.co/300x400?text=Cotton+Trunks",
    },
    {
      name: "Sleeveless Undershirt",
      category: "Innerwear",
      price: 349,
      description: "Lightweight and invisible under shirts.",
      image: "https://placehold.co/300x400?text=Undershirt",
    },
    {
      name: "Lounge Pajamas",
      category: "Clothing",
      price: 1299,
      description: "Relaxed fit for home wear.",
      image: "https://placehold.co/300x400?text=Pajamas",
    },
  ];

  try {
    await Product.deleteMany({});
    await Product.insertMany(sampleData);
    res.json({ message: "Database Seeded with 6 Products" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
