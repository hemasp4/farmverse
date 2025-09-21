const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Import individual function modules
const dailyRewards = require('./dailyReward');
const cropGrowth = require('./cropGrowth');
const notifications = require('./notifications');
const marketPrices = require('./marketPrices');

// Export all functions
exports.processDailyRewards = dailyRewards.processDailyRewards;
exports.updateCropGrowth = cropGrowth.updateCropGrowth;
exports.sendNotifications = notifications.sendNotifications;
exports.updateMarketPrices = marketPrices.updateMarketPrices;
