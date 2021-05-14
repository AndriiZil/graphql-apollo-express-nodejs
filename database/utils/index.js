const mongoose = require('mongoose');

module.exports.connection = async () => {
  try {
    mongoose.set('debug', true);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    console.log('Database connected successfully');
  } catch (err) {
    console.error(err);
  }
}

module.exports.isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
}
