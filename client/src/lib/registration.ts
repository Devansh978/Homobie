export interface LocationRequest {
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
}

export interface BuilderRegistrationRequest {
  companyName: string;
  location: LocationRequest;
}

export interface UserRegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface UserWithRoleRegistrationRequest {
  user: UserRegistrationRequest;
  roleData: BuilderRegistrationRequest | null;
}

export type Role = 'USER' | 'BUILDER';