import * as yup from "yup";

export const loginDto = yup.object().shape({
    id: yup.string().required(),
    first_name: yup.string().min(1).required(),
    second_name: yup.string().min(1)
});
