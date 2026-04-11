import mongoose from 'mongoose';
import chalk from 'chalk';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `mongodb://ngongocvu668:KufCiUCKxnkPeI3Y@cluster0-shard-00-00.bk3b7.mongodb.net:27017,cluster0-shard-00-01.bk3b7.mongodb.net:27017,cluster0-shard-00-02.bk3b7.mongodb.net:27017/?ssl=true&replicaSet=atlas-h0flh5-shard-0&authSource=admin&appName=Cluster0` ||
        '',
    );
    if (conn) {
      console.log(chalk.bgYellowBright(`MongoDB Connected: ${conn.connection.host}`));
    }
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
