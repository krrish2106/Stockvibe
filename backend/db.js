const mongoose = require('mongoose');

async function connectToDatabase() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/stockVibes");
        console.log("Connection Open");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}
connectToDatabase();

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        required: true
    }
});

const noteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
    }
});

const stockSchema = new mongoose.Schema({
    stockSymbol: {
        type: String,
        required: true,
        trim: true,
        maxLength: 10
    },
    stockName:{
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    news: {
        type: [newsSchema],
        default: []
    },
    timeline: {
        type: [noteSchema],
        default: []
    }
});

const selectedStockSchema = new mongoose.Schema({
    stock: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stock'
    },
    quantity: {
        type: Number,
        default: 0
    },
    buyingPrice: {
        type: Number,
        default: 0
    }
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    selectedStocks: [selectedStockSchema]
});

const User = mongoose.model('User', userSchema);
const Stock = mongoose.model('Stock', stockSchema);

module.exports = {
    User,
    Stock
};
