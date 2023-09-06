import {
  Box,
  CircularProgress,
  Grid,
  InputLabel,
  Typography,
} from "@mui/material";
import axios from "axios";
import braintree, { HostedFields, HostedFieldsEvent } from "braintree-web";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";

import PaymentFooter from "../Footer";
import { API_URL } from "../../common/URL";
import { HostedFieldsHostedFieldsFieldData } from "braintree-web/hosted-fields";

// import "./style.css";

interface BraintreePaymentProps {
  onCancel: () => void;
  onSuccess: () => void;
  selectedPlan: any;
}

type ErrorType =
  | "number"
  | "cvv"
  | "expirationDate"
  | "postalCode"
  | "cardholderName";

type Errors = {
  number: string;
  cvv: string;
  expirationDate: string;
  postalCode: string;
  cardholderName: string;
};

const defaultErrors: Errors = {
  number: "",
  cvv: "",
  expirationDate: "",
  postalCode: "",
  cardholderName: "",
};

const tempAuthorization = "sandbox_x653mzjt_9c6q8k6bss7gt5gj";

const BraintreePayment: React.FunctionComponent<BraintreePaymentProps> = ({
  selectedPlan,
  onCancel,
  onSuccess,
}) => {
  const [authorization, setAuthorization] = useState<string>(tempAuthorization);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>(defaultErrors);
  const [braintreeInstance, setBraintreeInstance] = useState<HostedFields>();

  useEffect(() => {
    loadBraintree();
  }, []);

  useEffect(() => {
    console.log("braintree - ", selectedPlan);
  }, [selectedPlan]);

  const ErrorLabelStyle = {
    margin: "0.25rem 0 0 0",
    color: "#df1b41",
    fontSize: "0.8rem",
    fontFamily: "poppins",
    fontWeight: 500,
  };

  const InputLabelStyle = {
    color: "black",
    fontSize: "14px",
    fontWeight: "500",
    mb: "10px",
    fontFamily: "poppins",
  };

  const TextFieldStyle = {
    ".MuiOutlinedInput-notchedOutline": {
      border: `1px solid red`,
    },
    ".MuiInputBase-root": {
      height: "54px",
      borderRadius: "6px",
      fontWeight: "normal",
      color: "black",
      backgroundColor: "#f0e9e9",
    },
    "&.Mui-focused": {
      outline: "none",
      border: `1px solid red`,
    },
    ".Mui-error": ErrorLabelStyle,
  };

  const ElementWrapperStyle = {
    borderRadius: "6px",
    padding: "16.5px 14px",
    background: "#f0e9e9",
    "> div": {
      height: "1.4375em",
    },
  };

  const styles = {
    input: {
      height: "54px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "normal",
      color: "black",
      backgroundColor: "#f0e9e9",
      border: `1px solid red`,
    },
    "::placeholder": {
      color: "black",
    },
    ":focus": {
      outline: "none",
      border: `1px solid red`,
    },
    ".valid": {
      color: "black",
    },
    ".invalid": {
      color: "#df1b41",
      fontFamily: "poppins",
      fontWeight: 500,
    },
  };

  const fields = {
    number: {
      selector: "#card-number",
      placeholder: "1111 1111 1111 1111",
    },
    cvv: {
      selector: "#cvv",
      placeholder: "111",
    },
    expirationDate: {
      selector: "#expiration-date",
      placeholder: "MM/YY",
    },
    cardholderName: {
      selector: "#cardholder-name",
      placeholder: "Name on card",
    },
    postalCode: {
      selector: "#postal-code",
      placeholder: "11111",
    },
  };

  const loadBraintree = async () => {
    try {
      const client = await braintree.client.create({
        authorization,
      });

      const instance = await braintree.hostedFields.create({
        client,
        styles,
        fields,
      });

      const onBlur = (event: HostedFieldsEvent) => {
        const field = event.emittedBy;
        const hostedField: HostedFieldsHostedFieldsFieldData =
          event.fields[field];

        validateField(field, hostedField);
      };

      instance.on("blur", onBlur);
      setBraintreeInstance(instance);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const validateField = (
    field: string,
    hostedField: HostedFieldsHostedFieldsFieldData
  ) => {
    if (hostedField) {
      if (hostedField.isEmpty) {
        setErrors((err) => ({
          ...err,
          [field]: `Your ${field} is incomplete.`,
        }));
      } else if (!hostedField.isValid) {
        setErrors((err) => ({
          ...err,
          [field]: `Your ${field} is invalid.`,
        }));
      } else {
        setErrors((err) => ({
          ...err,
          [field]: "",
        }));
      }
    }
  };

  const validateFields = () => {
    ["number", "cvv", "expirationDate", "cardholderName", "postalCode"].forEach(
      (field) => {
        const hostedField: HostedFieldsHostedFieldsFieldData =
          // @ts-ignore
          braintreeInstance?.getState().fields[field];
        validateField(field, hostedField);
      }
    );
  };

  const isFormInValid =
    !braintreeInstance ||
    errors.number ||
    errors.cvv ||
    errors.expirationDate ||
    errors.cardholderName ||
    errors.postalCode;

  const onSubmit = async () => {
    try {
      if (isFormInValid) {
        return;
      }
      setIsLoading(true);

      // Tokenize card
      const paymentMethodNonce = await braintreeInstance.tokenize();
      console.log(paymentMethodNonce.nonce);
      console.log(selectedPlan);
      // Make payment
      const res = await axios.post(API_URL + "makePayment", {
        amount: selectedPlan.price,
        userId: localStorage.getItem("id"),
        planId: selectedPlan.plan_id,
        nonce: paymentMethodNonce.nonce,
      });
      console.log(res);
      onSuccess();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Your email is invalid.")
      .required("Your email is incomplete."),
  });

  const getInitialValues = () => ({
    email: "",
  });

  const ErrorMessage = ({ elementKey }: { elementKey: ErrorType }) =>
    errors[elementKey] ? (
      <Typography sx={ErrorLabelStyle}>{errors[elementKey]}</Typography>
    ) : null;

  return (
    <Formik
      initialValues={getInitialValues()}
      validateOnMount={true}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ handleSubmit }) => {
        const onHandleSubmit = () => {
          validateFields();
          handleSubmit();
        };
        return (
          <Form id="braintree-payment-form" onSubmit={handleSubmit}>
            <Box sx={{ marginBottom: "0.75rem" }}>
              <InputLabel sx={InputLabelStyle}>Name on the card</InputLabel>
              <Box
                sx={ElementWrapperStyle}
                color={errors.cardholderName ? "#df1b41" : "#f0e9e9"}
              >
                <div id="cardholder-name" className="hosted-field"></div>
              </Box>
              <ErrorMessage elementKey={"cardholderName"} />
            </Box>
            <Box sx={{ marginBottom: "0.75rem" }}>
              <InputLabel sx={InputLabelStyle}>Card number</InputLabel>
              <Box
                style={styles.input}
                id="card-number"
                className="hosted-field"
              />
              <ErrorMessage elementKey={"number"} />
            </Box>
            <Grid container spacing={2}>
              <Grid item md={6} sm={12}>
                <Box sx={{ marginBottom: "0.75rem" }}>
                  <InputLabel sx={InputLabelStyle}>Due date</InputLabel>
                  <Box
                    sx={ElementWrapperStyle}
                    color={errors.expirationDate ? "#df1b41" : "#f0e9e9"}
                  >
                    <div id="expiration-date" className="hosted-field"></div>
                  </Box>
                  <ErrorMessage elementKey={"expirationDate"} />
                </Box>
              </Grid>
              <Grid item md={6} sm={12}>
                <Box sx={{ marginBottom: "0.75rem" }}>
                  <InputLabel sx={InputLabelStyle}>CVV</InputLabel>
                  <Box
                    sx={ElementWrapperStyle}
                    color={errors.cvv ? "#df1b41" : "black"}
                  >
                    <div id="cvv" className="hosted-field"></div>
                  </Box>
                  <ErrorMessage elementKey={"cvv"} />
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ marginBottom: "0.75rem" }}>
              <InputLabel sx={InputLabelStyle}>Postal code</InputLabel>
              <Box
                sx={ElementWrapperStyle}
                color={errors.postalCode ? "#df1b41" : "black"}
              >
                <div id="postal-code" className="hosted-field"></div>
              </Box>
              <ErrorMessage elementKey={"postalCode"} />
            </Box>
            <Box sx={{ marginBottom: "0.75rem" }}>
              <InputLabel sx={InputLabelStyle}>E-mail</InputLabel>
              <Field
                fullWidth
                data-cy="email"
                placeholder="email"
                sx={TextFieldStyle}
                component={TextField}
                name="email"
              />
            </Box>
            <footer>
              <PaymentFooter
                backButtonProps={{
                  disabled: isLoading || !braintreeInstance,
                  onClickCB: onCancel,
                  btnText: "Back",
                }}
                submitButtonProps={{
                  disabled: isLoading || !braintreeInstance,
                  onClickCB: onHandleSubmit,
                  btnText: "Make Payment",
                }}
                isLoading={isLoading}
              />
            </footer>
          </Form>
        );
      }}
    </Formik>
  );
};

export default BraintreePayment;
