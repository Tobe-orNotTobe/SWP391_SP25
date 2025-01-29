export interface SignUp{
    username: string;
    password: string;
    fullname: string; 
    email: string;
    phoneNumber: string;
    address: string; 
    dateOfBirth: string;
}

export interface SignIn{
    email: string;
    username: string;
}