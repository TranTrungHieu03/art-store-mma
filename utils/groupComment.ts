import {IComment} from "@/app/(tabs)";

interface IGroupComment {
    rating: 0 | 1 | 2 | 3 | 4 | 5,
    comments: IComment[],
}

export const averageRating = (comments: IComment[]) => {

}