import { Stack, TextField, Typography, type TextFieldProps } from "@mui/material";

type AuthTextFieldProps = Omit<TextFieldProps, "label" | "sx" | "variant"> & {
  label: string;
};

export function AuthTextField({ label, ...props }: AuthTextFieldProps) {
  const baseSx = {
    "& .MuiInputBase-root": {
      color: "text.primary",
    },
    "& .MuiInput-root": {
      "&::before": {
        borderBottomColor: "divider",
      },
      "&::after": {
        borderBottomColor: "primary.main",
      },
      "&:hover:not(.Mui-disabled, .Mui-error)::before": {
        borderBottomColor: "primary.main",
      },
    },
    "& .MuiFormHelperText-root": {
      ml: 0,
    },
  } as const;

  return (
    <Stack spacing={1}>
      <Typography sx={{ color: "text.primary", fontSize: "0.98rem", fontWeight: 600 }}>
        {label}
      </Typography>
      <TextField
        fullWidth
        placeholder={typeof props.placeholder === "string" ? props.placeholder : undefined}
        sx={baseSx}
        variant="standard"
        {...props}
      />
    </Stack>
  );
}
