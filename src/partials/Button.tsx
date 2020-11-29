import React, { FC } from 'react';

interface ButtonProps extends React.AllHTMLAttributes<HTMLButtonElement> {
}

export const Button: FC<ButtonProps> = (props) => (
  <button className="button" disabled={props.disabled} onClick={props.onClick}>
    {props.children}
  </button>
);
