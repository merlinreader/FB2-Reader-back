import * as yup from "yup";

export const nameEditDto = yup.object().shape({
    firstName: yup.string().min(1),
    lastName: yup.string().min(1)
});
