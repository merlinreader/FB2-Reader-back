import * as yup from "yup";

export const loginDto = yup.object().shape({
    telegramId: yup.string().required(),
    firstName: yup.string().min(1).required(),
    lastName: yup.string().min(1).nullable()
});
