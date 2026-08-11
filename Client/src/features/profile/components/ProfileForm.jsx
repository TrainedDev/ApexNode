import {
  User,
  Phone,
  Home,
  Building2,
  MapPin,
  Map,
  Globe,
  Save,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { createProfile, updateProfile } from "../profileSlice";
import { useNavigate } from "react-router-dom";

function FormField({
  label,
  name,
  icon: Icon,
  register,
  placeholder,
  className = "",
  type = "text",
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />

        <input
          type={type}
          placeholder={placeholder}
          {...register(name)}
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-50"
        />
      </div>
    </div>
  );
}

export default function ProfileForm({
  mode = "create",
  user,
  values = {
    fullName: "",
    phoneNumber: "",
    address: "",
    area: "",
    city: "",
    state: "",
    country: "",
  },
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    loading,
    error: { createProfileErr, updateProfileErr },
  } = useSelector((state) => state.profile);
  console.log(user);

  const isCreate = mode === "create";

  const { register, handleSubmit } = useForm({
    defaultValues: values,
  });

  console.log(mode, isCreate);

  const onSubmit = async (data) => {
    try {
      console.log(data.phoneNumber);

      if (isCreate) {
        await dispatch(createProfile(data)).unwrap();
        //  navigate("/profile");
      } else {
        await dispatch(updateProfile(data)).unwrap();
      }
      alert(isCreate ? "Profile Created" : "Profile Updated");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-card sm:p-8">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">
          {isCreate ? "Create Your Profile" : "Profile Information"}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {isCreate
            ? "Add your details to get started with faster checkout."
            : "Update your personal and delivery details."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2"
      >
        <FormField
          label="Full Name"
          name="fullName"
          icon={User}
          register={register}
          placeholder="Enter your full name"
        />

        <FormField
          label="Phone Number"
          name="phoneNumber"
          icon={Phone}
          register={register}
          type="tel"
          placeholder="Enter your phone number"
        />

        <FormField
          label="Address"
          name="address"
          icon={Home}
          register={register}
          placeholder="House number, street, apartment"
          className="sm:col-span-2"
        />

        <FormField
          label="Area"
          name="area"
          icon={Building2}
          register={register}
          placeholder="Enter your area"
        />

        <FormField
          label="City"
          name="city"
          icon={MapPin}
          register={register}
          placeholder="Enter your city"
        />

        <FormField
          label="State"
          name="state"
          icon={Map}
          register={register}
          placeholder="Enter your state"
        />

        <FormField
          label="Country"
          name="country"
          icon={Globe}
          register={register}
          placeholder="Enter your country"
        />

        {(createProfileErr || updateProfileErr) && (
          <div className="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {createProfileErr?.message ||
              updateProfileErr?.message ||
              "Something went wrong."}
          </div>
        )}

        <div className="sm:col-span-2 mt-3 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isCreate ? "Creating..." : "Saving..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isCreate ? "Create Profile" : "Save Changes"}
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
