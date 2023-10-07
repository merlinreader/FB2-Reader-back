import * as yup from "yup";

export const mongoIdArrayDto = yup.object().shape({
    ids: yup
        .array()
        .of(
            yup
                .string()
                .matches(/^[a-fA-F0-9]{24}$/, "Must be objectId format")
                .required()
        )
        .min(1)
        .unique("array is not unique")
        .required()
});

export const mongoIdDto = yup.object().shape({
    id: yup
        .string()
        .matches(/^[a-fA-F0-9]{24}$/, "Must be objectId format")
        .required()
});

export const mongoRegexIdDto = yup.string().matches(/^[a-fA-F0-9]{24}$/, "Must be objectId format");
