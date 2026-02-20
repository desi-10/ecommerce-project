export const apiResponse = <T>(message: string, data: T) => {
  return {
    message,
    data: data,
  };
};
