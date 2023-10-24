import Joi from "joi";

const middleware = (schema, property) => {
  return (req, res, next) => {
    //   const { error } = Joi.validate(req.body, schema);
    console.log(req.body);
    const error = schema.validate(req.body);

    const valid = error == null;
    if (valid) {
      next();
    } else {
      next();
      console.log(error);

      // const { details } = error;
      // console.log(details)

      // console.log("error", message);
      res.status(422).json({ error: message });
    }
  };
};

export default middleware;
