import * as yup from "yup";

export const avatarNameDto = yup.object().shape({
    name: yup.string().required()
});
