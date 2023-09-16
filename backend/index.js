const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
require('dotenv').config()
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/openai', async (req, res) => {
  const { textContent, userMessage } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant that answers questions.' },
        { role: 'user', content: `These are the contents of the pdf which was uploaded by the user,take this as reference   -   ${textContent}` },
        { role: 'user', content: `Answer the following question based on the reference provided earlier - ${userMessage}` },
      ],
      model: 'gpt-3.5-turbo',
    });

    const answer = completion.choices[0].message.content;
    console.log(answer);
    res.json({ answer });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
