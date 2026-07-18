import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
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
  constructor(private connection: Connection) {}

  getAllAuthors(): Observable<
    SuccessfulRequest<ItemModel[] | string> | FailedRequest
  > {
    return from(this.connection.query('SELECT * FROM authors')).pipe(
      map((result) => ({
        successful: true,
        result: result as any,
      })),
    );
  }

  getAuthor(
    id: string,
  ): Observable<SuccessfulRequest<ItemModel | string> | FailedRequest> {
    return from(
      this.connection.query('SELECT * FROM authors WHERE id = $1 LIMIT 1', [id]),
    ).pipe(
      map((result) => ({
        successful: true,
        result: (result[0] || null) as any,
      })),
    );
  }

  @ModelValidation<AuthorModel, Author>(Author)
  addAuthor(
    author: AuthorModel,
  ): Observable<SuccessfulRequest<string | ItemModel> | FailedRequest> {
    const id = (author as any).id || require('crypto').randomUUID();
    return from(
      this.connection.query(
        'INSERT INTO authors (id, name) VALUES ($1, $2) RETURNING *',
        [id, author.name],
      ),
    ).pipe(
      map((result) => ({
        successful: true,
        result: result[0] as any,
      })),
    );
  }

  @ModelValidation<AuthorModel, Author>(Author)
  editAuthor(
    author: AuthorModel,
    id: string,
  ): Observable<SuccessfulRequest<string> | FailedRequest> {
    return from(
      this.connection.query('UPDATE authors SET name = $1 WHERE id = $2', [
        author.name,
        id,
      ]),
    ).pipe(
      map(() => ({
        successful: true,
        result: 'Author updated',
      })),
    );
  }

  deleteAuthor(
    id: string,
  ): Observable<SuccessfulRequest<string> | FailedRequest> {
    return from(
      this.connection.query('DELETE FROM authors WHERE id = $1', [id]),
    ).pipe(
      map(() => ({
        successful: true,
        result: 'Author deleted',
      })),
    );
  }
}