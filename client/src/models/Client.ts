type Dependent = {
  id: string;
  name: string;
  email?: string;
  gender: string;
  birthdate?: string;
  phonenumber?: string; // Note: using lowercase to match server response
  type: string;
  clientid: string; // Add clientid field
};

type Client = {
  id: number;
  name: string;
  email: string;
  profession: string;
  phonenumber: string;
  gender: string;
  birthdate: Date;
  maritalstatus: string;
  address?: string;
  addressnumber?: string;
  addresscomplement?: string;
  partnerName?: string;
  partnerPhoneNumber?: string;
  partnerEmail?: string;
  partnerGender?: string;
  partnerProfession?: string;
  partnerBirthDate?: Date;
};

export type { Client, Dependent };
