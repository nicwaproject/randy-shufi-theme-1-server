const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://riziqzhapran:crpDNd7mxPjfEAq6@nicwaproject.ouf6c8q.mongodb.net/?retryWrites=true&w=majority&appName=Nicwaproject';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

const messageSchema = new mongoose.Schema({
    name: String,
    message: String
});

const Message = mongoose.model('Message', messageSchema, 'randyShufi'); // sesuaikan nama collection di sini

app.post('/messages', async (req, res) => {
    const { name, message } = req.body;
    const newMessage = new Message({ name, message });
    await newMessage.save();
    res.json({ status: 'Message saved!' });
});

app.get('/messages', async (req, res) => {
    try {
        // Mengambil dokumen dengan pesan yang unik
        const uniqueMessages = await Message.aggregate([
            {
                $group: {
                    _id: "$message",
                    doc: { $first: "$$ROOT" } // Mengambil dokumen pertama dengan pesan ini
                }
            },
            {
                $replaceRoot: { newRoot: "$doc" } // Menggantikan root dengan dokumen asli
            }
        ]);

        res.json(uniqueMessages);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching unique messages.' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
