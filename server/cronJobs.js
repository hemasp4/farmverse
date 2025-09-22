const cron = require('node-cron');
const Market = require('./models/Market');
const User = require('./models/User');
const Notification = require('./models/Notification');
const Crop = require('./models/Crop');

// Update market prices (runs every 6 hours)
cron.schedule('0 */6 * * *', async () => {
  try {
    // Crop types and their base values
    const crops = {
      wheat: { baseValue: 100, fluctuation: 0.3 },
      corn: { baseValue: 150, fluctuation: 0.25 },
      tomato: { baseValue: 200, fluctuation: 0.4 },
      carrot: { baseValue: 80, fluctuation: 0.2 },
    };

    // Calculate new market prices with some randomness
    for (const [cropType, data] of Object.entries(crops)) {
      const { baseValue, fluctuation } = data;

      // Random fluctuation between -fluctuation and +fluctuation
      const randomFactor = 1 + (Math.random() * 2 * fluctuation - fluctuation);
      const newPrice = Math.round(baseValue * randomFactor);

      await Market.findOneAndUpdate(
        { cropName: cropType },
        { price: newPrice, updatedAt: new Date() },
        { upsert: true, new: true }
      );
    }

    console.log('Market prices updated successfully');
  } catch (error) {
    console.error('Error updating market prices:', error);
  }
});

// Daily reward function (runs once per day)
cron.schedule('0 0 * * *', async () => {
  try {
    const users = await User.find();
    const rewardAmount = 50;

    for (const user of users) {
      user.coins += rewardAmount;
      await user.save();

      const newNotification = new Notification({
        user: user._id,
        title: 'Daily Reward!',
        message: `You\'ve received ${rewardAmount} coins as your daily login reward.`,
        type: 'reward',
      });
      await newNotification.save();
    }

    console.log(`Processed daily rewards for ${users.length} users`);
  } catch (error) {
    console.error('Error processing daily rewards:', error);
  }
});

// Update crop growth (runs every hour)
cron.schedule('0 * * * *', async () => {
  try {
    const crops = await Crop.find({ isHarvestable: false });

    for (const crop of crops) {
      const now = new Date();
      const plantedTime = crop.plantedAt.getTime();
      const harvestTime = crop.harvestTime.getTime();
      let progress = (now.getTime() - plantedTime) / (harvestTime - plantedTime);

      if (progress < 0 || isNaN(progress)) {
        progress = 0;
      }

      if (progress >= 1) {
        crop.isHarvestable = true;
        crop.stage = 'ready';
        await crop.save();

        const newNotification = new Notification({
          user: crop.user,
          title: 'Crop Ready!',
          message: `Your ${crop.type} is ready to harvest!`,
          type: 'harvest',
        });
        await newNotification.save();
      } else {
        const GROWTH_STAGES = ['seedling', 'growing', 'mature', 'ready'];
        const stageIndex = Math.min(
          Math.floor(progress * GROWTH_STAGES.length),
          GROWTH_STAGES.length - 2
        );
        const newStage = GROWTH_STAGES[stageIndex];

        if (crop.stage !== newStage) {
          crop.stage = newStage;
          await crop.save();

          const newNotification = new Notification({
            user: crop.user,
            title: 'Crop Update',
            message: `Your ${crop.type} has reached the ${newStage} stage!`,
            type: 'growth',
          });
          await newNotification.save();
        }
      }
    }
  } catch (error) {
    console.error('Error updating crop growth:', error);
  }
});