import { Alert, Button, Stack } from "@mui/material";

type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ title = "Something went wrong", message, onRetry }: ErrorStateProps) {
  return (
    <Alert
      action={
        onRetry ? (
          <Button color="inherit" onClick={onRetry} size="small">
            Retry
          </Button>
        ) : undefined
      }
      severity="error"
      variant="outlined"
    >
      <Stack spacing={0.5}>
        <strong>{title}</strong>
        <span>{message}</span>
      </Stack>
    </Alert>
  );
}
