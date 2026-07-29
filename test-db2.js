const mongoose = require('mongoose');
const url = 'mongodb+srv://varni:Varni%401102@kisanhub.gbinuf2.mongodb.net/archmind';
mongoose.connect(url).then(async () => {
  const db = mongoose.connection.db;
  const histories = await db.collection('lldhistories').find().sort({createdAt: -1}).limit(1).toArray();
  if (histories.length > 0) {
    console.log(Object.keys(histories[0]));
  }
  process.exit(0);
}).catch(console.error);
