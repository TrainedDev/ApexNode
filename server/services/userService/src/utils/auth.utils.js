export const filterProfileData = (profileData) => {
  const data = {};

  if (profileData.fullName && profileData.fullName.trim() !== "")
    data.fullName = profileData.fullName;

  if (profileData.area && profileData.area.trim() !== "")
    data.area = profileData.area;
  if (profileData.state && profileData.state.trim() !== "")
    data.state = profileData.state;
  if (profileData.country && profileData.country.trim() !== "")
    data.country = profileData.country;
  if (profileData.address && profileData.address.trim() !== "")
    data.address = profileData.address;
  if (
    profileData.phoneNumber &&
    profileData.phoneNumber.trim() !== "" &&
    profileData.phoneNumber.length === 10
  )
    data.phoneNumber = profileData.phoneNumber;

    return data;
};
