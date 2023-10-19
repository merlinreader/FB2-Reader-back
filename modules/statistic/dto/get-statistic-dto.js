import * as yup from "yup";

export const getStatisticsDto = yup.object().shape({
    region: yup.string(),
    city: yup.string()
});
