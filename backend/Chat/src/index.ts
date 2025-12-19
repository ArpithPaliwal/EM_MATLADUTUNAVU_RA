import 'dotenv/config';
import connectDB from './db/index.js';
// import { app } from './app.js';
// import connectDB from './db/index.js';


const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
    try {
        await connectDB();   

        // app.listen(PORT, () => {
        //     console.log(`Chat Server running on port ${PORT}`);
        // });
    } catch (error) {
        console.error('Chat Server startup failed', error);
        process.exit(1);
    }   
};
startServer();