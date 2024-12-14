import express from 'express';
import { readFile } from 'fs/promises';
import cors from 'cors';

// read dummy data
const products = JSON.parse(await readFile(new URL('./products.json', import.meta.url)));

const app = express();

/**
 * Simple Usage (Enable All CORS Requests)
 */
const whitelist = ['http://localhost:3000', 'http://localhost:3500'];
const options = {
    /**
     * Origin can be a string or an array of strings or a regex or a function.
     */
    // origin: "http://localhost:3000"    // single origin
    // origin: ['http://localhost:3000', 'http://localhost:3500'], // multiple origins
    // origin: /^http:\/\/localhost:\d+$/, // regex to match http://localhost with any port
    origin: (origin, callback) => {
        // console.log(req.method);
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },

    /**
     * Allowed HTTP methods
     */
    methods: ['POST', 'PUT', 'DELETE'],

    /**
     * Allowed headers
     */
    // allowedHeaders: ['Content-Type', 'Authorization'],

    /**
     * Exposed headers
     */
    // exposedHeaders: ['Content-Range', 'X-Content-Range'],

    /**
     * Credentials
     */
    // credentials: true,

    /**
     * Preflight Continue
     */
    // preflightContinue: false,

    /**
     * Options Success Status
     */
    // optionsSuccessStatus: 204,

    /**
     * Max Age
     */
    maxAge: 3600,

    /**
     * Enable preflight
     */
    // preflight: false,

    /**
     * Hide options
     */
    // hideOptionsRoute: false,
}

app.use(cors(options));

// app.use(
//     cors({
//         origin: ['localhost:3000', 'localhost:3500'],
//         credentials: true,
//         methods: ['PUT', 'POST'],
//         maxAge: 3600,
//         exposedHeaders: ['x-custom-header'],
//     })
// );

app.use(express.json());

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.post('/api/products', (req, res) => {
    // todo: product creation logic here...
    res.status(201).json({ success: true });
});

app.put('/api/products/:id', (req, res) => {
    // todo: product update logic here...
    res.json({ success: true });
});

app.listen(4000, () => console.log(`Listening on port 4000`));
