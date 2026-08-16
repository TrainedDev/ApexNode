import { useState, useEffect } from "react"; // 1. FIXED: Imported useEffect
import { useSelector, useDispatch } from "react-redux";

import ProfileCard from "../components/ProfileCard";
import ProfileForm from "../components/ProfileForm";
import ProfileSkeleton from "../components/ProfileSkeleton";
import ProfileErrorState from "../components/ProfileErrorState";
import SuccessBanner from "../components/SuccessBanner";
import { fetchProfile } from "../profileSlice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectors
  const {
    data: user,
    loading,
    error: { fetchProfileErr },
  } = useSelector((state) => state.profile);

  const [showSuccess, setShowSuccess] = useState(false);

  const handleRetry = async () => {
    try {
      await dispatch(fetchProfile()).unwrap();
    } catch (err) {
      if (
        err?.status === 400 ||
        err?.message === "No profile found. Create yours today"
      ){
        navigate("/create-profile")
      }
        console.error(err);
    }
  };

  // 2. FIXED: Changed useDispatch to useEffect here
  useEffect(() => {
    const userProfile = async () => {
      try {
        console.log("Fetching profile on mount...");
        const res = await dispatch(fetchProfile()).unwrap();
        if (res) {
          setShowSuccess(true);
        }
      } catch (error) {
        console.log("Failed to fetch profile:", error);
      }
    };

    userProfile();
  }, [dispatch]); // Runs once when component mounts

  // Conditional layouts based on state
  if (loading) return <ProfileSkeleton />;
  if (fetchProfileErr)
    return (
      <ProfileErrorState onRetry={handleRetry} errorMsg={fetchProfileErr} />
    );

    if(user)
  return (
    <div className="min-h-screen bg-slate-50"> 
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          User Profile
        </h1>

        {showSuccess && <SuccessBanner className="mb-6" />}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
            <ProfileCard
              fullName={user.fullName}
              phone={user.phone}
              city={user.city}
              country={user.country}
            />

          <ProfileForm mode={user ? "edit" : "create"}user={user} values={user} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
