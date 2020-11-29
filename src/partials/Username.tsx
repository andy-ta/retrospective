/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { FC } from 'react';
import { IUser } from '../models/interfaces';

interface UserNameProps {
  user: IUser;
  userCount: number;
}

export const Username: FC<UserNameProps> = (props) => (
  <div className="userName">
    <span>{props.user.name}</span>
    <span className="userCount">
      (with {props.userCount - 1} other{' '}
      {props.userCount == 2 ? 'person' : 'people'})
    </span>
  </div>
);
