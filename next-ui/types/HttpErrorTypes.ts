type DataRequestLogin = "email" | "password" | "name" | "password_confirmation";

type ErrorsType = {
    [key in DataRequestLogin]: string[];
};

export interface Errors extends ErrorsType { }
