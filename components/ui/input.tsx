"use client";

import clsx from "clsx";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ForwardedRef,
} from "react";
import {
  formFieldCompactClassName,
  formFieldClassName,
  formFieldComfortableClassName,
  formMutedFieldClassName,
  formMutedFieldComfortableClassName,
  formTextAreaClassName,
} from "./fieldStyles";

type InputDensity = "compact" | "default" | "comfortable";

type InputBaseProps = {
  density?: InputDensity;
  muted?: boolean;
  className?: string;
};

type TextInputProps = InputBaseProps &
  Omit<ComponentPropsWithoutRef<"input">, "size"> & {
    as?: "input";
  };

type TextAreaProps = InputBaseProps &
  ComponentPropsWithoutRef<"textarea"> & {
    as: "textarea";
  };

export type InputProps = TextInputProps | TextAreaProps;

function getInputClassName({
  density = "default",
  muted = false,
  className,
  as,
}: Pick<InputProps, "density" | "muted" | "className" | "as">) {
  if (as === "textarea") {
    return clsx(formTextAreaClassName, muted && "ui-control-muted", className);
  }

  if (density === "compact") {
    return clsx(
      muted ? `${formFieldCompactClassName} ui-control-muted` : formFieldCompactClassName,
      className,
    );
  }

  if (density === "comfortable") {
    return clsx(
      muted ? formMutedFieldComfortableClassName : formFieldComfortableClassName,
      className,
    );
  }

  return clsx(muted ? formMutedFieldClassName : formFieldClassName, className);
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  function Input(props, ref) {
    const { density = "default", muted = false, className, as = "input", ...restProps } =
      props;

    const resolvedClassName = getInputClassName({
      density,
      muted,
      className,
      as,
    });

    if (as === "textarea") {
      const textareaProps = restProps as ComponentPropsWithoutRef<"textarea">;

      return (
        <textarea
          ref={ref as ForwardedRef<HTMLTextAreaElement>}
          className={resolvedClassName}
          {...textareaProps}
        />
      );
    }

    const inputProps = restProps as Omit<ComponentPropsWithoutRef<"input">, "size">;

    return (
      <input
        ref={ref as ForwardedRef<HTMLInputElement>}
        className={resolvedClassName}
        {...inputProps}
      />
    );
  },
);
