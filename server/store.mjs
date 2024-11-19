import { configDotenv } from 'dotenv';
import {Firestore} from '@google-cloud/firestore';

configDotenv()


const firestore = new Firestore();

// TODO: adjust this to use persistance storage
export const Store = {
    data_store: [],
    save: async function(data) {
        this.data_store.push(data)
        await firestore.collection("predictions").add(data)
    },
    findAll: async function() {
        const snapshots = await firestore.collection("predictions").get()
        
        const docs = []
        snapshots.forEach(doc => {
            docs.push(doc.data())
        })

        return docs
        // return this.data_store
    }
}
