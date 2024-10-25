import {IComment} from "@/app/(tabs)";

export interface IGroupComment {
    rating: 0 | 1 | 2 | 3 | 4 | 5,
    comments: IComment[],
}

export const groupComment = (comments: IComment[]): IGroupComment[] => {
    
    let data: IGroupComment[] = [
        {
            rating: 0,
            comments: [],
        },
        {
            rating: 1,
            comments: [],
        },
        {
            rating: 2,
            comments: [],
        },
        {
            rating: 3,
            comments: [],
        },
        {
            rating: 4,
            comments: [],
        }, {
            rating: 5,
            comments: [],
        }
    ]
    for (let comment of comments) {
        let index = comment.rating;
        
        switch (comment.rating) {
            case index:
                console.log("cmt",comment.rating);
                data[index].comments.push(comment)
                break;
            default:
                break
        }
    }
    
    return data;
}