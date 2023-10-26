import * as yup from "yup";

export const wordsDto = yup.object().shape({
    words: yup.array().of(yup.string()).required().min(1)
});
