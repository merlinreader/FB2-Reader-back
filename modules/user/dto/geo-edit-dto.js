import * as yup from "yup";

export const geoByCoordsDTO = yup.object().shape({
    latitude: yup.number().required(),
    longitude: yup.number().required()
});

export const geoByNamesDTO = yup.object().shape({
    country: yup.string().required(),
    city: yup.string().required(),
    area: yup.string().required()
});
