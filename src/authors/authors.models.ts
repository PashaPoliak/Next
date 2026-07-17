import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ValueWithRequiredState } from '@models/common.models';

import { getValidityStateOfModel, isString } from '@helpers/common.helpers';

@Entity('authors')
export class Author implements AuthorModelWithRequiredState {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  nameValidation: ValueWithRequiredState<string>;

  constructor({ name = null }: AuthorModel) {
    this.name = name;
    this.nameValidation = {
      value: name,
      required: true,
      isValid: (name: string) => name && isString(name),
      type: 'string',
    };
  }

  get errorStates(): Promise<string[]> {
    return getValidityStateOfModel(this);
  }
}

interface AuthorModelWithRequiredState {
  nameValidation: ValueWithRequiredState<string>;
}

export interface AuthorModel {
  name: string;
  id: string;
}
