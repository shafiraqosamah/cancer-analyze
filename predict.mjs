import * as tf from "@tensorflow/tfjs-node"

// TODO: change this to load from GCS
// const model_path = 'file://./submissions-model/model.json';
const model_path = 'https://storage.googleapis.com/asclepius-shafira/models/model.json';
const model = await tf.loadGraphModel(model_path);

export async function predict(src_file) {
    // load file
    let tensor = tf.node.decodeImage(src_file)
    
    // resize file
    tensor = tf.image.resizeBilinear(tensor, [224, 224])
    tensor = tensor.expandDims(0)

    const tensor_rank = model.execute(tensor);
    const res = await tensor_rank.array()
    
    const predict_val = res[0][0]
    
    return predict_val
}
