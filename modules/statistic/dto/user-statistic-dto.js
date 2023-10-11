import * as yup from "yup";

export const userStatisticDto = yup.object().shape({
    pageCount: yup.number().min(0).required()
});
