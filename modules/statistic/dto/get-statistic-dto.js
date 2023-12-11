import * as yup from "yup";

export const SORT_FIELDS = {
    // WORDS: "wordsCounter",
    SIMPLE_MODE: "totalPageCountSimpleMode",
    WORD_MODE: "totalPageCountWordMode"
};

export const PERIOD = {
    ANNUAL: "annual",
    SEMI_ANNUAL: "semi-annual",
    MONTHLY: "monthly",
    WEEKLY: "weekly",
    DAILY: "daily"
};

export const getStatisticsDto = yup.object().shape({
    area: yup.string(),
    city: yup.string(),
    sortBy: yup.string().oneOf(Object.values(SORT_FIELDS)).required()
});

export const periodDto = yup.object().shape({
    period: yup.string().oneOf(Object.values(PERIOD)).required()
});
