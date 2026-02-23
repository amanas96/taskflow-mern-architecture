import { AxiosError } from "axios";

export const handleApiError = (error: unknown): string => {
  const err = error as AxiosError<any>;

  if (err.response?.data?.errors) {
    return err.response.data.errors[0]?.message;
  }

  if (err.response?.data?.message) {
    return err.response.data.message;
  }

  return "Something went wrong.";
};
