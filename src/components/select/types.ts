import { SelectHTMLAttributes } from "react";

type Option = {
  value: string;
  label: string;
};

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  placeholder?: string;
  options: Option[];
}
