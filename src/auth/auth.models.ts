import * as path from 'path';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { ValueWithRequiredState } from '@models/common.models';

import {
  bdMainPath,
  getValidityStateOfModel,
  isString,
} from '@helpers/common.helpers';
import { areAllItemsExist } from '@helpers/items.helpers';

@Entity('users')
export class User implements UserModelWithRequiredState {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  nameValidation: ValueWithRequiredState<string>;
  emailValidation: ValueWithRequiredState<string>;
  passwordValidation: ValueWithRequiredState<string>;

  filePath: string = path.join(bdMainPath, 'users.json');

  constructor(
    { name = null, email = null, password = null, role = null }: UserModel,
    {
      nameRequired = false,
      emailRequired = true,
      passwordRequired = true,
    }: { [key: string]: boolean } = {},
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;

    this.nameValidation = {
      value: name,
      required: nameRequired,
      isValid: (name: string) => name && isString(name),
      type: 'string',
    };
    this.emailValidation = {
      value: email,
      required: emailRequired,
      isValid: (email: string) =>
        email &&
        isString(email) &&
        /.+@[^@]+\.[^@]{2,}$/.test(email) &&
        (nameRequired
          ? areAllItemsExist([email], this.filePath, 'email', true)
          : true),
      type: `string and it should be an email${
        nameRequired ? ' or email already exists' : ''
      }`,
    };
    this.passwordValidation = {
      value: password,
      required: passwordRequired,
      isValid: (password: string) =>
        password &&
        isString(password) &&
        (nameRequired ? password.length >= 6 : true),
      type: `string${
        nameRequired ? ' and length should be 6 characters minimum' : ''
      }`,
    };
  }

  get errorStates(): Promise<string[]> {
    return getValidityStateOfModel(this);
  }
}

export interface UserModel {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface UserModelWithRequiredState {
  nameValidation: ValueWithRequiredState<string>;
  emailValidation: ValueWithRequiredState<string>;
  passwordValidation: ValueWithRequiredState<string>;
}
