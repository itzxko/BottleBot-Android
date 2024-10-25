import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Admin/Navbar";
import { useAuth } from "../../context/AuthProvider";
import Image from "../../assets/Man.jpg";

//icons
import { RiLoginBoxLine } from "react-icons/ri";

const Profile = () => {
  const { onLogout, user } = useAuth();

  //data
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [gender, setGender] = useState("");
  const [civilStatus, setCivilStatus] = useState("");
  const [nationality, setNationality] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [brgy, setBrgy] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [occupation, setOccupation] = useState("");
  const [password, setPassword] = useState("");
  const [level, setLevel] = useState("");

  //initialize data
  useEffect(() => {
    setFirstName(user?.personalInfo.firstName);
    setMiddleName(user?.personalInfo.middleName);
    setLastName(user?.personalInfo.lastName);

    //date
    const date = new Date(user.personalInfo.dateOfBirth);
    setBirthDate(date);
    setFormattedBirthDate(formatDate(date));

    setGender(user?.personalInfo.gender);
    setCivilStatus(user?.personalInfo.civilStatus);
    setNationality(user?.personalInfo.nationality);
    setHouseNumber(user?.contactInfo.address.houseNumber.toString());
    setStreet(user?.contactInfo.address.street);
    setBrgy(user?.contactInfo.address.barangay);
    setCity(user?.contactInfo.address.city);
    setPhoneNumber(user?.contactInfo.phoneNumbers[0]);
    setEmploymentStatus(user?.economicInfo.employmentStatus);
    setOccupation(user?.economicInfo.occupation);
    setEmail(user.credentials.email);
    setPassword(user?.credentials.password);
    setLevel(user?.credentials.level);
  }, []);

  return (
    <>
      <Navbar />
      <div className="w-full min-h-[100svh] flex flex-col space-y-6 items-center justify-start bg-[#E6E6E6] px-4 py-6 font-dm tracking-normal">
        <div className="w-full md:w-[820px] flex flex-row justify-between items-center">
          <p className="text-sm font-semibold">User Profile</p>
          <RiLoginBoxLine
            size={16}
            color="black"
            className="cursor-pointer"
            onClick={onLogout}
          />
        </div>
        <div className="w-full md:w-[820px] flex flex-col items-center justify-center bg-[#FAFAFA] rounded-xl tracking-normal">
          <div className="w-full flex flex-row items-center justify-start space-x-4 p-8">
            <div className="h-[100px] w-[100px] rounded-full overflow-hidden">
              <img src={Image} alt="/" className="object-cover" />
            </div>
            <div className="w-3/5 flex flex-col truncate items-start justify-center">
              <p className="text-md font-semibold">{`${user.personalInfo.firstName} ${user.personalInfo.lastName}`}</p>
              <div className="flex items-center justify-center px-2 py-1 rounded-md bg-[#699900]">
                <p className="text-xs text-white font-normal uppercase">
                  #{user._id}
                </p>
              </div>
            </div>
          </div>
          <div className="w-full border-b border-black/5"></div>
          <div className="w-full flex flex-col items-center justify-center p-8">
            <div className="w-full flex flex-col items-center justify-center space-y-4">
              <div className="w-full flex flex-row justify-between items-center">
                <p className="text-xs font-semibold w-1/2 truncate">
                  First Name
                </p>
                <input
                  type="text"
                  className="outline-none border-none text-xs text-right w-1/2 truncate bg-[#FAFAFA]"
                />
              </div>
              <div className="w-full flex flex-row justify-between items-center">
                <p className="text-xs font-semibold w-1/2 truncate">
                  Middle Name
                </p>
                <input
                  type="text"
                  className="outline-none border-none text-xs text-right w-1/2 truncate bg-[#FAFAFA]"
                />
              </div>
              <div className="w-full flex flex-row justify-between items-center">
                <p className="text-xs font-semibold w-1/2 truncate">
                  Last Name
                </p>
                <input
                  type="text"
                  className="outline-none border-none text-xs text-right w-1/2 truncate bg-[#FAFAFA]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
