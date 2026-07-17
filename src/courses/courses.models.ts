import * as path from 'path';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { ValueWithRequiredState } from '@models/common.models';

import {
  bdMainPath,
  getValidityStateOfModel,
  isNumber,
  isString,
} from '@helpers/common.helpers';
import { areAllItemsExist } from '@helpers/items.helpers';

@Entity('courses')
export class Course implements CourseModelWithRequiredState {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  duration: number;

  @Column()
  authors: string;

  @Column()
  creationDate: string;

  // For validation purposes
  titleValidation: ValueWithRequiredState<string>;
  descriptionValidation: ValueWithRequiredState<string>;
  durationValidation: ValueWithRequiredState<number>;
  authorsValidation: ValueWithRequiredState<string[]>;

  filePath: string = path.join(bdMainPath, 'authors.json');

  constructor(
    {
      title = null,
      description = null,
      duration = null,
      authors = null,
      creationDate = null,
    }: CourseModel,
    {
      titleRequired = true,
      descriptionRequired = true,
      durationRequired = true,
      authorsRequired = true,
    }: { [key: string]: boolean } = {},
  ) {
    this.title = title;
    this.description = description;
    this.duration = duration;
    this.authors = authors ? authors.join(',') : null;
    this.creationDate = creationDate;

    this.titleValidation = {
      value: title,
      required: titleRequired,
      isValid: (title: string) => title && isString(title),
      type: 'string',
    };
    this.descriptionValidation = {
      value: description,
      required: descriptionRequired,
      isValid: (description: string) => description && isString(description),
      type: 'string',
    };
    this.durationValidation = {
      value: duration,
      required: durationRequired,
      isValid: (duration: number) => duration && isNumber(duration),
      type: 'number',
    };
    this.authorsValidation = {
      value: authors,
      required: authorsRequired,
      isValid: (authors: string[]) =>
        authors &&
        authors.length &&
        areAllItemsExist(authors, this.filePath, 'id'),
      type: 'string[] and those strings must be actual IDs.',
    };
  }

  get errorStates(): Promise<string[]> {
    return getValidityStateOfModel(this);
  }
}

interface CourseModelWithRequiredState {
  titleValidation: ValueWithRequiredState<string>;
  descriptionValidation: ValueWithRequiredState<string>;
  durationValidation: ValueWithRequiredState<number>;
  authorsValidation: ValueWithRequiredState<string[]>;
}

export interface CourseModel {
  title: string;
  description: string;
  creationDate: string;
  duration: number;
  authors: string[];
  id: string;
}
