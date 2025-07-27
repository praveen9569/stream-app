import React from "react";
import { ShipWheel } from "lucide-react";
import { Link } from "react-router"; // ✅ Corrected import

const SignUpPage = () => {
  const [signupData, setSignupData] = React.useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleSignup = (e) => {
    e.preventDefault();
    // You can handle form submission here
  };

  return (
    <div
      className="flex items-center justify-center h-screen p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="flex flex-col lg:flex-row border border-primary/25 w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* Left side - Sign up form */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col justify-center">
          {/* Logo */}
          <div className="flex items-center justify-start mb-4 gap-2">
            <ShipWheel className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              stream-app
            </span>
          </div>

          {/* Sign up form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Create an Account</h2>
              <p className="text-sm opacity-70">
                Join Stream-App and start your journey with us.
              </p>
            </div>

            <div className="space-y-3">
              {/* Full name */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="john doe"
                  className="input input-bordered w-full"
                  value={signupData.fullName}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      fullName: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* Email */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="abc@gmail.com"
                  className="input input-bordered w-full"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* Password */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="********"
                  className="input input-bordered w-full"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      password: e.target.value,
                    })
                  }
                  required
                />
                <p className="text-xs opacity-70 mt-1">
                  Password must be at least 8 characters long.
                </p>
              </div>

              {/* Terms and conditions */}
              <div className="form-control w-full">
                <label className="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    required
                  />
                  <span className="label-text ml-2">
                    I agree to the terms and conditions
                  </span>
                </label>
              </div>
            </div>

            {/* Submit button */}
            <button className="btn btn-primary w-full" type="submit">
              Create Account
            </button>

            {/* Link to login */}
            <div className="text-center mt-4">
              <p className="text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Right side image */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/i.png"
                alt="Language connection illustration"
                className="w-full h-full"
              />
            </div>
            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Connect with the world through Stream-App
              </h2>
              <p className="opacity-70">
                Join us to explore, connect, and share your journey with others.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
