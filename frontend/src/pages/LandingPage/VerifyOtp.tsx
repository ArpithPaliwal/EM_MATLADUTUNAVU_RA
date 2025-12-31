import OtpInput from "../../components/Otp/OtpInput";

function VerifyOtp() {
  const handleOtpComplete = (otp: string) => {
    console.log("submitted:", otp);

    
  };

  return (
    <div className="relative flex justify-center items-center bg-background overflow-hidden p-4 min-h-screen">
      <div className="w-full max-w-md bg-accent border border-[#0096c7]/30 p-7 rounded-2xl shadow-lg flex justify-center items-center flex-col">
        <div className="md:h-[20vh] md:w-[20vw]">
          <img
            src="name_light-theme.svg"
            className="block h-full w-full object-contain"
          />
          <img
            src="name_dark-theme.svg"
            className="hidden h-full w-full object-contain"
          />
        </div>

        <OtpInput length={6} onComplete={handleOtpComplete} />
          <button></button>
      </div>
    </div>
  );
}

export default VerifyOtp;
