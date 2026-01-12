import { useMutation } from "@tanstack/react-query";
import { updateAvatar, updatePassword, updateUsername } from "../API/userApi";

export const useUpdateUsername = () =>
  useMutation({
    mutationFn: updateUsername,
  });

export const useUpdateAvatar = () =>
  useMutation({
    mutationFn: updateAvatar,
  });
export const useUpdatePassword = () =>
  useMutation({
    mutationFn: updatePassword,
  });
