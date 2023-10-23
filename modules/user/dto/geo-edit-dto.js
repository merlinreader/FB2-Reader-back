import * as yup from "yup";

export const geoSetDTO = yup.object().shape({
    country: yup.string().required(),
    city: yup.string().required(),
    area: yup.string().required()
});
