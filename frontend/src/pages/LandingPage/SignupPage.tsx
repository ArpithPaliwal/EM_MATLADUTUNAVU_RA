import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signupSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
      "Password must contain at least one letter and one number"
    ),
  avatar: z
    .any()
    .refine((files) => files?.length === 1, "Avatar image is required")
    .refine(
      (files) =>
        ["image/jpeg", "image/png", "image/webp"].includes(files?.[0]?.type),
      "Only JPEG, PNG, or WEBP images are allowed"
    )
    .refine(
      (files) => files?.[0]?.size <= 2 * 1024 * 1024,
      "File must be smaller than 2MB"
    ),
});

function SignupPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm({
      resolver: zodResolver(signupSchema),
    });

  const onSubmit = (data: z.infer<typeof signupSchema>) => {
    console.log("validated data:", data);
  };

  return (
    <div className="relative flex justify-center items-center bg-background overflow-hidden p-4 min-h-screen">
      <div className="w-full max-w-md bg-accent border border-[#0096c7]/30 p-7 rounded-2xl shadow-lg flex justify-center items-center flex-col">
        {/* <h1 className="text-[#0175FE] text-4xl font-bold text-center mb-6">
            Sign Up
        </h1> */}
        <div className="md:h-[20vh] md:w-[20vw]">
           
            <img
              src="name_light-theme.svg"
              className="block  h-full w-full object-contain"
            />
            <img
              src="name_dark-theme.svg"
              className="hidden  h-full w-full object-contain"
            />
          </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-text mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-[#0175FE]"
              {...register("username")}
            />
            <p className="text-red-500 text-sm mt-1">
              {errors.username?.message}
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-text mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-[#0175FE]"
              {...register("email")}
            />
            <p className="text-red-500 text-sm mt-1">
              {errors.email?.message}
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-text mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-[#0175FE]"
              {...register("password")}
            />
            <p className="text-red-500 text-sm mt-1">
              {errors.password?.message}
            </p>
          </div>

          {/* Avatar */}
          <div>
            <label className="block text-sm font-semibold text-text mb-1">
              Avatar Image
            </label>
            <input
              type="file"
              accept=".jpeg,.png,.webp"
              className="w-full text-sm border border-gray-300 rounded-lg p-1 text-text focus:outline-none focus:ring-2 focus:ring-[#0175FE]"
              {...register("avatar")}
            />
            <p className="text-red-500 text-sm mt-1">
              {errors.avatar?.message as string}
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0096c7] hover:bg-[#0163D2] text-white font-semibold py-2 rounded-lg transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting…" : "Create My Kingdom "}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
