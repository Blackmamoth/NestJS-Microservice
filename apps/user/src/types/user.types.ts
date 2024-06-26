export type GetUserQuery = {
  email?: string;
  username?: string;
  birthDate?: {
    $gte?: Date;
    $lte?: Date;
  };
};
