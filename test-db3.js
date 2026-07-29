const mongoose = require('mongoose');
const url = 'mongodb+srv://varni:Varni%401102@kisanhub.gbinuf2.mongodb.net/archmind';
mongoose.connect(url).then(async () => {
  const db = mongoose.connection.db;
  const histories = await db.collection('lldhistories').find().sort({createdAt: -1}).limit(5).toArray();
  for (let h of histories) {
    console.log("ID:", h._id, "Has elements:", !!h.elements);
  }
  process.exit(0);
}).catch(console.error);
