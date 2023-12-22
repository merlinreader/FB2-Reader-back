import * as yup from "yup";

export const nounsCheckDto = yup.object().shape({
    words: yup.array().of(yup.string().required())
});
