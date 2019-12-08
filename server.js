import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const port = process.env.PORT || 9294;

const main = () => {
  app.listen(port, () => {
    console.log('LISTENING ON PORT: ', port);
  });
};
main();
