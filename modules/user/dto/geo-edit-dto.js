import * as yup from "yup";

export const geoSetDTO = yup.object().shape({
    latitude: yup.number().required(),
    longitude: yup.number().required()
});
