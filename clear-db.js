const mongoose = require('mongoose');
const url = 'mongodb+srv://varni:Varni%401102@kisanhub.gbinuf2.mongodb.net/archmind';
mongoose.connect(url).then(async () => {
  const db = mongoose.connection.db;
  const result = await db.collection('lldhistories').deleteMany({});
  console.log("Deleted documents:", result.deletedCount);
  process.exit(0);
}).catch(console.error);
