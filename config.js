require('dotenv').config();

module.exports = {
    isProduction: process.env.NODE_ENV === 'production' ? true : false,
    port: process.env.PORT || 3000,
    mongoURI: process.env.MONGO_URI,
}