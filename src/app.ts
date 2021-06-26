import express from "express";
import { Request, Response } from "express";
import cors from "cors";

interface repositoryProps {
  id: string;
  title: string;
  url: string;
  techs: string;
  likes: number;
}

const { v4: uuid, validate: isUuid } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = <repositoryProps[]>[];

app.get("/repositories", (request: Request, response: Response) => {
  return response.json(repositories);
});

app.post("/repositories", (request: Request, response: Response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request: Request, response: Response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const findRepositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (findRepositoryIndex === -1) {
    return response.status(400).send({ error: "Repository does not exists" });
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[findRepositoryIndex].likes,
  };

  repositories[findRepositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request: Request, response: Response) => {
  const { id } = request.params;

  const findRepositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (findRepositoryIndex >= 0) {
    repositories.splice(findRepositoryIndex, 1);
  } else {
    return response.status(400).send({ error: "Repository does not exist" });
  }

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request: Request, response: Response) => {
  const { id } = request.params;

  const findRepositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (findRepositoryIndex === -1) {
    return response.status(400).send({ error: "Repository does not exists" });
  }

  repositories[findRepositoryIndex].likes += 1;

  return response.json(repositories[findRepositoryIndex]);
});

export default app;
