import {IComment} from "@/app/(tabs)";

export const averageRating = (comments: IComment[])=> {
    if (comments.length == 0) {
        return 5.0;
    } else if (comments.length > 0) {
        const length = comments.length;
        let total = 0;
        for (let comment of comments) {
            total += comment.rating
        }
        
        return  (total / length).toFixed(1);
    }
    return 5.0;
    
}