import { createConnection } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

async function migrate() {
  const connection = await createConnection({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  const queryRunner = connection.createQueryRunner();

  await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS authors (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
  `);

  await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS courses (
      id UUID PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      duration INTEGER NOT NULL,
      creation_date DATE NOT NULL
    );
  `);

  await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS course_authors (
      course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
      author_id UUID REFERENCES authors(id) ON DELETE CASCADE,
      PRIMARY KEY (course_id, author_id)
    );
  `);

  await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'user'
    );
  `);

  const authors = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'bd/authors.json'), 'utf8'));
  for (const author of authors) {
    await queryRunner.query(
      `INSERT INTO authors (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`,
      [author.id, author.name]
    );
  }

  const courses = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'bd/courses.json'), 'utf8'));
  for (const course of courses) {
    const [month, day, year] = course.creationDate.split('/').map(Number);
    const dateFormatted = new Date(year, month - 1, day);

    await queryRunner.query(
      `INSERT INTO courses (id, title, description, duration, creation_date)
       VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
      [course.id, course.title, course.description, course.duration, dateFormatted]
    );

    for (const authorId of course.authors) {
      await queryRunner.query(
        `INSERT INTO course_authors (course_id, author_id)
         VALUES ($1, $2) ON CONFLICT (course_id, author_id) DO NOTHING`,
        [course.id, authorId]
      );
    }
  }

  const users = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'bd/users.json'), 'utf8'));
  for (const user of users) {
    await queryRunner.query(
      `INSERT INTO users (id, name, email, password, role)
       VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
      [user.id, user.name, user.email, user.password, user.role]
    );
  }

  await connection.close();
}

migrate().catch(() => process.exit(1));