import * as yup from "yup";

export const userStatisticDto = yup.object().shape({
    pageCountSimpleMode: yup.number().min(0).required(),
    pageCountWordMode: yup.number().min(0).required(),
    date: yup.date().required(),
    startReading: yup.date().required()
});
