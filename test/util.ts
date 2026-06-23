export const checkErrorMessage = (err: unknown, desiredErrMessage: string) => {
    
    if (err instanceof Error) {
        return err.message.includes(desiredErrMessage)
    }

    return false;

}