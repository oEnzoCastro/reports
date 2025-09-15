type Dependent = {
  id: string;
  name: string;
  email?: string;
  gender: string;
  birthdate?: string;
  phoneNumber?: string;
  type: string;
};

type Client = {
  id: number;
  name: string;
  email: string;
  profession: string;
  phoneNumber: string;
  gender: string;
  birthDate: Date;
  maritalStatus: string;
  address?: string;
  addressNumber?: string;
  addressComplement?: string;
  partnerName?: string;
  partnerPhoneNumber?: string;
  partnerEmail?: string;
  partnerGender?: string;
  partnerProfession?: string;
  partnerBirthDate?: Date;
  dependents?: Dependent[];
};

export type { Client, Dependent };
