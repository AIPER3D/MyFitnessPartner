class Toy
{
    private AVG_PERSON_HEIGHT : number = 100;
    private map_id_to_panoptic : number[] = [1, 0, 9, 10, 11, 3, 4, 5, 12, 13, 14, 6, 7, 8, 15, 16, 17, 18];
    private limbs : Array<number[]> = [[18, 17, 1],[16, 15, 1],[5, 4, 3],[8, 7, 6],[11, 10, 9],[14, 13, 12]];
    private previous_poses_2d : any[] = [];

    // function extract_poses(heatmaps:any[][],pafs:any[][] , upsample_ratio:number): any
    // {
    //     heatmaps = transpose
    // }


    // function get_root_relative_poses(features:any[][],heatmaps:any[][],pafs:any[][]) : any
    // {
    //     var upsample_ratio = 4;

    // }

}

export { Toy };