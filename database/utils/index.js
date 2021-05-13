const mongoose = require('mongoose');

module.exports.connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Database connected successfully');
  } catch (err) {
    console.error(err);
  }
}
