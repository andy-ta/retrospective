/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { FC } from 'react';
import { IUser } from '../models/interfaces';

interface UserProps {
  user: IUser;
  userCount: number;
}

export const Username: FC<UserProps> = (props) => (
  <div className="username">
    With <b>{props.userCount - 1}</b> other{' '}
    {props.userCount == 2 ? 'person' : 'people'}
  </div>
);
