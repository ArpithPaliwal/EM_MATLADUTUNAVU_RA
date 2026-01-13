import type { ApiError } from "../dto/apiError"
import type { RegisterResponseDto } from "../dto/auth.dto";
import api from "../utils/axiosInstanceUser";
import { AxiosError } from "axios";

export const initiateRegisterUser = async (formData: FormData): Promise<void> => {
  try {
    console.log("sent succe");

    const res = await api.post("/users/signupInitialize", formData, { withCredentials: true });
    console.log("check");

    console.log(res);


    return res.data.data;
  } catch (error: unknown) {


    if (error instanceof AxiosError && error?.response) {
      const apiError: ApiError = {
        status: error.response.status,
        message: error.response.data.message,
        errors: error.response.data.errors || [],
      };

      throw apiError;
    }

    throw {
      status: 500,
      message: "Network error or server is down",
      errors: [],
    } as ApiError;
  }
}
type SubmitOtpPayload = {
  email: string;
  otpValue: string;
};

export const submitOtp = async ({ email, otpValue }: SubmitOtpPayload): Promise<RegisterResponseDto> => {
  try {
    const res = await api.post("/users/signupVerifyCode", { otp: otpValue, email }, { withCredentials: true });

    console.log("check");

    console.log(res);

    return res.data.data;
  } catch (error: unknown) {


    if (error instanceof AxiosError && error?.response) {
      const apiError: ApiError = {
        status: error.response.status,
        message: error.response.data.message,
        errors: error.response.data.errors || [],
      };

      throw apiError;
    }

    throw {
      status: 500,
      message: "Network error or server is down",
      errors: [],
    } as ApiError;
  }
}
export const loginUser = async (data: { username: string, password: string }): Promise<RegisterResponseDto> => {
  try {
    const res = await api.post("/users/login", data);
    return res.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error?.response) {
      const apiError: ApiError = {

        status: error.response.status,
        message: error.response.data.message,
        errors: error.response.data.errors || [],
      };

      throw apiError;
    }

    throw {
      status: 500,
      message: "Network error or server is down",
      errors: [],
    } as ApiError;
  }
}

export const getUserNames = async (prefix: string): Promise<string[]> => {
  try {
    console.log(prefix);
    let res = null;
    if (prefix != null) {
      res = await api.post("/users/getUserNames", { prefix: prefix });
    }

    return res?.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error?.response) {
      const apiError: ApiError = {

        status: error.response.status,
        message: error.response.data.message,
        errors: error.response.data.errors || [],
      };

      throw apiError;
    }

    throw {
      status: 500,
      message: "Network error or server is down",
      errors: [],
    } as ApiError;
  }
}

export const updateUsername = async (
  username: string
): Promise<{username:string}> => {
  try {
    const res = await api.patch("/users/updateUsername", { username });
    return res.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      const apiError: ApiError = {
        status: error.response.status,
        message: error.response.data.message,
        errors: error.response.data.errors || [],
      };
      throw apiError;
    }

    throw {
      status: 500,
      message: "Network error or server is down",
      errors: [],
    } as ApiError;
  }
};


export const updateAvatar = async (
  file: File
): Promise<{avatar:string}> => {
  try {
    const form = new FormData();
    form.append("avatar", file);

    const res = await api.patch("/users/updateAvatar", form);
    return res.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      const apiError: ApiError = {
        status: error.response.status,
        message: error.response.data.message,
        errors: error.response.data.errors || [],
      };
      throw apiError;
    }

    throw {
      status: 500,
      message: "Network error or server is down",
      errors: [],
    } as ApiError;
  }
};
export const updatePassword = async (
  data: { oldPassword: string; newPassword: string }
): Promise<void> => {
  try {
    const res = await api.patch("/users/updatePassword", data);
    return res.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      throw {
        status: error.response.status,
        message: error.response.data.message,
        errors: error.response.data.errors || [],
      } as ApiError;
    }

    throw {
      status: 500,
      message: "Network error or server is down",
      errors: [],
    } as ApiError;
  }
};
export const updateGroupName = (payload) =>
  api.patch("/group/update-name", payload);

export const updateGroupAvatar = (payload) => {
  const form = new FormData();
  form.append("file", payload.file);
  form.append("groupId", payload.groupId);

  return api.patch("/group/update-avatar", form);
};
