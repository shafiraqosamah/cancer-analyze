import hapi from '@hapi/hapi'
import { predict } from '../predict.mjs'
import { randomUUID } from "crypto";
import {Store} from "./store.mjs"

/**
 * 
 * @param {Store} store 
 */
export async function startServer(
    store,
) {
    const server = hapi.server({
        port: '8080'
    })

    server.route({
        method: "GET",
        path: "/health",
        handler: (request, h) => {
            return "ok"
        }
    })

    server.route({
        method: "POST",
        path: "/predict",
        options: {
            payload: {
                multipart: true,
                maxBytes: 1_000_000, // 1MB,
            },
        },
        handler: async function(request, h) {
            try {
                const score = await predict(request.payload.image)
                const prediction = createPrediction(score)
                await store.save(prediction)
    
                return h.response({
                    status: "success",
                    message: "Model is predicted successfully",
                    data: prediction,
                }).code(201);
            } catch (err) {
                return h.response({
                    status: "fail", 
                    message: "Terjadi kesalahan dalam melakukan prediksi"
                }).code(400)
            }
        }
    })

    server.route({
        method: "GET",
        path: "/predict/histories",
        handler: async function(request, h) {
            const histories = await store.findAll()
            return h.response({
                status: "success",
                data: histories,
            }).code(200)
        }
    })

    server.ext('onPreResponse', (request, h) => {
        const { response } = request;
        if (response.isBoom && response.output.statusCode === 413) {
            return h
                .response({
                    status: 'fail', 
                    message: 'Payload content length greater than maximum allowed: 1000000' 
                })
                .code(413);
        }
        return h.continue;
    });

    console.log("Running in port :8080")

    await server.start()
}

function createPrediction(score = 0) {
    const threshold = 0.5
    let isCancer = score > threshold

    let result = "";
    let suggestion = "";
    
    if (isCancer) {
        result = "Cancer"
        suggestion = "Segera periksa ke dokter!"
    } else {
        result = "Non-cancer"
        suggestion = "Penyakit kanker tidak terdeteksi."
    }

    const id = randomUUID();
    const createdAt = new Date().toISOString();

    return { 
        id, 
        result, 
        suggestion, 
        createdAt,
    };

}
