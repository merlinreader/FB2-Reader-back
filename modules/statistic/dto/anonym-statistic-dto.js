import * as yup from "yup";

export const anonymStatisticDTO = yup.object().shape({
    deviceId: yup.string().required(),
    country: yup.string().required(),
    city: yup.string().required(),
    pageCount: yup.number().min(0).required()
});
