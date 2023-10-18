import * as yup from "yup";

export const getStatisticsDto = yup.object().shape({
    region: yup.string(),
    country: yup.string().required(),
    city: yup.string()
});
