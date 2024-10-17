const mongoose = require('mongoose');
const { Stock } = require('./db');

async function connectToDatabase() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/stockVibes");
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}

async function seedStocks() {
    await connectToDatabase();

    const stocks = [
        { stockSymbol: 'ZOMATO',stockName: 'Zomato', news: [], timeline: [] },
        { stockSymbol: 'MAZDOCK',stockName: 'Mazagon Dock', news: [], timeline: [] },
        { stockSymbol: 'JSL',stockName: 'Jindal Stainless Ltd', news: [], timeline: [] },
        { stockSymbol: 'HAL',stockName: 'Hindustan Aeronautics Ltd', news: [], timeline: [] },
        { stockSymbol: 'JSWENERGY',stockName: 'JSW Energy Ltd', news: [], timeline: [] },
        { stockSymbol: 'JSWINFRA',stockName: 'JSW Infrastructure Ltd', news: [], timeline: [] },
        { stockSymbol: 'INOXINDIA',stockName: 'Inox India Ltd', news: [], timeline: [] },
        { stockSymbol: 'BDL',stockName: 'Bharat Dynamics Ltd', news: [], timeline: [] },
        { stockSymbol: 'BLS',stockName: 'BLS International Services Ltd', news: [], timeline: [] },
        { stockSymbol: 'IRCON',stockName: 'Ircon International Ltd', news: [], timeline: [] },
        { stockSymbol: 'TATAMOTORS',stockName: 'Tata Motors Ltd', news: [], timeline: [] },
    ];

    try {
        await Stock.deleteMany({});
        await Stock.insertMany(stocks);
        console.log('Stocks seeded successfully');
    } catch (err) {
        console.error('Error seeding stocks:', err);
    } finally {
        mongoose.connection.close();
    }
}

seedStocks();
