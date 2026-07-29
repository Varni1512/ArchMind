const mongoose = require('mongoose');
const url = 'mongodb+srv://varni:Varni%401102@kisanhub.gbinuf2.mongodb.net/archmind';
mongoose.connect(url).then(async () => {
  const db = mongoose.connection.db;
  const histories = await db.collection('lldhistories').find().sort({createdAt: -1}).limit(1).toArray();
  if (histories.length > 0) {
    console.log("Has elements:", !!histories[0].elements);
    if (histories[0].elements) {
      console.log("Elements is array:", Array.isArray(histories[0].elements));
      console.log("Elements length:", histories[0].elements.length);
    }
  } else {
    console.log("No histories found");
  }
  process.exit(0);
}).catch(console.error);
