type DataRequestLogin = "email" | "password" | "name";

type ErrorsType = {
    [key in DataRequestLogin]: string[];
};

export interface Errors extends ErrorsType { }
