import React from "react";

interface AdminFormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

export const AdminFormField: React.FC<AdminFormFieldProps> = ({
  label,
  required,
  children,
}) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-2">
      {label} {required && "*"}
    </label>
    {children}
  </div>
);

export const adminInputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all";
