import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  FailedRequest,
  ItemModel,
  SuccessfulRequest,
} from '@models/common.models';

import { ModelValidation } from '@helpers/decorators';

import { Author, AuthorModel } from './authors.models';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  getAllAuthors(): Observable<
    SuccessfulRequest<ItemModel[] | string> | FailedRequest
  > {
    return from(this.authorRepository.find()).pipe(
      map((result) => ({
        successful: true,
        result: result as any,
      })),
    );
  }

  getAuthor(
    id: string,
  ): Observable<SuccessfulRequest<ItemModel | string> | FailedRequest> {
    return from(this.authorRepository.findOne(id)).pipe(
      map((result) => ({
        successful: true,
        result: result as any,
      })),
    );
  }

  @ModelValidation<AuthorModel, Author>(Author)
  addAuthor(
    author: AuthorModel,
  ): Observable<SuccessfulRequest<string | ItemModel> | FailedRequest> {
    const newAuthor = this.authorRepository.create(author);
    return from(this.authorRepository.save(newAuthor)).pipe(
      map((result) => ({
        successful: true,
        result: result as any,
      })),
    );
  }

  @ModelValidation<AuthorModel, Author>(Author)
  editAuthor(
    author: AuthorModel,
    id: string,
  ): Observable<SuccessfulRequest<string> | FailedRequest> {
    return from(
      this.authorRepository.update(id, author).then(() => 'Author updated'),
    ).pipe(
      map((result) => ({
        successful: true,
        result,
      })),
    );
  }

  deleteAuthor(
    id: string,
  ): Observable<SuccessfulRequest<string> | FailedRequest> {
    return from(
      this.authorRepository.delete(id).then(() => 'Author deleted'),
    ).pipe(
      map((result) => ({
        successful: true,
        result,
      })),
    );
  }
}
