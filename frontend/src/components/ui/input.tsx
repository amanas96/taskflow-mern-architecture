import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input(props: Props) {
  return (
    <input
      {...props}
      className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
