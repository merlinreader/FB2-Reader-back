import * as yup from "yup";

export const anonymStatisticDto = yup.object().shape({
    deviceId: yup.string().required(),
    country: yup.string().required(),
    area: yup.string().required(),
    city: yup.string().required(),
    pageCount: yup.number().min(0).required()
});
