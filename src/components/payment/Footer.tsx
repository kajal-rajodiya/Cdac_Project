import { Box, Button, CircularProgress, SxProps, Theme } from "@mui/material";

export interface CustomButtonProps {
  btnText: string | JSX.Element;
  disabled?: boolean;
  type?: "button" | "reset" | "submit";
  sx?: SxProps<Theme>;
  className?: string;
  onClickCB?: () => void;
}

interface PaymentFooterProps {
  backButtonProps: CustomButtonProps;
  submitButtonProps: CustomButtonProps;
  isLoading: boolean;
}

const PaymentFooter: React.FunctionComponent<PaymentFooterProps> = ({
  backButtonProps,
  submitButtonProps,
  isLoading,
}) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "end", mt: "40px" }}>
      <Button {...backButtonProps} onClick={backButtonProps.onClickCB}>
        Back
      </Button>
      <Button {...submitButtonProps} type="submit">
        {isLoading ? <CircularProgress size={14} /> : "Make Payment"}
      </Button>
    </Box>
  );
};

export default PaymentFooter;
