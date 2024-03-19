import * as yup from "yup";

export const geoByCoordsDTO = yup.object().shape({
    latitude: yup.number().required(),
    longitude: yup.number().required()
});
