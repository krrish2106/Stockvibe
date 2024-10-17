const express = require('express');
const router = express.Router();
const  { authMiddleware } = require("../middleware");
const { User,Stock } = require("../db");
const puppeteer = require('puppeteer');

router.get('/seed',async (req,res)=>{
    try{
       const response= await Stock.find({});
       res.json(response);
    }catch(err){
        res.status(500).json({ error: 'Failed to get stocks' });
    }
})

router.post('/selected-stock', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const { selectedStocks } = req.body;
        const updatedStocks = selectedStocks.map(stockId => ({ stock: stockId, quantity: 0, buyingPrice: 0 }));
        await User.findByIdAndUpdate(userId, { selectedStocks: updatedStocks });
        res.json({ message: 'Selected stocks updated' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update selected stocks' });
    }
});


router.get('/selected-stock', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).populate('selectedStocks.stock');
        res.json(user.selectedStocks);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch selected stocks' });
    }
});
router.post('/:stockId/notes', authMiddleware,async (req, res) => {
    const { stockId } = req.params;
    const userId=req.userId;
    const { date, title, description } = req.body;

    try {
        const stock = await Stock.findById(stockId);
        if (!stock) {
            return res.status(404).send('Stock not found');
        }

        const note = {
            userId,
            date,
            title,
            description
        };

        stock.timeline.push(note);
        await stock.save();
        const userNotes = stock.timeline.filter(note => note.userId.equals(userId));
        res.status(200).send(userNotes);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/:stockId/notes', authMiddleware,async (req, res) => {
    const { stockId } = req.params;
    const userId=req.userId;

    try {
        const stock = await Stock.findById(stockId).select('timeline');
        const st= await  Stock.findById(stockId);
        if (!stock) {
            return res.status(404).send('Stock not found');
        }
        const userNotes = stock.timeline.filter(note => note.userId.equals(userId));
        res.status(200).json([userNotes,st]);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ message: 'Failed to fetch notes' });
    }
});
router.delete('/:stockId/notes/:noteId', authMiddleware, async (req, res) => {
    const { stockId, noteId } = req.params;
    const userId = req.userId;

    try {
        const stock = await Stock.findById(stockId);
        if (!stock) {
            return res.status(404).send('Stock not found');
        }

        const noteIndex = stock.timeline.findIndex(note => note._id.equals(noteId) && note.userId.equals(userId));
        if (noteIndex === -1) {
            return res.status(404).send('Note not found or you are not authorized to delete this note');
        }

        stock.timeline.splice(noteIndex, 1);
        await stock.save();
        const userNotes = stock.timeline.filter(note => note.userId.equals(userId));
        res.status(200).send(userNotes);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
router.get('/quote-equity', async (req, res) => {

const { symbol } = req.query;
  try {
    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`https://www.google.com/finance/quote/${symbol}:NSE`, { waitUntil: 'networkidle2',timeout:60000 });
      
        const price = await page.evaluate(() => {
          const element = document.querySelector('[data-last-price]');
          return element ? element.getAttribute('data-last-price') : null;
        });
        res.json(price)
        await browser.close();
      })();
      
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stock price' });
  }
  });

router.put('/update', authMiddleware, async (req, res) => {
    const  userId  = req.userId;
    const { stockId, quantity, buyingPrice } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const selectedStock = user.selectedStocks.find(stock => stock.stock.equals(stockId));
        if (!selectedStock) {
            return res.status(404).send('Stock not found in user\'s selection');
        }
        selectedStock.quantity = quantity;
        selectedStock.buyingPrice = buyingPrice;

        await user.save();
        res.status(200).send('Stock updated successfully');
    } catch (error) {
        console.error('Error updating stock:', error);
        res.status(500).send('Internal server error');
    }
});


module.exports=router;