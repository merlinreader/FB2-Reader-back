/* eslint-disable indent */
import _ from "lodash";
import Yup from "yup";

const errorParser = (errors) =>
    errors.inner.map((e) => ({
        type: e.type,
        stack: e.path.split("."),
        message: e.message
    }));

export const CONTEXT = {
    QUERY: "query",
    PATH: "params",
    BODY: "body"
};

Yup.addMethod(Yup.string, "isTrim", function () {
    return this.test("trim", "${path} is empty value", (value) => {
        if (value || value == "") {
            return value.trim() !== "";
        }
        return true;
    });
});

Yup.addMethod(Yup.array, "unique", function (message = "array is not unique", mapper = (x) => x) {
    return this.test("unique", `\${path} ${message}`, function (list) {
        if (list) {
            return list.length === new Set(list.map(mapper)).size;
        }
        return false;
    });
});

export class Validator {
    static validate =
        (schema, payloadKey = CONTEXT.BODY, options = {}) =>
        async (req, res, next) => {
            const data = req[payloadKey];
            options = { abortEarly: false, ...options };
            try {
                let fieldKeys = [];
                for (const s of [schema].flat()) {
                    fieldKeys = [...fieldKeys, ...Object.keys(s.fields)];
                    await s.validate(data, options);
                }
                req[payloadKey] = _.pick(data, fieldKeys);
                next();
            } catch (ex) {
                const errors = errorParser(ex);
                return res.status(422).json({ errors });
            }
        };
}
