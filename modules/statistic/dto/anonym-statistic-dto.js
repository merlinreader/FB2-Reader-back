import * as yup from "yup";

export const anonymStatisticDto = yup.object().shape({
    deviceId: yup.string().required(),
    country: yup.string().required(),
    area: yup.string().required(),
    city: yup.string().required(),
    pageCountSimpleMode: yup.number().min(0).required(),
    pageCountWordMode: yup.number().min(0).required(),
    date: yup.date().required()
});
