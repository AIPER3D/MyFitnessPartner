import { Tensor, InferenceSession } from "onnxjs";
import ndarray from "ndarray";
import ops from "ndarray-ops";
class Toy
{
    private AVG_PERSON_HEIGHT : number = 100;
    private map_id_to_panoptic : number[] = [1, 0, 9, 10, 11, 3, 4, 5, 12, 13, 14, 6, 7, 8, 15, 16, 17, 18];
    private limbs : Array<number[]> = [[18, 17, 1],[16, 15, 1],[5, 4, 3],[8, 7, 6],[11, 10, 9],[14, 13, 12]];
    private previous_poses_2d : any[] = [];
    

    // function extract_poses(heatmaps:any,pafs:any,upsample_ratio:number): any
    // {
       

    //     heatmaps =
    // }


    // function get_root_relative_poses(features:any[][],heatmaps:any[][],pafs:any[][]) : any
    // {
    //     var upsample_ratio = 4;

    // }

}

export { Toy };

    function preprocess(data:any, width:number, height:number) : any
    {
        const dataFromImage = ndarray(new Float32Array(data), [width, height, 4]);
        const dataProcessed = ndarray(new Float32Array(width * height * 3), [1, 3, height, width]);
    
        // Normalize 0-255 to (-1)-1
        ops.divseq(dataFromImage, 128.0);
        ops.subseq(dataFromImage, 1.0);
    
        // Realign imageData from [224*224*4] to the correct dimension [1*3*224*224].
        ops.assign(dataProcessed.pick(0, 0, null, null), dataFromImage.pick(null, null, 2));
        ops.assign(dataProcessed.pick(0, 1, null, null), dataFromImage.pick(null, null, 1));
        ops.assign(dataProcessed.pick(0, 2, null, null), dataFromImage.pick(null, null, 0));
    
        return dataProcessed.data ;
    }

    async function loadOnnx():Promise<any>
    {
        const session = new InferenceSession();
        const url = "./src/models/human-pose-estimation-3d.onnx";
        await session.loadModel(url);

        var imageLoader = new Image();
        imageLoader.src = "1.png"

        const wid = imageLoader.width;
        const hei = imageLoader.height;

        const preprocessedData = preprocess(imageLoader, wid, hei);
        const inputTensor = new onnx.Tensor(preprocessedData, 'float32', [1, 3, wid, hei]);
        const outputMap = await session.run([inputTensor]);
        const outputData = outputMap.values().next().value.data;
        var x = outputData.toString();
        console.log(x);
    }